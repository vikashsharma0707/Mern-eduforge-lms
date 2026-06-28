// // import { useEffect, useState } from 'react';
// // import { enrollmentApi, certificateApi, quizApi } from '../../services';
// // import { useSelector } from 'react-redux';
// // import { Link } from 'react-router-dom';
// // import Sidebar from '../../components/Sidebar.jsx';

// // const links = [
// //   { to: '/dashboard', label: 'Dashboard' },
// //   { to: '/my-courses', label: 'My Courses' },
// //   { to: '/assignments', label: 'Assignments' },
// //   { to: '/quizzes', label: 'Quizzes' },
// //   { to: '/certificates', label: 'Certificates' },
// //   { to: '/ai-assistant', label: 'AI Assistant' },
// //   { to: '/roadmap', label: 'AI Roadmap' },
// //   { to: '/profile', label: 'Profile' },
// //   { to: '/settings', label: 'Settings' },
// // ];

// // export default function StudentDashboard() {
// //   const { user } = useSelector((s) => s.auth);
// //   const [enrolls, setEnrolls] = useState([]);
// //   const [certs, setCerts] = useState([]);
// //   const [attempts, setAttempts] = useState([]);

// //   useEffect(() => {
// //     enrollmentApi.list().then(r => setEnrolls(r.data));
// //     certificateApi.my().then(r => setCerts(r.data));
// //     quizApi.myAttempts().then(r => setAttempts(r.data));
// //   }, []);

// //   return (
// //     <div className="container dashboard">
// //       <Sidebar links={links} />
// //       <div>
// //         <h1>Welcome back, {user?.name} 👋</h1>
// //         <div className="cards-row">
// //           <div className="card stat-card"><h4>Enrolled</h4><div className="num">{enrolls.length}</div></div>
// //           <div className="card stat-card"><h4>Certificates</h4><div className="num">{certs.length}</div></div>
// //           <div className="card stat-card"><h4>Quiz attempts</h4><div className="num">{attempts.length}</div></div>
// //           <div className="card stat-card"><h4>XP</h4><div className="num">{user?.xp || 0}</div></div>
// //         </div>
// //         <h2 style={{ marginTop: 28 }}>Continue learning</h2>
// //         <div className="course-grid">
// //           {enrolls.slice(0, 6).map(e => (
// //             <Link to={`/learn/${e.course?.slug}`} key={e._id} className="course-card">
// //               <div className="course-body">
// //                 <h3>{e.course?.title}</h3>
// //                 <p className="muted">Progress: {e.progress}%</p>
// //                 <div style={{ height: 8, background: 'var(--surface-2)', borderRadius: 4 }}>
// //                   <div style={{ width: `${e.progress}%`, height: '100%', background: 'var(--primary)', borderRadius: 4 }} />
// //                 </div>
// //               </div>
// //             </Link>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }



// /**
//  * StudentDashboard.jsx
//  * Enterprise-grade Student Dashboard — same design system as AdminDashboard.
//  * Theme: Deep violet/indigo — "Personal Learning OS"
//  * All original API calls preserved: enrollmentApi.list(), certificateApi.my(), quizApi.myAttempts()
//  * Redux selector: useSelector(s => s.auth)
//  */

// import { useEffect, useState, useRef, useCallback } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { enrollmentApi, certificateApi, quizApi } from '../../services';
// import {
//   LineChart, Line, RadialBarChart, RadialBar,
//   XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
// } from 'recharts';

// // ─── Design tokens ─────────────────────────────────────────────────────────
// const T = {
//   bg:      '#09090F',
//   surface: 'rgba(255,255,255,0.04)',
//   border:  'rgba(255,255,255,0.07)',
//   primary: '#7C3AED',
//   violet:  '#8B5CF6',
//   fuchsia: '#D946EF',
//   cyan:    '#06B6D4',
//   emerald: '#10B981',
//   amber:   '#F59E0B',
//   rose:    '#F43F5E',
// };

// // ─── Nav ──────────────────────────────────────────────────────────────────
// const NAV = [
//   { to: '/dashboard',    label: 'Dashboard',    exact: true,
//     icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
//   { to: '/my-courses',   label: 'My Courses',
//     icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
//   { to: '/assignments',  label: 'Assignments',
//     icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
//   { to: '/quizzes',      label: 'Quizzes',
//     icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
//   { to: '/certificates', label: 'Certificates',
//     icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
//   { to: '/ai-assistant', label: 'AI Assistant',
//     icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
//   { to: '/roadmap',      label: 'AI Roadmap',
//     icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
//   { to: '/profile',      label: 'Profile',
//     icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
//   { to: '/settings',     label: 'Settings',
//     icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
// ];

// // ─── Mock activity data ────────────────────────────────────────────────────
// const ACTIVITY_DATA = [
//   { day: 'Mon', minutes: 45 },
//   { day: 'Tue', minutes: 80 },
//   { day: 'Wed', minutes: 30 },
//   { day: 'Thu', minutes: 110 },
//   { day: 'Fri', minutes: 65 },
//   { day: 'Sat', minutes: 95 },
//   { day: 'Sun', minutes: 50 },
// ];

// // ─── Helpers ───────────────────────────────────────────────────────────────
// function Icon({ d, size = 'w-[17px] h-[17px]', strokeWidth = 1.8, className = '' }) {
//   return (
//     <svg className={`${size} ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}>
//       <path strokeLinecap="round" strokeLinejoin="round" d={d} />
//     </svg>
//   );
// }

// function Skeleton({ className = '' }) {
//   return <div className={`rounded-xl animate-pulse ${className}`} style={{ background: 'rgba(255,255,255,0.06)' }} />;
// }

// function AnimCounter({ target = 0, prefix = '', suffix = '', duration = 1400 }) {
//   const [val, setVal] = useState(0);
//   const raf = useRef(null);
//   useEffect(() => {
//     if (!target && target !== 0) return;
//     let start = null;
//     const num = typeof target === 'string' ? parseFloat(target) || 0 : target;
//     const step = (ts) => {
//       if (!start) start = ts;
//       const p = Math.min((ts - start) / duration, 1);
//       setVal(Math.floor((1 - Math.pow(1 - p, 3)) * num));
//       if (p < 1) raf.current = requestAnimationFrame(step);
//     };
//     raf.current = requestAnimationFrame(step);
//     return () => raf.current && cancelAnimationFrame(raf.current);
//   }, [target, duration]);
//   return <span>{prefix}{val.toLocaleString('en-IN')}{suffix}</span>;
// }

// function DarkTooltip({ active, payload, label }) {
//   if (!active || !payload?.length) return null;
//   return (
//     <div className="rounded-xl px-4 py-3 shadow-2xl text-sm" style={{ background: '#12121f', border: '1px solid rgba(255,255,255,0.1)' }}>
//       <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
//       {payload.map((p, i) => (
//         <div key={i} className="flex items-center gap-2">
//           <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
//           <span className="font-semibold text-white">{p.value} min</span>
//         </div>
//       ))}
//     </div>
//   );
// }

// // ─── Sidebar ───────────────────────────────────────────────────────────────
// function Sidebar({ collapsed, onToggle, user }) {
//   const location = useLocation();
//   const isActive = (item) =>
//     item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);

//   return (
//     <aside
//       className="relative z-20 flex flex-col h-full shrink-0 transition-all duration-300"
//       style={{ width: collapsed ? 64 : 220, background: 'rgba(9,9,15,0.97)', borderRight: `1px solid ${T.border}`, backdropFilter: 'blur(24px)' }}
//     >
//       {/* Brand */}
//       <div className="flex items-center gap-2.5 px-4 py-[18px]" style={{ borderBottom: `1px solid ${T.border}` }}>
//         <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[13px] font-black text-white shrink-0"
//           style={{ background: 'linear-gradient(135deg, #7C3AED, #D946EF)' }}>E</div>
//         {!collapsed && (
//           <div className="min-w-0">
//             <div className="text-[14px] font-bold leading-none" style={{ color: 'rgba(255,255,255,0.85)' }}>EduForge</div>
//             <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.28)' }}>Learning OS</div>
//           </div>
//         )}
//         <button onClick={onToggle} className="ml-auto w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors hover:bg-white/10"
//           style={{ background: 'rgba(255,255,255,0.05)' }}>
//           <svg className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.4)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//             <path strokeLinecap="round" strokeLinejoin="round" d={collapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'} />
//           </svg>
//         </button>
//       </div>

//       {/* XP strip */}
//       {!collapsed && (
//         <div className="px-4 pt-4 pb-1">
//           <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.22)' }}>
//             <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: T.emerald }} />
//             <span className="text-[11px] font-semibold" style={{ color: 'rgba(167,139,250,1)' }}>Student</span>
//             {user?.xp > 0 && <span className="ml-auto text-[11px] font-bold" style={{ color: T.amber }}>⚡ {user.xp} XP</span>}
//           </div>
//         </div>
//       )}

//       {/* Nav */}
//       <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5" style={{ scrollbarWidth: 'none' }}>
//         {NAV.map((item) => {
//           const active = isActive(item);
//           return (
//             <Link key={item.to} to={item.to} title={collapsed ? item.label : undefined}
//               className="relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 group"
//               style={{
//                 background: active ? 'rgba(124,58,237,0.16)' : 'transparent',
//                 border: active ? '1px solid rgba(124,58,237,0.32)' : '1px solid transparent',
//                 justifyContent: collapsed ? 'center' : undefined,
//               }}>
//               {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full" style={{ background: T.violet }} />}
//               <Icon d={item.icon} size="w-[16px] h-[16px]"
//                 className={active ? '' : 'transition-colors'}
//                 style={{ color: active ? '#A78BFA' : 'rgba(255,255,255,0.38)' }} />
//               {!collapsed && (
//                 <span className="text-[13px] font-medium transition-colors"
//                   style={{ color: active ? '#C4B5FD' : 'rgba(255,255,255,0.48)' }}>
//                   {item.label}
//                 </span>
//               )}
//               {!collapsed && active && <span className="ml-auto w-1.5 h-1.5 rounded-full animate-pulse shrink-0" style={{ background: T.violet }} />}
//             </Link>
//           );
//         })}
//       </nav>

//       {/* User */}
//       <div className="px-3 py-3" style={{ borderTop: `1px solid ${T.border}` }}>
//         <div className={`flex items-center gap-2.5 px-2 py-2 rounded-xl cursor-pointer hover:bg-white/5 transition-colors ${collapsed ? 'justify-center' : ''}`}>
//           <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white shrink-0"
//             style={{ background: 'linear-gradient(135deg, #7C3AED, #D946EF)' }}>
//             {user?.name?.[0]?.toUpperCase() || 'S'}
//           </div>
//           {!collapsed && (
//             <div className="min-w-0">
//               <div className="text-[12px] font-semibold truncate" style={{ color: 'rgba(255,255,255,0.65)' }}>{user?.name || 'Student'}</div>
//               <div className="text-[10px]" style={{ color: T.emerald }}>● Active</div>
//             </div>
//           )}
//         </div>
//       </div>
//     </aside>
//   );
// }

// // ─── Stat Card ─────────────────────────────────────────────────────────────
// function StatCard({ label, value, icon, delta, deltaLabel, accent, loading }) {
//   const cfg = {
//     violet:  { border: 'rgba(124,58,237,0.28)',  icon: 'rgba(124,58,237,0.18)',  val: '#C4B5FD', glow: 'rgba(124,58,237,0.22)' },
//     emerald: { border: 'rgba(16,185,129,0.28)',  icon: 'rgba(16,185,129,0.18)',  val: '#6EE7B7', glow: 'rgba(16,185,129,0.22)' },
//     amber:   { border: 'rgba(245,158,11,0.28)',  icon: 'rgba(245,158,11,0.18)',  val: '#FCD34D', glow: 'rgba(245,158,11,0.22)' },
//     cyan:    { border: 'rgba(6,182,212,0.28)',   icon: 'rgba(6,182,212,0.18)',   val: '#67E8F9', glow: 'rgba(6,182,212,0.22)' },
//     fuchsia: { border: 'rgba(217,70,239,0.28)',  icon: 'rgba(217,70,239,0.18)',  val: '#F0ABFC', glow: 'rgba(217,70,239,0.22)' },
//   }[accent] || {};

//   if (loading) return (
//     <div className="rounded-2xl p-5 animate-pulse" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
//       <div className="flex justify-between mb-4"><Skeleton className="w-10 h-10" /><Skeleton className="w-14 h-5 rounded-full" /></div>
//       <Skeleton className="w-24 h-8 mb-2" /><Skeleton className="w-20 h-4" />
//     </div>
//   );

//   const pos = typeof delta === 'string' ? !delta.startsWith('-') : delta >= 0;

//   return (
//     <div className="rounded-2xl p-5 transition-all duration-300 hover:scale-[1.03] cursor-default"
//       style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))', border: `1px solid ${cfg.border}` }}
//       onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 8px 40px ${cfg.glow}`; }}
//       onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}>
//       <div className="flex items-center justify-between mb-5">
//         <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
//           style={{ background: cfg.icon, border: `1px solid ${cfg.border}` }}>{icon}</div>
//         {delta !== undefined && (
//           <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${pos ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}`}>
//             {pos ? '↑' : '↓'} {String(delta).replace(/^-/, '')}
//           </div>
//         )}
//       </div>
//       <div className="text-[30px] font-bold leading-none mb-1.5" style={{ color: cfg.val }}>
//         {value !== null && value !== undefined ? <AnimCounter target={value} /> : '—'}
//       </div>
//       <div className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.38)' }}>{label}</div>
//       {deltaLabel && <div className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.22)' }}>{deltaLabel}</div>}
//     </div>
//   );
// }

// // ─── Course progress card ──────────────────────────────────────────────────
// function CourseCard({ e }) {
//   const p = e.progress || 0;
//   const done = p === 100;
//   return (
//     <Link to={`/learn/${e.course?.slug}`}
//       className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-200 hover:scale-[1.02]"
//       style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
//       onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(124,58,237,0.15)'; }}
//       onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none'; }}>
//       {/* Progress bar top strip */}
//       <div className="h-[3px] w-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
//         <div className="h-full transition-all duration-700"
//           style={{ width: `${p}%`, background: done ? T.emerald : 'linear-gradient(90deg, #7C3AED, #D946EF)' }} />
//       </div>
//       <div className="p-5 flex-1 flex flex-col">
//         <div className="flex items-start justify-between gap-2 mb-3">
//           <span className="text-[10px] font-bold uppercase tracking-widest"
//             style={{ color: 'rgba(167,139,250,0.7)' }}>{e.course?.category || 'Course'}</span>
//           <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${done ? 'bg-emerald-500/15 text-emerald-400' : 'bg-violet-500/10 text-violet-400'}`}>
//             {done ? '✓ Done' : 'In progress'}
//           </span>
//         </div>
//         <h3 className="text-[14px] font-semibold leading-snug line-clamp-2 mb-auto transition-colors"
//           style={{ color: 'rgba(255,255,255,0.82)' }}>
//           {e.course?.title || 'Untitled'}
//         </h3>
//         <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
//           <div className="flex justify-between mb-2">
//             <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.38)' }}>{p}% complete</span>
//             <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.24)' }}>{100 - p}% left</span>
//           </div>
//           <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
//             <div className="h-full rounded-full transition-all duration-700"
//               style={{ width: `${p}%`, background: done ? T.emerald : 'linear-gradient(90deg, #7C3AED, #D946EF)' }} />
//           </div>
//         </div>
//       </div>
//       <div className="px-5 pb-4">
//         <span className="text-[11px] font-semibold flex items-center gap-1 transition-colors"
//           style={{ color: '#A78BFA' }}>
//           {done ? 'View certificate' : 'Continue learning'}
//           <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//             <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//           </svg>
//         </span>
//       </div>
//     </Link>
//   );
// }

// // ─── AI Quick Actions ─────────────────────────────────────────────────────
// const AI_TOOLS = [
//   { to: '/ai-assistant', icon: '🤖', label: 'AI Tutor',      sub: 'Explain any concept',     border: 'rgba(124,58,237,0.28)', bg: 'rgba(124,58,237,0.1)' },
//   { to: '/ai-assistant', icon: '⚡', label: 'Quiz Me',       sub: 'Practice questions',       border: 'rgba(245,158,11,0.28)', bg: 'rgba(245,158,11,0.1)' },
//   { to: '/ai-assistant', icon: '📄', label: 'PDF Chat',      sub: 'Ask from your textbook',   border: 'rgba(6,182,212,0.28)',  bg: 'rgba(6,182,212,0.1)'  },
//   { to: '/roadmap',      icon: '🗺️', label: 'Career Plan',  sub: 'AI-generated roadmap',     border: 'rgba(16,185,129,0.28)', bg: 'rgba(16,185,129,0.1)' },
// ];

// // ─── Learning streak widget ────────────────────────────────────────────────
// function StreakWidget({ enrolls }) {
//   const avgProg = enrolls.length
//     ? Math.round(enrolls.reduce((s, e) => s + (e.progress || 0), 0) / enrolls.length)
//     : 0;
//   const data = [{ name: 'Progress', value: avgProg, fill: '#7C3AED' }];
//   return (
//     <div className="rounded-2xl p-5" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <h3 className="text-[14px] font-bold text-white">Overall progress</h3>
//           <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Across all courses</p>
//         </div>
//         <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-400">
//           {avgProg}% avg
//         </span>
//       </div>
//       <ResponsiveContainer width="100%" height={180}>
//         <RadialBarChart cx="50%" cy="50%" innerRadius="55%" outerRadius="85%"
//           data={[{ name: 'bg', value: 100, fill: 'rgba(255,255,255,0.06)' }, { ...data[0] }]}
//           startAngle={90} endAngle={-270}>
//           <RadialBar dataKey="value" cornerRadius={8} />
//         </RadialBarChart>
//       </ResponsiveContainer>
//       <div className="text-center -mt-14">
//         <div className="text-[30px] font-bold text-violet-300">{avgProg}%</div>
//         <div className="text-[11px] text-white/35 mt-0.5">
//           {enrolls.filter(e => (e.progress || 0) === 100).length}/{enrolls.length} completed
//         </div>
//       </div>
//       <div className="mt-4 h-1" />
//     </div>
//   );
// }

// // ─── Weekly activity chart ─────────────────────────────────────────────────
// function ActivityChart() {
//   return (
//     <div className="rounded-2xl p-5" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <h3 className="text-[14px] font-bold text-white">Weekly activity</h3>
//           <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Learning minutes per day</p>
//         </div>
//         <span className="text-[11px] font-bold text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10">↑ Active week</span>
//       </div>
//       <ResponsiveContainer width="100%" height={140}>
//         <LineChart data={ACTIVITY_DATA} margin={{ top: 4, right: 4, left: -28, bottom: 4 }}>
//           <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
//           <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
//           <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
//           <Tooltip content={<DarkTooltip />} />
//           <Line type="monotone" dataKey="minutes" stroke={T.violet} strokeWidth={2.5} dot={false}
//             activeDot={{ r: 5, fill: T.violet, strokeWidth: 0 }} />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

// // ══════════════════════════════════════════════════════════════════
// // MAIN
// // ══════════════════════════════════════════════════════════════════
// export default function StudentDashboard() {
//   const { user } = useSelector((s) => s.auth);
//   const [enrolls,  setEnrolls]  = useState([]);
//   const [certs,    setCerts]    = useState([]);
//   const [attempts, setAttempts] = useState([]);
//   const [loading,  setLoading]  = useState(true);
//   const [collapsed, setCollapsed] = useState(false);

//   useEffect(() => {
//     Promise.all([
//       enrollmentApi.list().then((r) => setEnrolls(r.data)),
//       certificateApi.my().then((r)  => setCerts(r.data)),
//       quizApi.myAttempts().then((r) => setAttempts(r.data)),
//     ]).finally(() => setLoading(false));
//   }, []);

//   const h = new Date().getHours();
//   const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
//   const inProgress = enrolls.filter((e) => (e.progress || 0) > 0 && (e.progress || 0) < 100).length;

//   return (
//     <div className="flex h-screen w-full overflow-hidden" style={{ background: T.bg, color: '#fff' }}>

//       {/* Ambient */}
//       <div className="fixed inset-0 pointer-events-none overflow-hidden">
//         <div className="absolute -top-40 -left-40 w-[700px] h-[600px] rounded-full blur-[160px]"
//           style={{ background: 'rgba(124,58,237,0.09)' }} />
//         <div className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full blur-[140px]"
//           style={{ background: 'rgba(217,70,239,0.06)' }} />
//       </div>

//       <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} user={user} />

//       <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden">

//         {/* Topbar */}
//         <header className="shrink-0 flex items-center justify-between px-6 py-4"
//           style={{ background: 'rgba(9,9,15,0.85)', borderBottom: `1px solid ${T.border}`, backdropFilter: 'blur(20px)' }}>
//           <div>
//             <h1 className="text-[19px] font-bold text-white tracking-tight">
//               {greeting}, {user?.name?.split(' ')[0] || 'there'} 👋
//             </h1>
//             <p className="text-[12px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
//               {inProgress > 0
//                 ? `${inProgress} course${inProgress > 1 ? 's' : ''} in progress — keep going!`
//                 : 'Ready to learn something amazing today?'}
//             </p>
//           </div>
//           <div className="flex items-center gap-2.5">
//             {user?.xp > 0 && (
//               <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full"
//                 style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}>
//                 <span>⚡</span>
//                 <span className="text-[12px] font-bold" style={{ color: T.amber }}>{user.xp} XP</span>
//               </div>
//             )}
//             <Link to="/ai-assistant"
//               className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-[13px] font-semibold transition-all hover:opacity-90"
//               style={{ background: 'linear-gradient(135deg, #7C3AED, #D946EF)', boxShadow: '0 4px 20px rgba(124,58,237,0.35)' }}>
//               🤖 Ask AI
//             </Link>
//           </div>
//         </header>

//         {/* Body */}
//         <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7" style={{ scrollbarWidth: 'none' }}>
//           <div className="max-w-[1300px] mx-auto w-full space-y-7">

//             {/* Stats */}
//             <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
//               <StatCard label="Enrolled courses"  value={enrolls.length}  icon="📚" accent="violet"  delta="+2"   deltaLabel="this month"  loading={loading} />
//               <StatCard label="Certificates"       value={certs.length}    icon="🎓" accent="emerald" delta={`+${certs.length}`} deltaLabel="earned total" loading={loading} />
//               <StatCard label="Quiz attempts"      value={attempts.length} icon="⚡" accent="amber"   delta="+5"   deltaLabel="this week"   loading={loading} />
//               <StatCard label="XP earned"          value={user?.xp || 0}   icon="🏆" accent="fuchsia" delta="+120" deltaLabel="this week"   loading={loading} />
//             </div>

//             {/* Charts row */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
//               <div className="lg:col-span-1"><StreakWidget enrolls={enrolls} /></div>
//               <div className="lg:col-span-2"><ActivityChart /></div>
//             </div>

//             {/* AI Tools */}
//             <section>
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-[15px] font-bold text-white">AI-powered tools</h2>
//                 <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 flex items-center gap-1.5">
//                   <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> All online
//                 </span>
//               </div>
//               <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
//                 {AI_TOOLS.map((item) => (
//                   <Link key={item.label} to={item.to}
//                     className="group flex items-center gap-3.5 px-4 py-4 rounded-2xl transition-all hover:scale-[1.02]"
//                     style={{ background: item.bg, border: `1px solid ${item.border}` }}>
//                     <span className="text-2xl shrink-0">{item.icon}</span>
//                     <div className="min-w-0">
//                       <div className="text-[13px] font-semibold text-white/80 group-hover:text-white transition-colors">{item.label}</div>
//                       <div className="text-[11px] text-white/32">{item.sub}</div>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             </section>

//             {/* Continue learning */}
//             <section>
//               <div className="flex items-center justify-between mb-5">
//                 <div>
//                   <h2 className="text-[15px] font-bold text-white">Continue learning</h2>
//                   <p className="text-[12px] mt-0.5 text-white/35">
//                     {enrolls.length > 0 ? `${enrolls.length} course${enrolls.length > 1 ? 's' : ''} enrolled` : 'No courses yet'}
//                   </p>
//                 </div>
//                 <Link to="/my-courses" className="text-[12px] font-medium hover:text-white/80 transition-colors flex items-center gap-1"
//                   style={{ color: '#A78BFA' }}>
//                   View all
//                   <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
//                 </Link>
//               </div>

//               {loading ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
//                   {[1,2,3].map(i => <Skeleton key={i} className="h-52" />)}
//                 </div>
//               ) : enrolls.length > 0 ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
//                   {enrolls.slice(0, 6).map((e) => <CourseCard key={e._id} e={e} />)}
//                 </div>
//               ) : (
//                 <div className="flex flex-col items-center justify-center py-16 rounded-2xl"
//                   style={{ border: '2px dashed rgba(255,255,255,0.08)' }}>
//                   <span className="text-5xl mb-4 opacity-40">📚</span>
//                   <h3 className="text-[15px] font-semibold text-white/50 mb-2">No courses enrolled yet</h3>
//                   <p className="text-[13px] text-white/30 mb-6">Browse hundreds of AI-powered courses</p>
//                   <Link to="/courses" className="px-5 py-2.5 rounded-xl text-white text-[13px] font-semibold transition-all hover:opacity-90"
//                     style={{ background: 'linear-gradient(135deg, #7C3AED, #D946EF)' }}>
//                     Explore courses →
//                   </Link>
//                 </div>
//               )}
//             </section>

//             {/* Quiz history */}
//             {attempts.length > 0 && (
//               <section>
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="text-[15px] font-bold text-white">Recent quiz attempts</h2>
//                   <Link to="/quizzes" className="text-[12px] font-medium hover:text-white/80 transition-colors" style={{ color: '#A78BFA' }}>View all</Link>
//                 </div>
//                 <div className="rounded-2xl overflow-hidden" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
//                   {attempts.slice(0, 5).map((a, i) => (
//                     <div key={a._id || i}
//                       className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.03] transition-colors"
//                       style={{ borderBottom: i < Math.min(attempts.length, 5) - 1 ? `1px solid ${T.border}` : 'none' }}>
//                       <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
//                           style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.22)' }}>⚡</div>
//                         <div>
//                           <div className="text-[13px] font-medium text-white/78">{a.quiz?.title || 'Quiz'}</div>
//                           <div className="text-[11px] text-white/30">{new Date(a.createdAt).toLocaleDateString('en-IN')}</div>
//                         </div>
//                       </div>
//                       <span className={`text-[13px] font-bold px-3 py-1 rounded-full ${(a.score || 0) >= 70 ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}`}>
//                         {a.score ?? '—'}%
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </section>
//             )}

//             {/* Certs */}
//             {certs.length > 0 && (
//               <section>
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="text-[15px] font-bold text-white">Certificates earned</h2>
//                   <Link to="/certificates" className="text-[12px] font-medium hover:text-white/80 transition-colors" style={{ color: '#A78BFA' }}>View all</Link>
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
//                   {certs.slice(0, 3).map((c, i) => (
//                     <div key={c._id || i} className="flex items-center gap-4 px-5 py-4 rounded-2xl"
//                       style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.22)' }}>
//                       <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
//                         style={{ background: 'rgba(16,185,129,0.15)' }}>🎓</div>
//                       <div className="min-w-0">
//                         <div className="text-[13px] font-semibold text-white/80 truncate">{c.course?.title || 'Course'}</div>
//                         <div className="text-[11px] mt-0.5" style={{ color: T.emerald }}>
//                           Issued · {new Date(c.issuedAt || c.createdAt).toLocaleDateString('en-IN')}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </section>
//             )}

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { enrollmentApi, certificateApi, quizApi } from '../../services';
import {
  LineChart, Line, RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// ─── Design tokens ─────────────────────────────────────────────────────────
const T = {
  bg:      '#09090F',
  surface: 'rgba(255,255,255,0.04)',
  border:  'rgba(255,255,255,0.07)',
  primary: '#7C3AED',
  violet:  '#8B5CF6',
  fuchsia: '#D946EF',
  cyan:    '#06B6D4',
  emerald: '#10B981',
  amber:   '#F59E0B',
  rose:    '#F43F5E',
};

// ─── Nav Data (for reference only, actual nav is in Layout) ───────────────
const NAV = [
  { to: '/dashboard',    label: 'Dashboard',    exact: true,
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  // ... baaki items (agar future mein zarurat pade)
];

// ─── Mock activity data ────────────────────────────────────────────────────
const ACTIVITY_DATA = [
  { day: 'Mon', minutes: 45 },
  { day: 'Tue', minutes: 80 },
  { day: 'Wed', minutes: 30 },
  { day: 'Thu', minutes: 110 },
  { day: 'Fri', minutes: 65 },
  { day: 'Sat', minutes: 95 },
  { day: 'Sun', minutes: 50 },
];

// ─── Helpers ───────────────────────────────────────────────────────────────
function Icon({ d, size = 'w-[17px] h-[17px]', strokeWidth = 1.8, className = '' }) {
  return (
    <svg className={`${size} ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

function Skeleton({ className = '' }) {
  return <div className={`rounded-xl animate-pulse ${className}`} style={{ background: 'rgba(255,255,255,0.06)' }} />;
}

function AnimCounter({ target = 0, prefix = '', suffix = '', duration = 1400 }) {
  const [val, setVal] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    if (target === null || target === undefined) return;
    let start = null;
    const num = typeof target === 'string' ? parseFloat(target) || 0 : target;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * num));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => raf.current && cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return <span>{prefix}{val.toLocaleString('en-IN')}{suffix}</span>;
}

function DarkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-4 py-3 shadow-2xl text-sm" style={{ background: '#12121f', border: '1px solid rgba(255,255,255,0.1)' }}>
      <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="font-semibold text-white">{p.value} min</span>
        </div>
      ))}
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, delta, deltaLabel, accent, loading }) {
  const cfg = {
    violet:  { border: 'rgba(124,58,237,0.28)', icon: 'rgba(124,58,237,0.18)', val: '#C4B5FD', glow: 'rgba(124,58,237,0.22)' },
    emerald: { border: 'rgba(16,185,129,0.28)', icon: 'rgba(16,185,129,0.18)', val: '#6EE7B7', glow: 'rgba(16,185,129,0.22)' },
    amber:   { border: 'rgba(245,158,11,0.28)', icon: 'rgba(245,158,11,0.18)', val: '#FCD34D', glow: 'rgba(245,158,11,0.22)' },
    cyan:    { border: 'rgba(6,182,212,0.28)',  icon: 'rgba(6,182,212,0.18)',  val: '#67E8F9', glow: 'rgba(6,182,212,0.22)' },
    fuchsia: { border: 'rgba(217,70,239,0.28)', icon: 'rgba(217,70,239,0.18)', val: '#F0ABFC', glow: 'rgba(217,70,239,0.22)' },
  }[accent] || {};

  if (loading) {
    return (
      <div className="rounded-2xl p-5 animate-pulse" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
        <div className="flex justify-between mb-4"><Skeleton className="w-10 h-10" /><Skeleton className="w-14 h-5 rounded-full" /></div>
        <Skeleton className="w-24 h-8 mb-2" /><Skeleton className="w-20 h-4" />
      </div>
    );
  }

  const pos = typeof delta === 'string' ? !delta.startsWith('-') : delta >= 0;

  return (
    <div className="rounded-2xl p-5 transition-all duration-300 hover:scale-[1.03]" 
      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))', border: `1px solid ${cfg.border}` }}>
      <div className="flex items-center justify-between mb-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ background: cfg.icon, border: `1px solid ${cfg.border}` }}>{icon}</div>
        {delta !== undefined && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${pos ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}`}>
            {pos ? '↑' : '↓'} {String(delta).replace(/^-/, '')}
          </div>
        )}
      </div>
      <div className="text-[30px] font-bold leading-none mb-1.5" style={{ color: cfg.val }}>
        {value !== null && value !== undefined ? <AnimCounter target={value} /> : '—'}
      </div>
      <div className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.38)' }}>{label}</div>
      {deltaLabel && <div className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.22)' }}>{deltaLabel}</div>}
    </div>
  );
}

// ─── Course Card, StreakWidget, ActivityChart, AI_TOOLS ─────────────────────
function CourseCard({ e }) {
  const p = e.progress || 0;
  const done = p === 100;
  return (
    <Link to={`/learn/${e.course?.slug}`} className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-200 hover:scale-[1.02]"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="h-[3px] w-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div className="h-full transition-all duration-700" style={{ width: `${p}%`, background: done ? T.emerald : 'linear-gradient(90deg, #7C3AED, #D946EF)' }} />
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(167,139,250,0.7)' }}>
            {e.course?.category || 'Course'}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${done ? 'bg-emerald-500/15 text-emerald-400' : 'bg-violet-500/10 text-violet-400'}`}>
            {done ? '✓ Done' : 'In progress'}
          </span>
        </div>
        <h3 className="text-[14px] font-semibold leading-snug line-clamp-2 mb-auto" style={{ color: 'rgba(255,255,255,0.82)' }}>
          {e.course?.title || 'Untitled'}
        </h3>
        <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex justify-between mb-2">
            <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.38)' }}>{p}% complete</span>
            <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.24)' }}>{100 - p}% left</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${p}%`, background: done ? T.emerald : 'linear-gradient(90deg, #7C3AED, #D946EF)' }} />
          </div>
        </div>
      </div>
      <div className="px-5 pb-4">
        <span className="text-[11px] font-semibold flex items-center gap-1" style={{ color: '#A78BFA' }}>
          {done ? 'View certificate' : 'Continue learning'}
        </span>
      </div>
    </Link>
  );
}

const AI_TOOLS = [
  { to: '/ai-assistant', icon: '🤖', label: 'AI Tutor', sub: 'Explain any concept' },
  { to: '/ai-assistant', icon: '⚡', label: 'Quiz Me', sub: 'Practice questions' },
  { to: '/ai-assistant', icon: '📄', label: 'PDF Chat', sub: 'Ask from your textbook' },
  { to: '/roadmap', icon: '🗺️', label: 'Career Plan', sub: 'AI-generated roadmap' },
];

function StreakWidget({ enrolls }) {
  const avgProg = enrolls.length ? Math.round(enrolls.reduce((s, e) => s + (e.progress || 0), 0) / enrolls.length) : 0;
  return (
    <div className="rounded-2xl p-5" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-bold text-white">Overall progress</h3>
          <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Across all courses</p>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-400">{avgProg}% avg</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <RadialBarChart cx="50%" cy="50%" innerRadius="55%" outerRadius="85%" data={[{ name: 'bg', value: 100, fill: 'rgba(255,255,255,0.06)' }, { name: 'Progress', value: avgProg, fill: '#7C3AED' }]}>
          <RadialBar dataKey="value" cornerRadius={8} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="text-center -mt-14">
        <div className="text-[30px] font-bold text-violet-300">{avgProg}%</div>
        <div className="text-[11px] text-white/35 mt-0.5">
          {enrolls.filter(e => (e.progress || 0) === 100).length}/{enrolls.length} completed
        </div>
      </div>
    </div>
  );
}

function ActivityChart() {
  return (
    <div className="rounded-2xl p-5" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-bold text-white">Weekly activity</h3>
          <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Learning minutes per day</p>
        </div>
        <span className="text-[11px] font-bold text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10">↑ Active week</span>
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <LineChart data={ACTIVITY_DATA} margin={{ top: 4, right: 4, left: -28, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<DarkTooltip />} />
          <Line type="monotone" dataKey="minutes" stroke={T.violet} strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: T.violet }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ══════════════════════════════════════════════════════════════════
export default function StudentDashboard() {
  const { user } = useSelector((s) => s.auth);
  const [enrolls, setEnrolls] = useState([]);
  const [certs, setCerts] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      enrollmentApi.list().then(r => setEnrolls(r.data)),
      certificateApi.my().then(r => setCerts(r.data)),
      quizApi.myAttempts().then(r => setAttempts(r.data)),
    ]).finally(() => setLoading(false));
  }, []);

  const h = new Date().getHours();
  const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const inProgress = enrolls.filter(e => (e.progress || 0) > 0 && (e.progress || 0) < 100).length;

  return (
    <div className="min-h-full" style={{ background: T.bg, color: '#fff' }}>
      {/* Greeting Header */}
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-[22px] font-bold tracking-tight">
          {greeting}, {user?.name?.split(' ')[0] || 'there'} 👋
        </h1>
        <p className="text-[13px] mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {inProgress > 0 
            ? `${inProgress} course${inProgress > 1 ? 's' : ''} in progress — keep going!` 
            : 'Ready to learn something amazing today?'}
        </p>
      </div>

      <div className="px-6 pb-8 space-y-8">
        <div className="max-w-[1350px] mx-auto space-y-8">

          {/* Stats */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
            <StatCard label="Enrolled courses" value={enrolls.length} icon="📚" accent="violet" delta="+2" deltaLabel="this month" loading={loading} />
            <StatCard label="Certificates" value={certs.length} icon="🎓" accent="emerald" delta={`+${certs.length}`} deltaLabel="earned total" loading={loading} />
            <StatCard label="Quiz attempts" value={attempts.length} icon="⚡" accent="amber" delta="+5" deltaLabel="this week" loading={loading} />
            <StatCard label="XP earned" value={user?.xp || 0} icon="🏆" accent="fuchsia" delta="+120" deltaLabel="this week" loading={loading} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <StreakWidget enrolls={enrolls} />
            <div className="lg:col-span-2"><ActivityChart /></div>
          </div>

          {/* AI Tools */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[15px] font-bold">AI-powered tools</h2>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> All online
              </span>
            </div>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              {AI_TOOLS.map((item, i) => (
                <Link key={i} to={item.to} className="group flex items-center gap-4 px-5 py-5 rounded-2xl transition-all hover:scale-105"
                  style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <div className="font-semibold text-white">{item.label}</div>
                    <div className="text-xs text-white/40">{item.sub}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Continue Learning */}
          <section>
            <div className="flex justify-between items-end mb-5">
              <div>
                <h2 className="text-[15px] font-bold">Continue learning</h2>
                <p className="text-sm text-white/40">{enrolls.length} courses enrolled</p>
              </div>
              <Link to="/my-courses" className="text-violet-400 text-sm font-medium hover:text-violet-300">View all →</Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {[1,2,3].map(i => <Skeleton key={i} className="h-64" />)}
              </div>
            ) : enrolls.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {enrolls.slice(0, 6).map(e => <CourseCard key={e._id} e={e} />)}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
                <p className="text-6xl mb-4">📚</p>
                <h3 className="text-xl font-medium mb-2">No courses yet</h3>
                <Link to="/courses" className="inline-block mt-4 px-8 py-3 bg-violet-600 hover:bg-violet-500 rounded-2xl font-medium">
                  Browse Courses
                </Link>
              </div>
            )}
          </section>

          {/* Recent Quizzes & Certificates (same as before) */}
          {/* ... aap in sections ko same rakh sakte ho ... */}

        </div>
      </div>
    </div>
  );
}