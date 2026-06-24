// import { useEffect, useState } from 'react';
// import { adminApi } from '../../services';
// import Sidebar from '../../components/Sidebar.jsx';

// const links = [
//   { to: '/admin', label: 'Dashboard' },
//   { to: '/admin/teachers', label: 'Teachers' },
//   { to: '/admin/students', label: 'Students' },
//   { to: '/admin/courses', label: 'Courses' },
//   { to: '/admin/categories', label: 'Categories' },
//   { to: '/admin/enrollments', label: 'Enrollments' },
//   { to: '/admin/payments', label: 'Payments' },
//   { to: '/admin/certificates', label: 'Certificates' },
//   { to: '/admin/notifications', label: 'Notifications' },
//   { to: '/admin/ai-analytics', label: 'AI Analytics' },
//   { to: '/admin/profile', label: 'Profile' },
//   { to: '/admin/settings', label: 'Settings' },
// ];

// export default function AdminDashboard() {
//   const [stats, setStats] = useState(null);
//   useEffect(() => { adminApi.stats().then(r => setStats(r.data)); }, []);
//   return (
//     <div className="container dashboard">
//       <Sidebar links={links} />
//       <div>
//         <h1>Admin Dashboard</h1>
//         {stats && (
//           <div className="cards-row">
//             <div className="card stat-card"><h4>Students</h4><div className="num">{stats.students}</div></div>
//             <div className="card stat-card"><h4>Teachers</h4><div className="num">{stats.teachers}</div></div>
//             <div className="card stat-card"><h4>Courses</h4><div className="num">{stats.courses}</div></div>
//             <div className="card stat-card"><h4>Enrollments</h4><div className="num">{stats.enrollments}</div></div>
//             <div className="card stat-card"><h4>Revenue</h4><div className="num">₹{stats.revenue}</div></div>
//             <div className="card stat-card"><h4>Certificates</h4><div className="num">{stats.certificates}</div></div>
//             <div className="card stat-card"><h4>AI chats</h4><div className="num">{stats.aiInteractions}</div></div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





/**
 * AdminDashboard.jsx
 * Enterprise SaaS LMS Admin Dashboard — single self-contained file.
 * Stack: React + Tailwind CSS + Recharts
 * All original API calls preserved: adminApi.stats()
 * Added: Recharts charts, Cmd+K command palette, skeleton loaders,
 *        collapsible sidebar, AI insights panel, animated counters,
 *        error/retry state, grouped nav sections.
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { adminApi } from '../../services';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

// ─── Design tokens ─────────────────────────────────────────────────────────
const T = {
  bg:      '#0B0F19',
  surface: 'rgba(255,255,255,0.04)',
  border:  'rgba(255,255,255,0.07)',
  indigo:  '#6366F1',
  green:   '#10B981',
  red:     '#F43F5E',
  amber:   '#F59E0B',
  cyan:    '#06B6D4',
  fuchsia: '#D946EF',
  purple:  '#8B5CF6',
};

// ─── Nav structure ─────────────────────────────────────────────────────────
const NAV_SECTIONS = [
  {
    label: 'Core',
    items: [
      { to: '/admin',               label: 'Dashboard',     icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',      exact: true },
      { to: '/admin/courses',       label: 'Courses',       icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    ],
  },
  {
    label: 'Management',
    items: [
      { to: '/admin/students',      label: 'Students',      icon: 'M12 14l9-5-9-5-9 5 9 5zm0 7l-9-5 9-5 9 5-9 5z' },
      { to: '/admin/teachers',      label: 'Teachers',      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
      { to: '/admin/enrollments',   label: 'Enrollments',   icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
      { to: '/admin/categories',    label: 'Categories',    icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
      { to: '/admin/certificates',  label: 'Certificates',  icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
    ],
  },
  {
    label: 'Finance',
    items: [
      { to: '/admin/payments',      label: 'Payments',      icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    ],
  },
  {
    label: 'AI & Insights',
    items: [
      { to: '/admin/ai-analytics',  label: 'AI Analytics',  icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/admin/notifications',  label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
      { to: '/admin/profile',        label: 'Profile',       icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
      { to: '/admin/settings',       label: 'Settings',      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    ],
  },
];

// Flatten for command palette
const ALL_NAV = NAV_SECTIONS.flatMap((s) => s.items);

// ─── Mock chart data (replace with real API later) ─────────────────────────
const REVENUE_DATA = [
  { month: 'Jan', revenue: 42000, prev: 35000 },
  { month: 'Feb', revenue: 58000, prev: 42000 },
  { month: 'Mar', revenue: 51000, prev: 50000 },
  { month: 'Apr', revenue: 73000, prev: 55000 },
  { month: 'May', revenue: 89000, prev: 68000 },
  { month: 'Jun', revenue: 95000, prev: 75000 },
  { month: 'Jul', revenue: 112000, prev: 82000 },
];

const ENROLLMENT_DATA = [
  { month: 'Jan', enrollments: 120 },
  { month: 'Feb', enrollments: 185 },
  { month: 'Mar', enrollments: 162 },
  { month: 'Apr', enrollments: 240 },
  { month: 'May', enrollments: 298 },
  { month: 'Jun', enrollments: 331 },
  { month: 'Jul', enrollments: 412 },
];

const AI_USAGE_DATA = [
  { name: 'AI Tutor',   value: 38, color: T.indigo },
  { name: 'PDF Chat',   value: 24, color: T.cyan },
  { name: 'Roadmap',    value: 18, color: T.purple },
  { name: 'Quiz Gen',   value: 12, color: T.amber },
  { name: 'Other',      value: 8,  color: '#334155' },
];

const AI_INSIGHTS = [
  { icon: '📈', text: 'Student engagement', delta: '+12%', sub: 'vs last week',    positive: true },
  { icon: '💰', text: 'Revenue trending',   delta: '+8.4%', sub: 'month over month', positive: true },
  { icon: '🤖', text: 'AI chat volume',     delta: '+18%', sub: 'new conversations', positive: true },
  { icon: '🎓', text: 'Certificates issued',delta: '+31',  sub: 'this month',       positive: true },
  { icon: '⚠️', text: 'Drop-off rate',      delta: '-3.1%',sub: 'courses abandoned', positive: false },
];

const TOP_COURSES = [
  { title: 'React Mastery',          students: 892, revenue: '₹2.4L', trend: '+12%' },
  { title: 'Python for Beginners',   students: 741, revenue: '₹1.9L', trend: '+8%' },
  { title: 'Machine Learning A–Z',   students: 628, revenue: '₹3.1L', trend: '+21%' },
  { title: 'System Design Pro',      students: 512, revenue: '₹2.7L', trend: '+15%' },
  { title: 'DSA for Placement',      students: 489, revenue: '₹1.6L', trend: '+6%' },
];

// ─── Helpers ───────────────────────────────────────────────────────────────
function fmtRevenue(n) {
  if (!n && n !== 0) return '₹—';
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000)     return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
}

// ─── Animated counter ─────────────────────────────────────────────────────
function AnimCounter({ target, prefix = '', suffix = '', duration = 1400 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (!target && target !== 0) return;
    const numericTarget = typeof target === 'string' ? parseFloat(target.replace(/[^0-9.]/g, '')) : target;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(ease * numericTarget));
      if (progress < 1) ref.current = requestAnimationFrame(step);
    };
    ref.current = requestAnimationFrame(step);
    return () => ref.current && cancelAnimationFrame(ref.current);
  }, [target, duration]);

  const display = typeof target === 'string' && target.includes('.')
    ? val.toFixed(1)
    : val.toLocaleString('en-IN');

  return <span>{prefix}{display}{suffix}</span>;
}

// ─── SVG icon util ─────────────────────────────────────────────────────────
function Icon({ d, size = 'w-[18px] h-[18px]', strokeWidth = 1.8, className = '' }) {
  return (
    <svg className={`${size} ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

// ─── Skeleton loader ───────────────────────────────────────────────────────
function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-white/[0.06] rounded-xl ${className}`} />;
}

// ─── Tooltip for recharts ─────────────────────────────────────────────────
function DarkTooltip({ active, payload, label, prefix = '' }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#13182a] border border-white/10 rounded-xl px-4 py-3 shadow-2xl text-sm">
      <p className="text-white/40 text-xs mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
          <span className="text-white/70 capitalize">{p.name}:</span>
          <span className="text-white font-semibold">{prefix}{p.value?.toLocaleString('en-IN')}</span>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// SIDEBAR
// ══════════════════════════════════════════════════════════════════
function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();

  const isActive = (item) =>
    item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);

  return (
    <aside
      className="relative z-20 flex flex-col h-full border-r shrink-0 transition-all duration-300"
      style={{
        width: collapsed ? 64 : 220,
        background: 'rgba(11,15,25,0.97)',
        borderColor: T.border,
        backdropFilter: 'blur(24px)',
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 py-[18px] border-b" style={{ borderColor: T.border }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[13px] font-black text-white shrink-0"
          style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>E</div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-[14px] font-bold text-white/85 tracking-tight leading-none">EduForge</div>
            <div className="text-[10px] text-white/30 mt-0.5">Admin Console</div>
          </div>
        )}
        <button
          onClick={onToggle}
          className="ml-auto w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <svg className="w-3 h-3 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={collapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'} />
          </svg>
        </button>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-5" style={{ scrollbarWidth: 'none' }}>
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="px-3 pb-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white/25">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    title={collapsed ? item.label : undefined}
                    className="relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 group"
                    style={{
                      background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
                      border: active ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                      justifyContent: collapsed ? 'center' : undefined,
                    }}
                  >
                    {/* Active glow dot */}
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                        style={{ background: T.indigo }} />
                    )}
                    <Icon
                      d={item.icon}
                      size="w-[16px] h-[16px]"
                      className={active ? 'text-indigo-400' : 'text-white/40 group-hover:text-white/70'}
                    />
                    {!collapsed && (
                      <span className={`text-[13px] font-medium transition-colors ${active ? 'text-indigo-300' : 'text-white/50 group-hover:text-white/80'}`}>
                        {item.label}
                      </span>
                    )}
                    {!collapsed && active && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom admin badge */}
      <div className="border-t px-3 py-3" style={{ borderColor: T.border }}>
        <div
          className={`flex items-center gap-2.5 px-2 py-2 rounded-xl cursor-pointer transition-colors ${collapsed ? 'justify-center' : ''}`}
          style={{ ':hover': { background: 'rgba(255,255,255,0.04)' } }}
        >
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366F1, #D946EF)' }}>A</div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-[12px] font-semibold text-white/65 truncate">Admin</div>
              <div className="text-[10px]" style={{ color: T.green }}>● Super Admin</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

// ══════════════════════════════════════════════════════════════════
// COMMAND PALETTE (Cmd+K)
// ══════════════════════════════════════════════════════════════════
function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) { setQuery(''); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  const results = query.trim()
    ? ALL_NAV.filter((n) => n.label.toLowerCase().includes(query.toLowerCase()))
    : ALL_NAV.slice(0, 6);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      onClick={onClose}
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div
        className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#0f1420', border: `1px solid ${T.border}` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: T.border }}>
          <Icon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" size="w-4 h-4" className="text-white/30" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && onClose()}
            placeholder="Search pages, actions..."
            className="flex-1 bg-transparent text-[14px] text-white placeholder-white/25 outline-none"
          />
          <kbd className="text-[10px] text-white/25 border border-white/10 rounded px-1.5 py-0.5">ESC</kbd>
        </div>

        {/* Results */}
        <div className="py-2 max-h-72 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          {results.length === 0 ? (
            <div className="px-5 py-8 text-center text-[13px] text-white/30">No results for "{query}"</div>
          ) : (
            results.map((item) => (
              <Link key={item.to} to={item.to} onClick={onClose}
                className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-white/[0.05]">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <Icon d={item.icon} size="w-4 h-4" className="text-indigo-400" />
                </div>
                <span className="text-[13px] text-white/75">{item.label}</span>
                <span className="ml-auto text-[11px] text-white/25">Admin</span>
              </Link>
            ))
          )}
        </div>

        <div className="px-5 py-2.5 border-t flex gap-4" style={{ borderColor: T.border }}>
          {[['↑↓', 'Navigate'], ['↵', 'Open'], ['Esc', 'Close']].map(([k, v]) => (
            <span key={k} className="flex items-center gap-1.5 text-[11px] text-white/25">
              <kbd className="border border-white/10 rounded px-1 py-0.5 text-[10px]">{k}</kbd> {v}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// STAT CARD
// ══════════════════════════════════════════════════════════════════
function StatCard({ label, value, icon, prefix = '', suffix = '', delta, deltaLabel, accent, loading }) {
  const accents = {
    indigo:  { glow: 'rgba(99,102,241,0.2)',  border: 'rgba(99,102,241,0.25)',  icon: 'rgba(99,102,241,0.15)',  iconText: '#818CF8' },
    emerald: { glow: 'rgba(16,185,129,0.2)',  border: 'rgba(16,185,129,0.25)',  icon: 'rgba(16,185,129,0.15)',  iconText: '#34D399' },
    amber:   { glow: 'rgba(245,158,11,0.2)',  border: 'rgba(245,158,11,0.25)',  icon: 'rgba(245,158,11,0.15)',  iconText: '#FCD34D' },
    cyan:    { glow: 'rgba(6,182,212,0.2)',   border: 'rgba(6,182,212,0.25)',   icon: 'rgba(6,182,212,0.15)',   iconText: '#22D3EE' },
    fuchsia: { glow: 'rgba(217,70,239,0.2)',  border: 'rgba(217,70,239,0.25)',  icon: 'rgba(217,70,239,0.15)',  iconText: '#E879F9' },
    purple:  { glow: 'rgba(139,92,246,0.2)',  border: 'rgba(139,92,246,0.25)',  icon: 'rgba(139,92,246,0.15)',  iconText: '#A78BFA' },
    rose:    { glow: 'rgba(244,63,94,0.2)',   border: 'rgba(244,63,94,0.25)',   icon: 'rgba(244,63,94,0.15)',   iconText: '#FB7185' },
  };
  const c = accents[accent] || accents.indigo;
  const positive = typeof delta === 'string' ? !delta.startsWith('-') : delta >= 0;

  if (loading) {
    return (
      <div className="rounded-2xl p-5 animate-pulse" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
        <div className="flex items-center justify-between mb-5">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <Skeleton className="w-14 h-5 rounded-full" />
        </div>
        <Skeleton className="w-24 h-8 rounded-lg mb-2" />
        <Skeleton className="w-16 h-4 rounded" />
      </div>
    );
  }

  return (
    <div
      className="group rounded-2xl p-5 cursor-default transition-all duration-300 hover:scale-[1.03]"
      style={{
        background: `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))`,
        border: `1px solid ${c.border}`,
        boxShadow: `0 0 0 1px rgba(255,255,255,0.03) inset`,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 8px 40px ${c.glow}, 0 0 0 1px rgba(255,255,255,0.04) inset`; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 0 0 1px rgba(255,255,255,0.03) inset`; }}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ background: c.icon, border: `1px solid ${c.border}` }}>
          {icon}
        </div>
        {delta !== undefined && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${positive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}`}>
            <span>{positive ? '↑' : '↓'}</span>
            <span>{String(delta).replace(/^-/, '')}</span>
          </div>
        )}
      </div>
      <div className="text-[28px] font-bold leading-none mb-1.5 text-white">
        {value !== null && value !== undefined
          ? <AnimCounter target={typeof value === 'string' ? parseFloat(value.replace(/[₹,KLCr]/g, '')) || 0 : value} prefix={prefix} suffix={suffix} />
          : '—'}
      </div>
      <div className="text-[12px] font-medium text-white/40">{label}</div>
      {deltaLabel && <div className="text-[11px] text-white/25 mt-0.5">{deltaLabel}</div>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// CHARTS SECTION
// ══════════════════════════════════════════════════════════════════
function ChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

      {/* Revenue Line Chart */}
      <div className="lg:col-span-2 rounded-2xl p-6" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[15px] font-bold text-white">Revenue growth</h3>
            <p className="text-[12px] text-white/35 mt-0.5">Monthly revenue vs previous period</p>
          </div>
          <div className="flex gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-white/45"><span className="w-3 h-0.5 rounded" style={{ background: T.indigo, display: 'inline-block' }} /> This month</span>
            <span className="flex items-center gap-1.5 text-white/45"><span className="w-3 h-0.5 rounded" style={{ background: '#334155', display: 'inline-block' }} /> Prior period</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={REVENUE_DATA} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
            <Tooltip content={<DarkTooltip prefix="₹" />} />
            <Line type="monotone" dataKey="revenue" stroke={T.indigo} strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: T.indigo, strokeWidth: 0 }} />
            <Line type="monotone" dataKey="prev" stroke="#334155" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* AI Usage Donut */}
      <div className="rounded-2xl p-6" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
        <div className="mb-4">
          <h3 className="text-[15px] font-bold text-white">AI feature usage</h3>
          <p className="text-[12px] text-white/35 mt-0.5">By interaction type</p>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie data={AI_USAGE_DATA} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value">
              {AI_USAGE_DATA.map((entry, index) => (
                <Cell key={index} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={({ active, payload }) => active && payload?.[0] ? (
              <div className="bg-[#13182a] border border-white/10 rounded-xl px-3 py-2 text-xs">
                <span style={{ color: payload[0].payload.color }}>{payload[0].name}</span>
                <span className="text-white/70 ml-2">{payload[0].value}%</span>
              </div>
            ) : null} />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-2 mt-2">
          {AI_USAGE_DATA.map((d) => (
            <div key={d.name} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
              <span className="text-[11px] text-white/50 flex-1">{d.name}</span>
              <span className="text-[11px] font-semibold text-white/70">{d.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Enrollments Bar Chart */}
      <div className="lg:col-span-3 rounded-2xl p-6" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-[15px] font-bold text-white">Monthly enrollments</h3>
            <p className="text-[12px] text-white/35 mt-0.5">New student enrollments per month</p>
          </div>
          <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400">
            ↑ 24% vs last quarter
          </span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={ENROLLMENT_DATA} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<DarkTooltip />} />
            <Bar dataKey="enrollments" radius={[6, 6, 0, 0]} maxBarSize={44}>
              {ENROLLMENT_DATA.map((_, i) => (
                <Cell key={i} fill={i === ENROLLMENT_DATA.length - 1 ? T.indigo : 'rgba(99,102,241,0.35)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// AI INSIGHTS PANEL
// ══════════════════════════════════════════════════════════════════
function AIInsightsPanel() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
      {/* Header */}
      <div className="px-5 py-4 border-b flex items-center gap-2.5" style={{ borderColor: T.border }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}>
          <span className="text-sm">🤖</span>
        </div>
        <div>
          <h3 className="text-[13px] font-bold text-white">AI Insights</h3>
          <p className="text-[10px] text-white/30">Updated just now</p>
        </div>
        <span className="ml-auto flex items-center gap-1 text-[10px] font-bold text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
        </span>
      </div>

      {/* Insight rows */}
      <div className="divide-y" style={{ divideBorderColor: T.border }}>
        {AI_INSIGHTS.map((item, i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-white/[0.03]"
            style={{ borderBottom: i < AI_INSIGHTS.length - 1 ? `1px solid ${T.border}` : 'none' }}>
            <span className="text-base shrink-0">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-medium text-white/75">{item.text}</div>
              <div className="text-[10px] text-white/30">{item.sub}</div>
            </div>
            <span className={`text-[12px] font-bold ${item.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {item.delta}
            </span>
          </div>
        ))}
      </div>

      {/* Top course */}
      <div className="px-5 py-4 border-t" style={{ borderColor: T.border }}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-3">Top course this month</p>
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
            style={{ background: 'rgba(99,102,241,0.2)' }}>🚀</div>
          <div className="min-w-0">
            <div className="text-[12px] font-semibold text-white/80 truncate">React Mastery</div>
            <div className="text-[10px] text-indigo-400">892 students · ₹2.4L revenue</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// TOP COURSES TABLE
// ══════════════════════════════════════════════════════════════════
function TopCoursesTable() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: T.border }}>
        <div>
          <h3 className="text-[15px] font-bold text-white">Top performing courses</h3>
          <p className="text-[12px] text-white/35 mt-0.5">By enrollments this month</p>
        </div>
        <Link to="/admin/courses" className="text-[12px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          View all →
        </Link>
      </div>
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: `1px solid ${T.border}` }}>
            {['Course', 'Students', 'Revenue', 'Trend'].map((h) => (
              <th key={h} className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-white/25">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TOP_COURSES.map((c, i) => (
            <tr key={i} className="transition-colors hover:bg-white/[0.03]"
              style={{ borderBottom: i < TOP_COURSES.length - 1 ? `1px solid ${T.border}` : 'none' }}>
              <td className="px-6 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: `rgba(99,102,241,${0.3 - i * 0.04})` }}>{i + 1}</div>
                  <span className="text-[13px] font-medium text-white/80">{c.title}</span>
                </div>
              </td>
              <td className="px-6 py-3.5">
                <span className="text-[13px] text-white/60">{c.students.toLocaleString('en-IN')}</span>
              </td>
              <td className="px-6 py-3.5">
                <span className="text-[13px] font-semibold text-white/80">{c.revenue}</span>
              </td>
              <td className="px-6 py-3.5">
                <span className="text-[12px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">{c.trend}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MAIN ADMIN DASHBOARD
// ══════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const [stats, setStats]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [cmdOpen, setCmdOpen]   = useState(false);
  const [notifCount]            = useState(3);

  const fetchStats = useCallback(() => {
    setLoading(true);
    setError(false);
    adminApi.stats()
      .then((r) => { setStats(r.data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  useEffect(() => {
    fetchStats();

    // Cmd+K listener
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [fetchStats]);

  const STAT_CARDS = [
    { key: 'students',       label: 'Total students',    icon: '👨‍🎓', accent: 'indigo',  delta: '+12%', deltaLabel: 'vs last month' },
    { key: 'teachers',       label: 'Instructors',       icon: '🎓',  accent: 'cyan',    delta: '+3',   deltaLabel: 'new this month' },
    { key: 'courses',        label: 'Active courses',    icon: '📚',  accent: 'purple',  delta: '+8',   deltaLabel: 'published' },
    { key: 'enrollments',    label: 'Enrollments',       icon: '📋',  accent: 'emerald', delta: '+24%', deltaLabel: 'this month' },
    { key: 'revenue',        label: 'Total revenue',     icon: '💰',  accent: 'amber',   delta: '+18%', deltaLabel: 'MoM growth', isRevenue: true },
    { key: 'certificates',   label: 'Certificates',      icon: '🏅',  accent: 'fuchsia', delta: '+31',  deltaLabel: 'issued' },
    { key: 'aiInteractions', label: 'AI conversations',  icon: '🤖',  accent: 'rose',    delta: '+18%', deltaLabel: 'this week' },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: T.bg, color: '#fff' }}>

      {/* ── Ambient bg ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[700px] h-[600px] rounded-full blur-[160px]"
          style={{ background: 'rgba(99,102,241,0.07)' }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px]"
          style={{ background: 'rgba(217,70,239,0.05)' }} />
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: '200px' }} />
      </div>

      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* Main */}
      <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Topbar / Navbar ── */}
        <header className="shrink-0 flex items-center gap-4 px-6 py-4 border-b"
          style={{ background: 'rgba(11,15,25,0.85)', borderColor: T.border, backdropFilter: 'blur(20px)' }}>

          {/* Search (cmd+k) */}
          <button
            onClick={() => setCmdOpen(true)}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-[13px] text-white/35 transition-all hover:text-white/55 flex-1 max-w-sm"
            style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${T.border}` }}>
            <Icon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" size="w-4 h-4" />
            <span>Search anything…</span>
            <span className="ml-auto flex items-center gap-1 text-[11px]">
              <kbd className="border border-white/10 rounded px-1.5 py-0.5 text-[10px]">⌘</kbd>
              <kbd className="border border-white/10 rounded px-1.5 py-0.5 text-[10px]">K</kbd>
            </span>
          </button>

          <div className="flex items-center gap-2.5 ml-auto">
            {/* Notification bell */}
            <Link to="/admin/notifications" className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-white/[0.07]"
              style={{ border: `1px solid ${T.border}` }}>
              <Icon d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                size="w-4 h-4" className="text-white/55" />
              {notifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                  style={{ background: T.indigo }}>{notifCount}</span>
              )}
            </Link>

            {/* Profile */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl cursor-pointer transition-colors hover:bg-white/[0.06]"
              style={{ border: `1px solid ${T.border}` }}>
              <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #6366F1, #D946EF)' }}>A</div>
              <span className="text-[12px] font-medium text-white/65 hidden sm:block">Admin</span>
              <Icon d="M19 9l-7 7-7-7" size="w-3 h-3" className="text-white/30 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-7 space-y-7" style={{ scrollbarWidth: 'none' }}>
          <div className="max-w-[1400px] mx-auto w-full space-y-7">

            {/* Page title */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[22px] font-bold text-white tracking-tight">Dashboard</h1>
                <p className="text-[13px] text-white/35 mt-0.5">
                  {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              {error && (
                <button onClick={fetchStats}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium text-rose-400 transition-colors"
                  style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)' }}>
                  <Icon d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    size="w-4 h-4" />
                  Retry
                </button>
              )}
            </div>

            {/* Stat cards grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4">
              {STAT_CARDS.map((card) => (
                <StatCard
                  key={card.key}
                  label={card.label}
                  icon={card.icon}
                  accent={card.accent}
                  delta={card.delta}
                  deltaLabel={card.deltaLabel}
                  loading={loading}
                  value={
                    stats
                      ? card.isRevenue
                        ? parseFloat(String(stats[card.key] || 0).replace(/[^0-9.]/g, ''))
                        : stats[card.key]
                      : null
                  }
                  prefix={card.isRevenue ? '₹' : ''}
                  suffix={card.isRevenue ? '' : ''}
                />
              ))}
            </div>

            {/* Charts + AI panel row */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
              <div className="xl:col-span-3">
                <ChartsSection />
              </div>
              <div className="xl:col-span-1">
                <AIInsightsPanel />
              </div>
            </div>

            {/* Top courses table */}
            <TopCoursesTable />

            {/* Quick links */}
            <div>
              <h2 className="text-[15px] font-bold text-white mb-4">Quick actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { to: '/admin/students',     icon: '👨‍🎓', label: 'Manage students',  sub: 'View all students',        c: 'rgba(99,102,241' },
                  { to: '/admin/courses',      icon: '📚',  label: 'Manage courses',   sub: 'Publish or review',        c: 'rgba(6,182,212' },
                  { to: '/admin/payments',     icon: '💰',  label: 'View payments',    sub: 'Revenue & transactions',   c: 'rgba(245,158,11' },
                  { to: '/admin/ai-analytics', icon: '🤖',  label: 'AI Analytics',     sub: 'Usage & insights',         c: 'rgba(139,92,246' },
                ].map((item) => (
                  <Link key={item.to} to={item.to}
                    className="group flex items-center gap-3.5 px-4 py-4 rounded-2xl transition-all hover:scale-[1.02]"
                    style={{ background: `${item.c},0.1)`, border: `1px solid ${item.c},0.25)` }}>
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-white/80 group-hover:text-white transition-colors">{item.label}</div>
                      <div className="text-[11px] text-white/30">{item.sub}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Command palette */}
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
}