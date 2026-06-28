// // import { useEffect, useState } from 'react';
// // import { courseApi } from '../../services';
// // import Sidebar from '../../components/Sidebar.jsx';
// // import { Link } from 'react-router-dom';

// // const links = [
// //   { to: '/teacher', label: 'Dashboard' },
// //   { to: '/teacher/courses', label: 'Courses' },
// //   { to: '/teacher/assignments', label: 'Assignments' },
// //   { to: '/teacher/quizzes', label: 'Quizzes' },
// //   { to: '/teacher/students', label: 'Students' },
// //   { to: '/teacher/analytics', label: 'Analytics' },
// //   { to: '/teacher/profile', label: 'Profile' },
// //   { to: '/teacher/settings', label: 'Settings' },
// // ];

// // export default function TeacherDashboard() {
// //   const [courses, setCourses] = useState([]);
// //   useEffect(() => { courseApi.myOwned().then(r => setCourses(r.data)); }, []);
// //   const total = courses.reduce((s, c) => s + (c.enrollmentCount || 0), 0);
// //   return (
// //     <div className="container dashboard">
// //       <Sidebar links={links} />
// //       <div>
// //         <h1>Teacher Dashboard</h1>
// //         <div className="cards-row">
// //           <div className="card stat-card"><h4>Courses</h4><div className="num">{courses.length}</div></div>
// //           <div className="card stat-card"><h4>Total students</h4><div className="num">{total}</div></div>
// //           <div className="card stat-card"><h4>Published</h4><div className="num">{courses.filter(c => c.isPublished).length}</div></div>
// //         </div>
// //         <div style={{ marginTop: 24 }}>
// //           <Link to="/teacher/courses/new" className="btn btn-primary">+ Create new course</Link>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }




// /**
//  * TeacherDashboard.jsx
//  * Enterprise-grade Instructor Dashboard — same design system as AdminDashboard.
//  * Theme: Deep cyan/teal — "Instructor Command Center"
//  * All original API calls preserved: courseApi.myOwned()
//  * Added: Recharts bar chart, engagement panel, student table, skeleton loaders.
//  */

// import { useEffect, useState, useRef } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { courseApi } from '../../services';
// import {
//   BarChart, Bar, LineChart, Line,
//   XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
// } from 'recharts';

// // ─── Design tokens ─────────────────────────────────────────────────────────
// const T = {
//   bg:      '#08100F',
//   surface: 'rgba(255,255,255,0.04)',
//   border:  'rgba(255,255,255,0.07)',
//   cyan:    '#06B6D4',
//   teal:    '#0D9488',
//   emerald: '#10B981',
//   amber:   '#F59E0B',
//   violet:  '#8B5CF6',
//   rose:    '#F43F5E',
// };

// // ─── Nav ──────────────────────────────────────────────────────────────────
// const NAV = [
//   { to: '/teacher',             label: 'Dashboard',   exact: true,
//     icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
//   { to: '/teacher/courses',     label: 'Courses',
//     icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
//   { to: '/teacher/assignments', label: 'Assignments',
//     icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
//   { to: '/teacher/quizzes',     label: 'Quizzes',
//     icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
//   { to: '/teacher/students',    label: 'Students',
//     icon: 'M12 14l9-5-9-5-9 5 9 5zm0 7l-9-5 9-5 9 5-9 5z' },
//   { to: '/teacher/analytics',   label: 'Analytics',
//     icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
//   { to: '/teacher/profile',     label: 'Profile',
//     icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
//   { to: '/teacher/settings',    label: 'Settings',
//     icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
// ];

// // ─── Mock data ─────────────────────────────────────────────────────────────
// const ENROLLMENT_TREND = [
//   { month: 'Feb', students: 34 },
//   { month: 'Mar', students: 52 },
//   { month: 'Apr', students: 48 },
//   { month: 'May', students: 71 },
//   { month: 'Jun', students: 89 },
//   { month: 'Jul', students: 112 },
// ];

// const ENGAGEMENT_DATA = [
//   { label: 'Avg completion', value: 74, color: T.cyan },
//   { label: 'Quiz pass rate',  value: 81, color: T.emerald },
//   { label: 'Assignment done', value: 63, color: T.amber },
//   { label: 'Cert issued',     value: 48, color: T.violet },
// ];

// // ─── Helpers ───────────────────────────────────────────────────────────────
// function Icon({ d, size = 'w-[17px] h-[17px]', strokeWidth = 1.8, style, className = '' }) {
//   return (
//     <svg className={`${size} ${className}`} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}>
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
//     const num = typeof target === 'string' ? parseFloat(target) || 0 : target;
//     let start = null;
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
//     <div className="rounded-xl px-4 py-3 shadow-2xl text-sm" style={{ background: '#0a1a18', border: '1px solid rgba(255,255,255,0.1)' }}>
//       <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
//       {payload.map((p, i) => (
//         <div key={i} className="flex items-center gap-2">
//           <span className="w-2 h-2 rounded-full" style={{ background: p.color || T.cyan }} />
//           <span className="font-semibold text-white">{p.value}</span>
//         </div>
//       ))}
//     </div>
//   );
// }

// // ─── Sidebar ───────────────────────────────────────────────────────────────
// function Sidebar({ collapsed, onToggle }) {
//   const location = useLocation();
//   const isActive = (item) =>
//     item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);

//   return (
//     <aside
//       className="relative z-20 flex flex-col h-full shrink-0 transition-all duration-300"
//       style={{ width: collapsed ? 64 : 220, background: 'rgba(8,16,15,0.97)', borderRight: `1px solid ${T.border}`, backdropFilter: 'blur(24px)' }}
//     >
//       {/* Brand */}
//       <div className="flex items-center gap-2.5 px-4 py-[18px]" style={{ borderBottom: `1px solid ${T.border}` }}>
//         <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[13px] font-black text-white shrink-0"
//           style={{ background: 'linear-gradient(135deg, #0D9488, #06B6D4)' }}>E</div>
//         {!collapsed && (
//           <div className="min-w-0">
//             <div className="text-[14px] font-bold leading-none" style={{ color: 'rgba(255,255,255,0.85)' }}>EduForge</div>
//             <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.28)' }}>Instructor Hub</div>
//           </div>
//         )}
//         <button onClick={onToggle} className="ml-auto w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors hover:bg-white/10"
//           style={{ background: 'rgba(255,255,255,0.05)' }}>
//           <svg className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.4)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//             <path strokeLinecap="round" strokeLinejoin="round" d={collapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'} />
//           </svg>
//         </button>
//       </div>

//       {/* Instructor badge */}
//       {!collapsed && (
//         <div className="px-4 pt-4 pb-1">
//           <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
//             style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
//             <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: T.emerald }} />
//             <span className="text-[11px] font-semibold" style={{ color: '#67E8F9' }}>Instructor</span>
//             <span className="ml-auto text-[10px] font-bold" style={{ color: T.cyan }}>Pro</span>
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
//                 background: active ? 'rgba(6,182,212,0.13)' : 'transparent',
//                 border: active ? '1px solid rgba(6,182,212,0.28)' : '1px solid transparent',
//                 justifyContent: collapsed ? 'center' : undefined,
//               }}>
//               {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full" style={{ background: T.cyan }} />}
//               <Icon d={item.icon} size="w-[16px] h-[16px]"
//                 style={{ color: active ? '#67E8F9' : 'rgba(255,255,255,0.38)' }} />
//               {!collapsed && (
//                 <span className="text-[13px] font-medium transition-colors"
//                   style={{ color: active ? '#A5F3FC' : 'rgba(255,255,255,0.48)' }}>
//                   {item.label}
//                 </span>
//               )}
//               {!collapsed && active && <span className="ml-auto w-1.5 h-1.5 rounded-full animate-pulse shrink-0" style={{ background: T.cyan }} />}
//             </Link>
//           );
//         })}
//       </nav>

//       {/* User */}
//       <div className="px-3 py-3" style={{ borderTop: `1px solid ${T.border}` }}>
//         <div className={`flex items-center gap-2.5 px-2 py-2 rounded-xl cursor-pointer hover:bg-white/5 transition-colors ${collapsed ? 'justify-center' : ''}`}>
//           <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white shrink-0"
//             style={{ background: 'linear-gradient(135deg, #0D9488, #06B6D4)' }}>T</div>
//           {!collapsed && (
//             <div className="min-w-0">
//               <div className="text-[12px] font-semibold truncate" style={{ color: 'rgba(255,255,255,0.65)' }}>Instructor</div>
//               <div className="text-[10px]" style={{ color: T.emerald }}>● Online</div>
//             </div>
//           )}
//         </div>
//       </div>
//     </aside>
//   );
// }

// // ─── Stat Card ─────────────────────────────────────────────────────────────
// function StatCard({ label, value, icon, delta, deltaLabel, accent, loading, prefix = '', suffix = '' }) {
//   const cfg = {
//     cyan:    { border: 'rgba(6,182,212,0.28)',   icon: 'rgba(6,182,212,0.15)',   val: '#67E8F9', glow: 'rgba(6,182,212,0.2)' },
//     teal:    { border: 'rgba(13,148,136,0.28)',  icon: 'rgba(13,148,136,0.15)',  val: '#5EEAD4', glow: 'rgba(13,148,136,0.2)' },
//     emerald: { border: 'rgba(16,185,129,0.28)',  icon: 'rgba(16,185,129,0.15)',  val: '#6EE7B7', glow: 'rgba(16,185,129,0.2)' },
//     amber:   { border: 'rgba(245,158,11,0.28)',  icon: 'rgba(245,158,11,0.15)',  val: '#FCD34D', glow: 'rgba(245,158,11,0.2)' },
//     violet:  { border: 'rgba(139,92,246,0.28)',  icon: 'rgba(139,92,246,0.15)',  val: '#C4B5FD', glow: 'rgba(139,92,246,0.2)' },
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
//         {value !== null && value !== undefined
//           ? <AnimCounter target={value} prefix={prefix} suffix={suffix} />
//           : '—'}
//       </div>
//       <div className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.38)' }}>{label}</div>
//       {deltaLabel && <div className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.22)' }}>{deltaLabel}</div>}
//     </div>
//   );
// }

// // ─── Course row in table ───────────────────────────────────────────────────
// function CourseRow({ course, index, last }) {
//   const pct = Math.min(100, Math.round(((course.enrollmentCount || 0) / 200) * 100));
//   return (
//     <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors"
//       style={{ borderBottom: last ? 'none' : `1px solid ${T.border}` }}>
//       {/* Rank */}
//       <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-bold text-white shrink-0"
//         style={{ background: index === 0 ? 'rgba(6,182,212,0.3)' : 'rgba(255,255,255,0.07)' }}>
//         {index + 1}
//       </div>
//       {/* Info */}
//       <div className="flex-1 min-w-0">
//         <div className="flex items-center gap-2 mb-1">
//           <span className="text-[13px] font-semibold text-white/80 truncate">{course.title || 'Untitled'}</span>
//           {course.isPublished ? (
//             <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 shrink-0">LIVE</span>
//           ) : (
//             <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 shrink-0">DRAFT</span>
//           )}
//         </div>
//         <div className="flex items-center gap-3">
//           <div className="flex-1 h-1.5 rounded-full overflow-hidden max-w-[140px]" style={{ background: 'rgba(255,255,255,0.07)' }}>
//             <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #0D9488, #06B6D4)' }} />
//           </div>
//           <span className="text-[11px] text-white/35">{pct}% capacity</span>
//         </div>
//       </div>
//       {/* Stats */}
//       <div className="flex items-center gap-5 shrink-0">
//         <div className="text-center hidden sm:block">
//           <div className="text-[14px] font-bold text-white/78">{(course.enrollmentCount || 0).toLocaleString('en-IN')}</div>
//           <div className="text-[10px] text-white/28">Students</div>
//         </div>
//         <div className="text-center hidden md:block">
//           <div className="text-[14px] font-bold" style={{ color: T.cyan }}>
//             {course.rating ? `${course.rating.toFixed(1)}★` : '—'}
//           </div>
//           <div className="text-[10px] text-white/28">Rating</div>
//         </div>
//         <Link to={`/teacher/courses/${course._id || course.slug}`}
//           className="text-[12px] font-semibold px-3 py-1.5 rounded-xl transition-all hover:opacity-80"
//           style={{ background: 'rgba(6,182,212,0.12)', color: '#67E8F9', border: '1px solid rgba(6,182,212,0.22)' }}>
//           Manage
//         </Link>
//       </div>
//     </div>
//   );
// }

// // ─── Engagement bar ────────────────────────────────────────────────────────
// function EngagementPanel() {
//   return (
//     <div className="rounded-2xl p-5 h-full" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
//       <div className="mb-5">
//         <h3 className="text-[14px] font-bold text-white">Student engagement</h3>
//         <p className="text-[11px] mt-0.5 text-white/35">Across all your courses</p>
//       </div>
//       <div className="space-y-4">
//         {ENGAGEMENT_DATA.map((item) => (
//           <div key={item.label}>
//             <div className="flex justify-between mb-1.5">
//               <span className="text-[12px] text-white/55">{item.label}</span>
//               <span className="text-[12px] font-bold" style={{ color: item.color }}>{item.value}%</span>
//             </div>
//             <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
//               <div className="h-full rounded-full transition-all duration-1000"
//                 style={{ width: `${item.value}%`, background: item.color }} />
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="mt-6 pt-4" style={{ borderTop: `1px solid ${T.border}` }}>
//         <div className="flex items-center justify-between">
//           <span className="text-[12px] text-white/40">Overall health</span>
//           <span className="text-[13px] font-bold text-emerald-400 flex items-center gap-1">
//             <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Good
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ══════════════════════════════════════════════════════════════════
// // MAIN
// // ══════════════════════════════════════════════════════════════════
// export default function TeacherDashboard() {
//   const [courses,  setCourses]  = useState([]);
//   const [loading,  setLoading]  = useState(true);
//   const [error,    setError]    = useState(false);
//   const [collapsed, setCollapsed] = useState(false);

//   const fetchCourses = () => {
//     setLoading(true); setError(false);
//     courseApi.myOwned()
//       .then((r) => setCourses(r.data))
//       .catch(() => setError(true))
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => { fetchCourses(); }, []);

//   const total      = courses.reduce((s, c) => s + (c.enrollmentCount || 0), 0);
//   const published  = courses.filter((c) => c.isPublished).length;
//   const drafts     = courses.length - published;
//   const avgRating  = courses.length
//     ? (courses.reduce((s, c) => s + (c.rating || 0), 0) / courses.length).toFixed(1)
//     : null;

//   // Build enrollment trend from real data if available, else mock
//   const chartData = courses.length
//     ? courses.slice(0, 7).map((c) => ({ month: c.title?.slice(0, 6) || '—', students: c.enrollmentCount || 0 }))
//     : ENROLLMENT_TREND;

//   return (
//     <div className="flex h-screen w-full overflow-hidden" style={{ background: T.bg, color: '#fff' }}>

//       {/* Ambient */}
//       <div className="fixed inset-0 pointer-events-none overflow-hidden">
//         <div className="absolute -top-40 -left-40 w-[700px] h-[600px] rounded-full blur-[160px]"
//           style={{ background: 'rgba(6,182,212,0.07)' }} />
//         <div className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full blur-[140px]"
//           style={{ background: 'rgba(13,148,136,0.06)' }} />
//       </div>

//       <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

//       <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden">

//         {/* Topbar */}
//         <header className="shrink-0 flex items-center justify-between px-6 py-4"
//           style={{ background: 'rgba(8,16,15,0.88)', borderBottom: `1px solid ${T.border}`, backdropFilter: 'blur(20px)' }}>
//           <div>
//             <h1 className="text-[19px] font-bold text-white tracking-tight">Instructor Dashboard</h1>
//             <p className="text-[12px] mt-0.5 text-white/35">
//               {courses.length > 0
//                 ? `${courses.length} course${courses.length > 1 ? 's' : ''} · ${total.toLocaleString('en-IN')} total students`
//                 : 'Manage your courses and students'}
//             </p>
//           </div>
//           <div className="flex items-center gap-2.5">
//             {error && (
//               <button onClick={fetchCourses}
//                 className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium text-rose-400 transition-colors"
//                 style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)' }}>
//                 <Icon d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//                   size="w-4 h-4" style={{ color: T.rose }} />
//                 Retry
//               </button>
//             )}
//             <Link to="/teacher/courses/new"
//               className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-[13px] font-semibold transition-all hover:opacity-90"
//               style={{ background: 'linear-gradient(135deg, #0D9488, #06B6D4)', boxShadow: '0 4px 20px rgba(6,182,212,0.3)' }}>
//               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
//               </svg>
//               Create course
//             </Link>
//           </div>
//         </header>

//         {/* Body */}
//         <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7" style={{ scrollbarWidth: 'none' }}>
//           <div className="max-w-[1300px] mx-auto w-full space-y-7">

//             {/* Stats */}
//             <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
//               <StatCard label="My courses"      value={courses.length} icon="📚" accent="cyan"    delta="+2"    deltaLabel="this month"   loading={loading} />
//               <StatCard label="Total students"  value={total}          icon="👥" accent="teal"    delta="+48"   deltaLabel="new signups"   loading={loading} />
//               <StatCard label="Published"       value={published}      icon="✅" accent="emerald" delta={`${published}`} deltaLabel="live now" loading={loading} />
//               <StatCard label="Drafts"          value={drafts}         icon="📝" accent="amber"   delta={null}  deltaLabel="pending review" loading={loading} />
//               <StatCard label="Avg rating"      value={avgRating ? parseFloat(avgRating) : 0} icon="⭐" accent="violet" suffix="/5" deltaLabel="student avg" loading={loading} />
//             </div>

//             {/* Charts row */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

//               {/* Enrollment bar chart */}
//               <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
//                 <div className="flex items-center justify-between mb-5">
//                   <div>
//                     <h3 className="text-[14px] font-bold text-white">Student enrollment trend</h3>
//                     <p className="text-[11px] mt-0.5 text-white/35">Monthly new enrollments</p>
//                   </div>
//                   <span className="text-[11px] font-bold text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10">
//                     ↑ 25% this month
//                   </span>
//                 </div>
//                 <ResponsiveContainer width="100%" height={180}>
//                   <BarChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 4 }}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
//                     <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
//                     <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
//                     <Tooltip content={<DarkTooltip />} />
//                     <Bar dataKey="students" radius={[6, 6, 0, 0]} maxBarSize={44}>
//                       {chartData.map((_, i) => (
//                         <Cell key={i} fill={i === chartData.length - 1 ? T.cyan : 'rgba(6,182,212,0.3)'} />
//                       ))}
//                     </Bar>
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>

//               {/* Engagement */}
//               <div className="lg:col-span-1">
//                 <EngagementPanel />
//               </div>
//             </div>

//             {/* Courses table */}
//             <section>
//               <div className="flex items-center justify-between mb-4">
//                 <div>
//                   <h2 className="text-[15px] font-bold text-white">Your courses</h2>
//                   <p className="text-[12px] mt-0.5 text-white/35">
//                     {loading ? 'Loading…' : `${courses.length} course${courses.length !== 1 ? 's' : ''}`}
//                   </p>
//                 </div>
//                 <Link to="/teacher/courses"
//                   className="text-[12px] font-medium transition-colors flex items-center gap-1 hover:text-white/80"
//                   style={{ color: '#67E8F9' }}>
//                   View all
//                   <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
//                 </Link>
//               </div>

//               <div className="rounded-2xl overflow-hidden" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
//                 {/* Table header */}
//                 <div className="flex items-center gap-4 px-5 py-3" style={{ borderBottom: `1px solid ${T.border}`, background: 'rgba(255,255,255,0.02)' }}>
//                   {['#', 'Course', 'Enrollments', 'Rating', ''].map((h, i) => (
//                     <span key={i} className={`text-[10px] font-bold uppercase tracking-widest text-white/25 ${i === 1 ? 'flex-1' : i === 0 ? 'w-7' : 'hidden sm:block'}`}>{h}</span>
//                   ))}
//                 </div>

//                 {loading ? (
//                   <div className="p-5 space-y-3">
//                     {[1, 2, 3].map(i => (
//                       <div key={i} className="flex items-center gap-4">
//                         <Skeleton className="w-7 h-7" />
//                         <Skeleton className="flex-1 h-10" />
//                         <Skeleton className="w-20 h-8" />
//                       </div>
//                     ))}
//                   </div>
//                 ) : courses.length === 0 ? (
//                   <div className="flex flex-col items-center justify-center py-16">
//                     <span className="text-5xl mb-4 opacity-30">📚</span>
//                     <h3 className="text-[15px] font-semibold text-white/45 mb-2">No courses yet</h3>
//                     <p className="text-[13px] text-white/28 mb-6">Create your first course to get started</p>
//                     <Link to="/teacher/courses/new"
//                       className="px-5 py-2.5 rounded-xl text-white text-[13px] font-semibold hover:opacity-90 transition-all"
//                       style={{ background: 'linear-gradient(135deg, #0D9488, #06B6D4)' }}>
//                       + Create course
//                     </Link>
//                   </div>
//                 ) : (
//                   courses.slice(0, 8).map((c, i) => (
//                     <CourseRow key={c._id} course={c} index={i} last={i === Math.min(courses.length, 8) - 1} />
//                   ))
//                 )}
//               </div>
//             </section>

//             {/* Quick actions */}
//             <section>
//               <h2 className="text-[15px] font-bold text-white mb-4">Quick actions</h2>
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                 {[
//                   { to: '/teacher/courses/new',  icon: '➕', label: 'New course',      sub: 'Start building',        border: 'rgba(6,182,212,0.28)',   bg: 'rgba(6,182,212,0.08)'  },
//                   { to: '/teacher/quizzes',       icon: '⚡', label: 'Create quiz',     sub: 'Add practice tests',    border: 'rgba(245,158,11,0.28)',  bg: 'rgba(245,158,11,0.08)' },
//                   { to: '/teacher/assignments',   icon: '📋', label: 'Assignments',     sub: 'Review submissions',    border: 'rgba(16,185,129,0.28)',  bg: 'rgba(16,185,129,0.08)' },
//                   { to: '/teacher/analytics',     icon: '📊', label: 'Analytics',       sub: 'Detailed insights',     border: 'rgba(139,92,246,0.28)',  bg: 'rgba(139,92,246,0.08)' },
//                 ].map((item) => (
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

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { courseApi } from '../../services';
import {
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

// ─── Design tokens ─────────────────────────────────────────────────────────
const T = {
  bg:      '#08100F',
  surface: 'rgba(255,255,255,0.04)',
  border:  'rgba(255,255,255,0.07)',
  cyan:    '#06B6D4',
  teal:    '#0D9488',
  emerald: '#10B981',
  amber:   '#F59E0B',
  violet:  '#8B5CF6',
  rose:    '#F43F5E',
};

// ─── Mock data ─────────────────────────────────────────────────────────────
const ENROLLMENT_TREND = [
  { month: 'Feb', students: 34 },
  { month: 'Mar', students: 52 },
  { month: 'Apr', students: 48 },
  { month: 'May', students: 71 },
  { month: 'Jun', students: 89 },
  { month: 'Jul', students: 112 },
];

const ENGAGEMENT_DATA = [
  { label: 'Avg completion', value: 74, color: T.cyan },
  { label: 'Quiz pass rate',  value: 81, color: T.emerald },
  { label: 'Assignment done', value: 63, color: T.amber },
  { label: 'Cert issued',     value: 48, color: T.violet },
];

// ─── Helpers ───────────────────────────────────────────────────────────────
function Icon({ d, size = 'w-[17px] h-[17px]', strokeWidth = 1.8, style, className = '' }) {
  return (
    <svg className={`${size} ${className}`} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}>
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
    if (!target && target !== 0) return;
    const num = typeof target === 'string' ? parseFloat(target) || 0 : target;
    let start = null;
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
    <div className="rounded-xl px-4 py-3 shadow-2xl text-sm" style={{ background: '#0a1a18', border: '1px solid rgba(255,255,255,0.1)' }}>
      <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color || T.cyan }} />
          <span className="font-semibold text-white">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, delta, deltaLabel, accent, loading, prefix = '', suffix = '' }) {
  const cfg = {
    cyan:    { border: 'rgba(6,182,212,0.28)',   icon: 'rgba(6,182,212,0.15)',   val: '#67E8F9', glow: 'rgba(6,182,212,0.2)' },
    teal:    { border: 'rgba(13,148,136,0.28)',  icon: 'rgba(13,148,136,0.15)',  val: '#5EEAD4', glow: 'rgba(13,148,136,0.2)' },
    emerald: { border: 'rgba(16,185,129,0.28)',  icon: 'rgba(16,185,129,0.15)',  val: '#6EE7B7', glow: 'rgba(16,185,129,0.2)' },
    amber:   { border: 'rgba(245,158,11,0.28)',  icon: 'rgba(245,158,11,0.15)',  val: '#FCD34D', glow: 'rgba(245,158,11,0.2)' },
    violet:  { border: 'rgba(139,92,246,0.28)',  icon: 'rgba(139,92,246,0.15)',  val: '#C4B5FD', glow: 'rgba(139,92,246,0.2)' },
  }[accent] || {};

  if (loading) return (
    <div className="rounded-2xl p-5 animate-pulse" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
      <div className="flex justify-between mb-4"><Skeleton className="w-10 h-10" /><Skeleton className="w-14 h-5 rounded-full" /></div>
      <Skeleton className="w-24 h-8 mb-2" /><Skeleton className="w-20 h-4" />
    </div>
  );

  const pos = typeof delta === 'string' ? !delta.startsWith('-') : delta >= 0;

  return (
    <div className="rounded-2xl p-5 transition-all duration-300 hover:scale-[1.03] cursor-default"
      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))', border: `1px solid ${cfg.border}` }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 8px 40px ${cfg.glow}`; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}>
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
        {value !== null && value !== undefined
          ? <AnimCounter target={value} prefix={prefix} suffix={suffix} />
          : '—'}
      </div>
      <div className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.38)' }}>{label}</div>
      {deltaLabel && <div className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.22)' }}>{deltaLabel}</div>}
    </div>
  );
}

// ─── Course row in table ───────────────────────────────────────────────────
function CourseRow({ course, index, last }) {
  const pct = Math.min(100, Math.round(((course.enrollmentCount || 0) / 200) * 100));
  return (
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-colors"
      style={{ borderBottom: last ? 'none' : `1px solid ${T.border}` }}>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[12px] font-bold text-white shrink-0"
        style={{ background: index === 0 ? 'rgba(6,182,212,0.3)' : 'rgba(255,255,255,0.07)' }}>
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[13px] font-semibold text-white/80 truncate">{course.title || 'Untitled'}</span>
          {course.isPublished ? (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 shrink-0">LIVE</span>
          ) : (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 shrink-0">DRAFT</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden max-w-[140px]" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #0D9488, #06B6D4)' }} />
          </div>
          <span className="text-[11px] text-white/35">{pct}% capacity</span>
        </div>
      </div>
      <div className="flex items-center gap-5 shrink-0">
        <div className="text-center hidden sm:block">
          <div className="text-[14px] font-bold text-white/78">{(course.enrollmentCount || 0).toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-white/28">Students</div>
        </div>
        <div className="text-center hidden md:block">
          <div className="text-[14px] font-bold" style={{ color: T.cyan }}>
            {course.rating ? `${course.rating.toFixed(1)}★` : '—'}
          </div>
          <div className="text-[10px] text-white/28">Rating</div>
        </div>
        <Link to={`/teacher/courses/${course._id || course.slug}`}
          className="text-[12px] font-semibold px-3 py-1.5 rounded-xl transition-all hover:opacity-80"
          style={{ background: 'rgba(6,182,212,0.12)', color: '#67E8F9', border: '1px solid rgba(6,182,212,0.22)' }}>
          Manage
        </Link>
      </div>
    </div>
  );
}

// ─── Engagement bar ────────────────────────────────────────────────────────
function EngagementPanel() {
  return (
    <div className="rounded-2xl p-5 h-full" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
      <div className="mb-5">
        <h3 className="text-[14px] font-bold text-white">Student engagement</h3>
        <p className="text-[11px] mt-0.5 text-white/35">Across all your courses</p>
      </div>
      <div className="space-y-4">
        {ENGAGEMENT_DATA.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between mb-1.5">
              <span className="text-[12px] text-white/55">{item.label}</span>
              <span className="text-[12px] font-bold" style={{ color: item.color }}>{item.value}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <div className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${item.value}%`, background: item.color }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4" style={{ borderTop: `1px solid ${T.border}` }}>
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-white/40">Overall health</span>
          <span className="text-[13px] font-bold text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Good
          </span>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════
export default function TeacherDashboard() {
  const [courses,  setCourses]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(false);

  const fetchCourses = () => {
    setLoading(true); setError(false);
    courseApi.myOwned()
      .then((r) => setCourses(r.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCourses(); }, []);

  const total      = courses.reduce((s, c) => s + (c.enrollmentCount || 0), 0);
  const published  = courses.filter((c) => c.isPublished).length;
  const drafts     = courses.length - published;
  const avgRating  = courses.length
    ? (courses.reduce((s, c) => s + (c.rating || 0), 0) / courses.length).toFixed(1)
    : null;

  const chartData = courses.length
    ? courses.slice(0, 7).map((c) => ({ month: c.title?.slice(0, 6) || '—', students: c.enrollmentCount || 0 }))
    : ENROLLMENT_TREND;

  return (
    <div style={{ background: T.bg, color: '#fff' }}>

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[700px] h-[600px] rounded-full blur-[160px]"
          style={{ background: 'rgba(6,182,212,0.07)' }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full blur-[140px]"
          style={{ background: 'rgba(13,148,136,0.06)' }} />
      </div>

      <div className="relative flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="shrink-0 flex items-center justify-between px-6 py-4"
          style={{ background: 'rgba(8,16,15,0.88)', borderBottom: `1px solid ${T.border}`, backdropFilter: 'blur(20px)' }}>
          <div>
            <h1 className="text-[19px] font-bold text-white tracking-tight">Instructor Dashboard</h1>
            <p className="text-[12px] mt-0.5 text-white/35">
              {courses.length > 0
                ? `${courses.length} course${courses.length > 1 ? 's' : ''} · ${total.toLocaleString('en-IN')} total students`
                : 'Manage your courses and students'}
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            {error && (
              <button onClick={fetchCourses}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium text-rose-400 transition-colors"
                style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)' }}>
                <Icon d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  size="w-4 h-4" style={{ color: T.rose }} />
                Retry
              </button>
            )}
            <Link to="/teacher/courses/new"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-[13px] font-semibold transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #0D9488, #06B6D4)', boxShadow: '0 4px 20px rgba(6,182,212,0.3)' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Create course
            </Link>
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7" style={{ scrollbarWidth: 'none' }}>
          <div className="max-w-[1300px] mx-auto w-full space-y-7">

            {/* Stats */}
            <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
              <StatCard label="My courses"      value={courses.length} icon="📚" accent="cyan"    delta="+2"    deltaLabel="this month"   loading={loading} />
              <StatCard label="Total students"  value={total}          icon="👥" accent="teal"    delta="+48"   deltaLabel="new signups"   loading={loading} />
              <StatCard label="Published"       value={published}      icon="✅" accent="emerald" delta={`${published}`} deltaLabel="live now" loading={loading} />
              <StatCard label="Drafts"          value={drafts}         icon="📝" accent="amber"   delta={null}  deltaLabel="pending review" loading={loading} />
              <StatCard label="Avg rating"      value={avgRating ? parseFloat(avgRating) : 0} icon="⭐" accent="violet" suffix="/5" deltaLabel="student avg" loading={loading} />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              {/* Enrollment bar chart */}
              <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-[14px] font-bold text-white">Student enrollment trend</h3>
                    <p className="text-[11px] mt-0.5 text-white/35">Monthly new enrollments</p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10">
                    ↑ 25% this month
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<DarkTooltip />} />
                    <Bar dataKey="students" radius={[6, 6, 0, 0]} maxBarSize={44}>
                      {chartData.map((_, i) => (
                        <Cell key={i} fill={i === chartData.length - 1 ? T.cyan : 'rgba(6,182,212,0.3)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Engagement */}
              <div className="lg:col-span-1">
                <EngagementPanel />
              </div>
            </div>

            {/* Courses table */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-[15px] font-bold text-white">Your courses</h2>
                  <p className="text-[12px] mt-0.5 text-white/35">
                    {loading ? 'Loading…' : `${courses.length} course${courses.length !== 1 ? 's' : ''}`}
                  </p>
                </div>
                <Link to="/teacher/courses"
                  className="text-[12px] font-medium transition-colors flex items-center gap-1 hover:text-white/80"
                  style={{ color: '#67E8F9' }}>
                  View all
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>

              <div className="rounded-2xl overflow-hidden" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
                {/* Table header */}
                <div className="flex items-center gap-4 px-5 py-3" style={{ borderBottom: `1px solid ${T.border}`, background: 'rgba(255,255,255,0.02)' }}>
                  {['#', 'Course', 'Enrollments', 'Rating', ''].map((h, i) => (
                    <span key={i} className={`text-[10px] font-bold uppercase tracking-widest text-white/25 ${i === 1 ? 'flex-1' : i === 0 ? 'w-7' : 'hidden sm:block'}`}>{h}</span>
                  ))}
                </div>

                {loading ? (
                  <div className="p-5 space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="w-7 h-7" />
                        <Skeleton className="flex-1 h-10" />
                        <Skeleton className="w-20 h-8" />
                      </div>
                    ))}
                  </div>
                ) : courses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <span className="text-5xl mb-4 opacity-30">📚</span>
                    <h3 className="text-[15px] font-semibold text-white/45 mb-2">No courses yet</h3>
                    <p className="text-[13px] text-white/28 mb-6">Create your first course to get started</p>
                    <Link to="/teacher/courses/new"
                      className="px-5 py-2.5 rounded-xl text-white text-[13px] font-semibold hover:opacity-90 transition-all"
                      style={{ background: 'linear-gradient(135deg, #0D9488, #06B6D4)' }}>
                      + Create course
                    </Link>
                  </div>
                ) : (
                  courses.slice(0, 8).map((c, i) => (
                    <CourseRow key={c._id} course={c} index={i} last={i === Math.min(courses.length, 8) - 1} />
                  ))
                )}
              </div>
            </section>

            {/* Quick actions */}
            <section>
              <h2 className="text-[15px] font-bold text-white mb-4">Quick actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { to: '/teacher/courses/new',  icon: '➕', label: 'New course',      sub: 'Start building',        border: 'rgba(6,182,212,0.28)',   bg: 'rgba(6,182,212,0.08)'  },
                  { to: '/teacher/quizzes',       icon: '⚡', label: 'Create quiz',     sub: 'Add practice tests',    border: 'rgba(245,158,11,0.28)',  bg: 'rgba(245,158,11,0.08)' },
                  { to: '/teacher/assignments',   icon: '📋', label: 'Assignments',     sub: 'Review submissions',    border: 'rgba(16,185,129,0.28)',  bg: 'rgba(16,185,129,0.08)' },
                  { to: '/teacher/analytics',     icon: '📊', label: 'Analytics',       sub: 'Detailed insights',     border: 'rgba(139,92,246,0.28)',  bg: 'rgba(139,92,246,0.08)' },
                ].map((item) => (
                  <Link key={item.label} to={item.to}
                    className="group flex items-center gap-3.5 px-4 py-4 rounded-2xl transition-all hover:scale-[1.02]"
                    style={{ background: item.bg, border: `1px solid ${item.border}` }}>
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-white/80 group-hover:text-white transition-colors">{item.label}</div>
                      <div className="text-[11px] text-white/32">{item.sub}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}