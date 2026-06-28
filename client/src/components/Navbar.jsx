// // // // import { Link, NavLink, useNavigate } from 'react-router-dom';
// // // // import { useDispatch, useSelector } from 'react-redux';
// // // // import { logout } from '../redux/slices/authSlice';
// // // // import { useState } from 'react';

// // // // export default function Navbar() {
// // // //   const { user } = useSelector((s) => s.auth);
// // // //   const dispatch = useDispatch();
// // // //   const navigate = useNavigate();
// // // //   const [open, setOpen] = useState(false);

// // // //   const onLogout = () => { dispatch(logout()); navigate('/'); };

// // // //   return (
// // // //     <header className="navbar">
// // // //       <div className="container nav-inner">
// // // //         <Link to="/" className="brand">Edu<span>Forge</span></Link>
// // // //         <button className="nav-toggle" onClick={() => setOpen(!open)}>☰</button>
// // // //         <nav className={`nav-links ${open ? 'open' : ''}`}>
// // // //           <NavLink to="/courses">Courses</NavLink>
// // // //           {user && <NavLink to="/dashboard">Dashboard</NavLink>}
// // // //           {user && <NavLink to="/ai-assistant">AI Assistant</NavLink>}
// // // //           {user?.role === 'teacher' && <NavLink to="/teacher">Teacher</NavLink>}
// // // //           {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
// // // //           {!user ? (
// // // //             <>
// // // //               <NavLink to="/login" className="btn btn-ghost">Sign in</NavLink>
// // // //               <NavLink to="/register" className="btn btn-primary">Sign up</NavLink>
// // // //             </>
// // // //           ) : (
// // // //             <>
// // // //               <NavLink to="/profile" className="user-chip">{user.name}</NavLink>
// // // //               <button className="btn btn-ghost" onClick={onLogout}>Logout</button>
// // // //             </>
// // // //           )}
// // // //         </nav>
// // // //       </div>
// // // //     </header>
// // // //   );
// // // // }




// // // import { Link, NavLink, useNavigate } from 'react-router-dom';
// // // import { useDispatch, useSelector } from 'react-redux';
// // // import { logout } from '../redux/slices/authSlice';
// // // import { useState } from 'react';

// // // export default function Navbar() {
// // //   const { user } = useSelector((s) => s.auth);
// // //   const dispatch = useDispatch();
// // //   const navigate = useNavigate();
// // //   const [open, setOpen] = useState(false);

// // //   const onLogout = () => {
// // //     dispatch(logout());
// // //     navigate('/');
// // //   };

// // //   // Role-based Dashboard Link
// // //   const dashboardLink = () => {
// // //     if (!user) return '/dashboard';
// // //     if (user.role === 'admin') return '/admin';
// // //     if (user.role === 'teacher') return '/teacher';
// // //     return '/dashboard'; // student
// // //   };

// // //   return (
// // //     <header className="navbar">
// // //       <div className="container nav-inner">
// // //         <Link to="/" className="brand">
// // //           Edu<span>Forge</span>
// // //         </Link>

// // //         <button className="nav-toggle" onClick={() => setOpen(!open)}>
// // //           ☰
// // //         </button>

// // //         <nav className={`nav-links ${open ? 'open' : ''}`}>
// // //           <NavLink to="/courses">Courses</NavLink>

// // //           {user && (
// // //             <NavLink to={dashboardLink()}>
// // //               Dashboard
// // //             </NavLink>
// // //           )}

// // //           {user && <NavLink to="/ai-assistant">AI Assistant</NavLink>}

// // //           {/* Teacher Link */}
// // //           {(user?.role === 'teacher' || user?.role === 'admin') && (
// // //             <NavLink to="/teacher">Teacher</NavLink>
// // //           )}

// // //           {/* Admin Link */}
// // //           {user?.role === 'admin' && (
// // //             <NavLink to="/admin">Admin</NavLink>
// // //           )}

// // //           {!user ? (
// // //             <>
// // //               <NavLink to="/login" className="btn btn-ghost">Sign in</NavLink>
// // //               <NavLink to="/register" className="btn btn-primary">Sign up</NavLink>
// // //             </>
// // //           ) : (
// // //             <>
// // //               <NavLink to="/profile" className="user-chip">
// // //                 {user.name}
// // //               </NavLink>
// // //               <button className="btn btn-ghost" onClick={onLogout}>
// // //                 Logout
// // //               </button>
// // //             </>
// // //           )}
// // //         </nav>
// // //       </div>
// // //     </header>
// // //   );
// // // }




// // // ✅ NAVBAR.JSX - Complete & Responsive

// // import { Link, NavLink, useNavigate } from 'react-router-dom';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { logout } from '../redux/slices/authSlice';
// // import { useState } from 'react';

// // const T = {
// //   bg:      '#0a0e27',
// //   border:  'rgba(255,255,255,0.07)',
// //   purple:  '#8B5CF6',
// //   indigo:  '#6366F1',
// // };

// // export default function Navbar() {
// //   const { user } = useSelector((s) => s.auth);
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();
// //   const [mobileOpen, setMobileOpen] = useState(false);

// //   const onLogout = () => {
// //     dispatch(logout());
// //     setMobileOpen(false);
// //     navigate('/');
// //   };

// //   const dashboardLink = () => {
// //     if (!user) return '/dashboard';
// //     if (user.role === 'admin') return '/admin';
// //     if (user.role === 'teacher') return '/teacher';
// //     return '/dashboard';
// //   };

// //   const navLinks = [
// //     { to: '/courses', label: 'Courses' },
// //     user && { to: dashboardLink(), label: 'Dashboard' },
// //     user && { to: '/ai-assistant', label: 'AI Assistant' },
// //     (user?.role === 'teacher' || user?.role === 'admin') && { to: '/teacher', label: 'Teacher' },
// //     user?.role === 'admin' && { to: '/admin', label: 'Admin' },
// //   ].filter(Boolean);

// //   return (
// //     <header 
// //       className="sticky top-0 z-40 w-full border-b transition-all"
// //       style={{ 
// //         background: 'rgba(10, 14, 39, 0.95)',
// //         borderColor: T.border,
// //         backdropFilter: 'blur(24px)'
// //       }}
// //     >
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //         <div className="flex items-center justify-between h-16">

// //           {/* Logo */}
// //           <Link 
// //             to="/" 
// //             className="flex items-center gap-2 group shrink-0"
// //             onClick={() => setMobileOpen(false)}
// //           >
// //             <div 
// //               className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-lg"
// //               style={{ background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})` }}
// //             >
// //               E
// //             </div>
// //             <div className="hidden sm:flex items-center gap-0.5">
// //               <span className="text-lg font-bold text-white">Edu</span>
// //               <span className="text-lg font-bold" style={{ color: '#F43F5E' }}>Forge</span>
// //             </div>
// //           </Link>

// //           {/* Desktop Navigation */}
// //           <nav className="hidden md:flex items-center gap-1">
// //             {navLinks.map((link) => (
// //               <NavLink
// //                 key={link.to}
// //                 to={link.to}
// //                 className={({ isActive }) =>
// //                   `px-3 py-2 text-sm font-medium rounded-lg transition-all ${
// //                     isActive
// //                       ? 'text-white bg-white/10'
// //                       : 'text-gray-300 hover:text-white hover:bg-white/5'
// //                   }`
// //                 }
// //               >
// //                 {link.label}
// //               </NavLink>
// //             ))}
// //           </nav>

// //           {/* Right Side */}
// //           <div className="flex items-center gap-2 md:gap-4">

// //             {!user ? (
// //               <div className="hidden sm:flex items-center gap-2">
// //                 <NavLink
// //                   to="/login"
// //                   className={({ isActive }) =>
// //                     `px-4 py-2 text-sm font-medium rounded-lg transition-all ${
// //                       isActive
// //                         ? 'text-white bg-white/10'
// //                         : 'text-gray-300 hover:text-white hover:bg-white/5'
// //                     }`
// //                   }
// //                 >
// //                   Sign in
// //                 </NavLink>
// //                 <NavLink
// //                   to="/register"
// //                   className={({ isActive }) =>
// //                     `px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
// //                       isActive
// //                         ? 'text-white'
// //                         : 'text-white bg-gradient-to-r'
// //                     }`
// //                   }
// //                   style={{
// //                     background: isActive => isActive
// //                       ? `linear-gradient(135deg, ${T.indigo}, ${T.purple})`
// //                       : `linear-gradient(135deg, ${T.indigo}, ${T.purple})`
// //                   }}
// //                 >
// //                   Sign up
// //                 </NavLink>
// //               </div>
// //             ) : (
// //               <div className="hidden md:flex items-center gap-3">
// //                 <NavLink
// //                   to="/profile"
// //                   className={({ isActive }) =>
// //                     `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
// //                       isActive
// //                         ? 'text-white bg-white/10'
// //                         : 'text-gray-300 hover:text-white hover:bg-white/5'
// //                     }`
// //                   }
// //                 >
// //                   <div 
// //                     className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
// //                     style={{ background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})` }}
// //                   >
// //                     {user.name?.[0]?.toUpperCase() || 'U'}
// //                   </div>
// //                   <span className="hidden lg:inline">{user.name}</span>
// //                 </NavLink>
// //                 <button
// //                   onClick={onLogout}
// //                   className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-all rounded-lg hover:bg-white/5"
// //                 >
// //                   Logout
// //                 </button>
// //               </div>
// //             )}

// //             {/* Mobile Menu Button */}
// //             <button
// //               onClick={() => setMobileOpen(!mobileOpen)}
// //               className="md:hidden p-2 rounded-lg transition-all"
// //               style={{ 
// //                 background: mobileOpen ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
// //                 border: mobileOpen ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid rgba(255, 255, 255, 0.07)'
// //               }}
// //             >
// //               <svg 
// //                 className="w-6 h-6 text-white" 
// //                 fill="none" 
// //                 viewBox="0 0 24 24" 
// //                 stroke="currentColor"
// //               >
// //                 {mobileOpen ? (
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6h12v12" />
// //                 ) : (
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
// //                 )}
// //               </svg>
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Mobile Menu */}
// //       {mobileOpen && (
// //         <div 
// //           className="md:hidden border-t"
// //           style={{ borderColor: T.border }}
// //         >
// //           <nav className="px-4 py-4 space-y-2">
// //             {navLinks.map((link) => (
// //               <NavLink
// //                 key={link.to}
// //                 to={link.to}
// //                 onClick={() => setMobileOpen(false)}
// //                 className={({ isActive }) =>
// //                   `block px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
// //                     isActive
// //                       ? 'text-white'
// //                       : 'text-gray-300 hover:text-white'
// //                   }`
// //                 }
// //                 style={({ isActive }) => ({
// //                   background: isActive ? `rgba(139, 92, 246, 0.2)` : 'transparent'
// //                 })}
// //               >
// //                 {link.label}
// //               </NavLink>
// //             ))}

// //             {/* Mobile Auth Section */}
// //             {!user ? (
// //               <div className="space-y-2 pt-2 border-t" style={{ borderColor: T.border }}>
// //                 <NavLink
// //                   to="/login"
// //                   onClick={() => setMobileOpen(false)}
// //                   className="block px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-all"
// //                 >
// //                   Sign in
// //                 </NavLink>
// //                 <NavLink
// //                   to="/register"
// //                   onClick={() => setMobileOpen(false)}
// //                   className="block px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-all"
// //                   style={{ background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})` }}
// //                 >
// //                   Sign up
// //                 </NavLink>
// //               </div>
// //             ) : (
// //               <div className="space-y-2 pt-2 border-t" style={{ borderColor: T.border }}>
// //                 <NavLink
// //                   to="/profile"
// //                   onClick={() => setMobileOpen(false)}
// //                   className={({ isActive }) =>
// //                     `flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
// //                       isActive
// //                         ? 'text-white'
// //                         : 'text-gray-300 hover:text-white'
// //                     }`
// //                   }
// //                   style={({ isActive }) => ({
// //                     background: isActive ? `rgba(139, 92, 246, 0.2)` : 'transparent'
// //                   })}
// //                 >
// //                   <div 
// //                     className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
// //                     style={{ background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})` }}
// //                   >
// //                     {user.name?.[0]?.toUpperCase() || 'U'}
// //                   </div>
// //                   <span>{user.name}</span>
// //                 </NavLink>
// //                 <button
// //                   onClick={onLogout}
// //                   className="w-full px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-all text-left"
// //                 >
// //                   Logout
// //                 </button>
// //               </div>
// //             )}
// //           </nav>
// //         </div>
// //       )}
// //     </header>
// //   );
// // }




// // ✅ NAVBAR.JSX - With Home + Role-Based Dynamic Nav

// import { Link, NavLink, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { logout } from '../redux/slices/authSlice';
// import { useState } from 'react';

// const T = {
//   bg:      '#0a0e27',
//   border:  'rgba(255,255,255,0.07)',
//   purple:  '#8B5CF6',
//   indigo:  '#6366F1',
// };

// export default function Navbar() {
//   const { user } = useSelector((s) => s.auth);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const onLogout = () => {
//     dispatch(logout());
//     setMobileOpen(false);
//     navigate('/');
//   };

//   // Role-based dashboard link
//   const getDashboardLink = () => {
//     if (!user) return '/dashboard';
//     if (user.role === 'admin') return '/admin';
//     if (user.role === 'teacher') return '/teacher';
//     return '/dashboard';
//   };

//   // Dynamic nav links based on login status and role
//   const getNavLinks = () => {
//     const links = [
//       // Always show home
//       { to: '/', label: 'Home' },
//       { to: '/courses', label: 'Courses' },
//     ];

//     if (user) {
//       // Dashboard (role-specific)
//       links.push({
//         to: getDashboardLink(),
//         label: user.role === 'admin' ? 'Admin' : user.role === 'teacher' ? 'Teacher' : 'Dashboard'
//       });

//       // AI Assistant
//       links.push({ to: '/ai-assistant', label: 'AI Assistant' });

//       // Teacher/Admin specific
//       if (user.role === 'teacher' || user.role === 'admin') {
//         links.push({ to: '/teacher', label: 'Teacher' });
//       }

//       // Admin specific
//       if (user.role === 'admin') {
//         links.push({ to: '/admin', label: 'Admin Panel' });
//       }
//     }

//     return links;
//   };

//   const navLinks = getNavLinks();

//   return (
//     <header 
//       className="sticky top-0 z-40 w-full border-b transition-all"
//       style={{ 
//         background: 'rgba(10, 14, 39, 0.95)',
//         borderColor: T.border,
//         backdropFilter: 'blur(24px)'
//       }}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">

//           {/* Logo */}
//           <Link 
//             to="/" 
//             className="flex items-center gap-2 group shrink-0"
//             onClick={() => setMobileOpen(false)}
//           >
//             <div 
//               className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-lg"
//               style={{ background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})` }}
//             >
//               E
//             </div>
//             <div className="hidden sm:flex items-center gap-0.5">
//               <span className="text-lg font-bold text-white">Edu</span>
//               <span className="text-lg font-bold" style={{ color: '#F43F5E' }}>Forge</span>
//             </div>
//           </Link>

//           {/* Desktop Navigation */}
//           <nav className="hidden md:flex items-center gap-1">
//             {navLinks.map((link) => (
//               <NavLink
//                 key={link.to}
//                 to={link.to}
//                 className={({ isActive }) =>
//                   `px-3 py-2 text-sm font-medium rounded-lg transition-all ${
//                     isActive
//                       ? 'text-white bg-white/10'
//                       : 'text-gray-300 hover:text-white hover:bg-white/5'
//                   }`
//                 }
//               >
//                 {link.label}
//               </NavLink>
//             ))}
//           </nav>

//           {/* Right Side */}
//           <div className="flex items-center gap-2 md:gap-4">

//             {!user ? (
//               // Not logged in
//               <div className="hidden sm:flex items-center gap-2">
//                 <NavLink
//                   to="/login"
//                   className={({ isActive }) =>
//                     `px-4 py-2 text-sm font-medium rounded-lg transition-all ${
//                       isActive
//                         ? 'text-white bg-white/10'
//                         : 'text-gray-300 hover:text-white hover:bg-white/5'
//                     }`
//                   }
//                 >
//                   Sign in
//                 </NavLink>
//                 <NavLink
//                   to="/register"
//                   className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all"
//                   style={{
//                     background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})`
//                   }}
//                 >
//                   Sign up
//                 </NavLink>
//               </div>
//             ) : (
//               // Logged in
//               <div className="hidden md:flex items-center gap-3">
//                 <NavLink
//                   to="/profile"
//                   className={({ isActive }) =>
//                     `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
//                       isActive
//                         ? 'text-white bg-white/10'
//                         : 'text-gray-300 hover:text-white hover:bg-white/5'
//                     }`
//                   }
//                 >
//                   <div 
//                     className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
//                     style={{ background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})` }}
//                   >
//                     {user.name?.[0]?.toUpperCase() || 'U'}
//                   </div>
//                   <span className="hidden lg:inline">{user.name}</span>
//                 </NavLink>
//                 <button
//                   onClick={onLogout}
//                   className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-all rounded-lg hover:bg-white/5"
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}

//             {/* Mobile Menu Button */}
//             <button
//               onClick={() => setMobileOpen(!mobileOpen)}
//               className="md:hidden p-2 rounded-lg transition-all"
//               style={{ 
//                 background: mobileOpen ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.05)',
//                 border: mobileOpen ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid rgba(255, 255, 255, 0.07)'
//               }}
//             >
//               <svg 
//                 className="w-6 h-6 text-white" 
//                 fill="none" 
//                 viewBox="0 0 24 24" 
//                 stroke="currentColor"
//               >
//                 {mobileOpen ? (
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6h12v12" />
//                 ) : (
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                 )}
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {mobileOpen && (
//         <div 
//           className="md:hidden border-t"
//           style={{ borderColor: T.border }}
//         >
//           <nav className="px-4 py-4 space-y-2">
//             {navLinks.map((link) => (
//               <NavLink
//                 key={link.to}
//                 to={link.to}
//                 onClick={() => setMobileOpen(false)}
//                 className={({ isActive }) =>
//                   `block px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
//                     isActive
//                       ? 'text-white'
//                       : 'text-gray-300 hover:text-white'
//                   }`
//                 }
//                 style={({ isActive }) => ({
//                   background: isActive ? `rgba(139, 92, 246, 0.2)` : 'transparent'
//                 })}
//               >
//                 {link.label}
//               </NavLink>
//             ))}

//             {/* Mobile Auth Section */}
//             {!user ? (
//               <div className="space-y-2 pt-2 border-t" style={{ borderColor: T.border }}>
//                 <NavLink
//                   to="/login"
//                   onClick={() => setMobileOpen(false)}
//                   className="block px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-all"
//                 >
//                   Sign in
//                 </NavLink>
//                 <NavLink
//                   to="/register"
//                   onClick={() => setMobileOpen(false)}
//                   className="block px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-all"
//                   style={{ background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})` }}
//                 >
//                   Sign up
//                 </NavLink>
//               </div>
//             ) : (
//               <div className="space-y-2 pt-2 border-t" style={{ borderColor: T.border }}>
//                 <NavLink
//                   to="/profile"
//                   onClick={() => setMobileOpen(false)}
//                   className={({ isActive }) =>
//                     `flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
//                       isActive
//                         ? 'text-white'
//                         : 'text-gray-300 hover:text-white'
//                     }`
//                   }
//                   style={({ isActive }) => ({
//                     background: isActive ? `rgba(139, 92, 246, 0.2)` : 'transparent'
//                   })}
//                 >
//                   <div 
//                     className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
//                     style={{ background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})` }}
//                   >
//                     {user.name?.[0]?.toUpperCase() || 'U'}
//                   </div>
//                   <span>{user.name}</span>
//                 </NavLink>
//                 <button
//                   onClick={onLogout}
//                   className="w-full px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-all text-left"
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//           </nav>
//         </div>
//       )}
//     </header>
//   );
// }





import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useState } from 'react';

const T = {
  bg:     '#0a0e27',
  border: 'rgba(255,255,255,0.07)',
  purple: '#8B5CF6',
  indigo: '#6366F1',
};

// Role-based nav links — each role sees only what's relevant to them
const getNavLinks = (user) => {
  // Public links always shown
  const base = [
    { to: '/',        label: 'Home'    },
    { to: '/courses', label: 'Courses' },
  ];

  if (!user) return base;

  if (user.role === 'admin') {
    return [
      ...base,
      { to: '/admin', label: 'Admin Panel' },
    ];
  }

  if (user.role === 'teacher') {
    return [
      ...base,
      { to: '/teacher',       label: 'Dashboard'    },
      { to: '/ai-assistant',  label: 'AI Assistant' },
    ];
  }

  // Student
  return [
    ...base,
    { to: '/dashboard',    label: 'Dashboard'    },
    { to: '/ai-assistant', label: 'AI Assistant' },
  ];
};

export default function Navbar() {
  const { user }  = useSelector((s) => s.auth);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const onLogout = () => {
    dispatch(logout());
    setMobileOpen(false);
    navigate('/');
  };

  const navLinks = getNavLinks(user);

  return (
    <header
      className="sticky top-0 z-40 w-full border-b transition-all"
      style={{
        background: 'rgba(10, 14, 39, 0.95)',
        borderColor: T.border,
        backdropFilter: 'blur(24px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setMobileOpen(false)}>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-lg"
              style={{ background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})` }}
            >E</div>
            <div className="hidden sm:flex items-center gap-0.5">
              <span className="text-lg font-bold text-white">Edu</span>
              <span className="text-lg font-bold text-[#F43F5E]">Forge</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/' || link.to === '/admin' || link.to === '/teacher'}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    isActive
                      ? 'text-white bg-white/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 md:gap-4">
            {!user ? (
              <div className="hidden sm:flex items-center gap-2">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      isActive ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`
                  }
                >Sign in</NavLink>
                <NavLink
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all"
                  style={{ background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})` }}
                >Sign up</NavLink>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <NavLink
                  to={user.role === 'admin' ? '/admin/profile' : user.role === 'teacher' ? '/teacher/profile' : '/profile'}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive ? 'text-white bg-white/10' : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})` }}
                  >
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden lg:inline">{user.name}</span>
                </NavLink>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-all rounded-lg hover:bg-white/5"
                >Logout</button>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg transition-all"
              style={{
                background: mobileOpen ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)',
                border: mobileOpen ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t" style={{ borderColor: T.border }}>
          <nav className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/' || link.to === '/admin' || link.to === '/teacher'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    isActive ? 'text-white' : 'text-gray-300 hover:text-white'
                  }`
                }
                style={({ isActive }) => ({
                  background: isActive ? 'rgba(139,92,246,0.2)' : 'transparent',
                })}
              >{link.label}</NavLink>
            ))}

            {/* Mobile auth */}
            {!user ? (
              <div className="space-y-2 pt-2 border-t" style={{ borderColor: T.border }}>
                <NavLink to="/login" onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                >Sign in</NavLink>
                <NavLink to="/register" onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-all"
                  style={{ background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})` }}
                >Sign up</NavLink>
              </div>
            ) : (
              <div className="space-y-2 pt-2 border-t" style={{ borderColor: T.border }}>
                <div className="flex items-center gap-2 px-4 py-2.5">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})` }}
                  >{user.name?.[0]?.toUpperCase() || 'U'}</div>
                  <span className="text-sm text-white font-medium">{user.name}</span>
                  {user.role !== 'student' && (
                    <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase"
                      style={{
                        background: user.role === 'admin' ? 'rgba(225,29,72,0.2)' : 'rgba(249,115,22,0.2)',
                        color:      user.role === 'admin' ? '#e11d48' : '#f97316',
                      }}
                    >{user.role}</span>
                  )}
                </div>
                <button
                  onClick={onLogout}
                  className="w-full px-4 py-2.5 text-sm font-medium text-red-400 hover:text-white rounded-lg hover:bg-red-500/10 transition-all text-left"
                >Logout</button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}