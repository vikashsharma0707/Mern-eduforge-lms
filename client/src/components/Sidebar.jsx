// // // import { NavLink } from 'react-router-dom';

// // // export default function Sidebar({ links }) {
// // //   return (
// // //     <aside className="sidebar">
// // //       {links.map((l) => (
// // //         <NavLink key={l.to} to={l.to} end className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}>
// // //           {l.label}
// // //         </NavLink>
// // //       ))}
// // //     </aside>
// // //   );
// // // }




// // import { NavLink } from 'react-router-dom';

// // export default function Sidebar({ links, role }) {
// //   return (
// //     <aside className="w-72 bg-gray-900 border-r border-gray-800 flex flex-col h-full">
// //       {/* Logo */}
// //       <div className="p-6 border-b border-gray-800">
// //         <div className="flex items-center gap-3">
// //           <div className="w-10 h-10 bg-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">E</div>
// //           <div>
// //             <h1 className="text-2xl font-bold">EduForge</h1>
// //             <p className="text-xs text-gray-400">Learning OS</p>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Navigation */}
// //       <nav className="flex-1 p-4 space-y-1 overflow-auto">
// //         {links.map((link) => (
// //           <NavLink
// //             key={link.to}
// //             to={link.to}
// //             end
// //             className={({ isActive }) =>
// //               `flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all ${
// //                 isActive
// //                   ? 'bg-purple-600 text-white shadow-lg'
// //                   : 'text-gray-300 hover:bg-gray-800 hover:text-white'
// //               }`
// //             }
// //           >
// //             <span className="text-xl">{link.icon}</span>
// //             {link.label}
// //           </NavLink>
// //         ))}
// //       </nav>

// //       {/* Bottom User Info (Optional) */}
// //       <div className="p-4 border-t border-gray-800 mt-auto">
// //         <div className="text-xs text-gray-500 text-center">
// //           {role === 'admin' ? 'Administrator' : role === 'teacher' ? 'Instructor' : 'Student'}
// //         </div>
// //       </div>
// //     </aside>
// //   );
// // }





// import { NavLink, useLocation } from 'react-router-dom';
// import { useState, useEffect } from 'react';

// export default function Sidebar({ links, role }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const location = useLocation();

//   // Close sidebar on route change (mobile)
//   useEffect(() => {
//     setIsOpen(false);
//   }, [location.pathname]);

//   return (
//     <>
//       {/* Mobile Hamburger Button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-gray-900 rounded-xl border border-gray-700 text-white"
//       >
//         <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6h12v12" : "M4 6h16M4 12h16M4 18h16"} />
//         </svg>
//       </button>

//       {/* Sidebar */}
//       <aside
//         className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-gray-900 border-r border-gray-800 flex flex-col transition-transform duration-300 ${
//           isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
//         }`}
//       >
//         {/* Logo / Header */}
//         <div className="p-6 border-b border-gray-800">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
//               E
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-white">EduForge</h1>
//               <p className="text-xs text-gray-400 -mt-1">Learning OS</p>
//             </div>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 overflow-y-auto p-4 space-y-1">
//           {links.map((link) => {
//             const isActive = location.pathname === link.to || 
//                            (link.to !== '/dashboard' && location.pathname.startsWith(link.to));
            
//             return (
//               <NavLink
//                 key={link.to}
//                 to={link.to}
//                 end={link.to === '/dashboard'}
//                 onClick={() => setIsOpen(false)} // Close on mobile click
//                 className={({ isActive: active }) =>
//                   `flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all ${
//                     active
//                       ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
//                       : 'text-gray-300 hover:bg-gray-800 hover:text-white'
//                   }`
//                 }
//               >
//                 <span className="text-xl">{link.icon}</span>
//                 <span>{link.label}</span>
//               </NavLink>
//             );
//           })}
//         </nav>

//         {/* Bottom User Info */}
//         <div className="p-4 border-t border-gray-800 mt-auto">
//           <div className="flex items-center gap-3 px-3 py-3 bg-gray-800/50 rounded-2xl">
//             <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-semibold">
//               {role === 'admin' ? 'A' : role === 'teacher' ? 'T' : 'S'}
//             </div>
//             <div className="text-sm">
//               <div className="font-medium text-white">
//                 {role === 'admin' ? 'Administrator' : role === 'teacher' ? 'Instructor' : 'Student'}
//               </div>
//               <div className="text-xs text-gray-500">Online</div>
//             </div>
//           </div>
//         </div>
//       </aside>

//       {/* Mobile Overlay */}
//       {isOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black/70 z-30"
//           onClick={() => setIsOpen(false)}
//         />
//       )}
//     </>
//   );
// }






// ✅ SIDEBAR.JSX - Updated with Proper Colors

import { NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const T = {
  bg:      '#0a0e27',
  surface: 'rgba(255,255,255,0.04)',
  border:  'rgba(255,255,255,0.07)',
  purple:  '#8B5CF6',
  indigo:  '#6366F1',
};

export default function Sidebar({ links, role }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (link) =>
    link.exact ? location.pathname === link.to : location.pathname.startsWith(link.to);

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl text-white"
        style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6h12v12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 flex flex-col transition-all duration-300 border-r`}
        style={{
          background: T.bg,
          borderColor: T.border,
          transform: isOpen ? 'translateX(0)' : '-translateX(100%)',
          '@media (min-width: 1024px)': { transform: 'translateX(0)' }
        }}
      >
        {/* Logo */}
        <div className="p-6 border-b" style={{ borderColor: T.border }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-xl"
              style={{ background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})` }}>
              E
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">EduForge</h1>
              <p className="text-xs text-gray-500 -mt-1">Learning OS</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1" style={{ scrollbarWidth: 'none' }}>
          {links.map((link) => {
            const active = isActive(link);
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-medium transition-all ${
                  active
                    ? 'text-white shadow-lg'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
                style={active ? {
                  background: `linear-gradient(135deg, rgba(139,92,246,0.2), rgba(99,102,241,0.2))`,
                  border: `1px solid rgba(139,92,246,0.4)`,
                  boxShadow: `0 0 20px rgba(139,92,246,0.2)`
                } : {}}
              >
                <span className="text-xl">{link.icon}</span>
                <span>{link.label}</span>
                {active && <span className="ml-auto w-2 h-2 rounded-full" style={{ background: T.purple }} />}
              </NavLink>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t" style={{ borderColor: T.border }}>
          <div className="flex items-center gap-3 px-3 py-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-semibold"
              style={{ background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})` }}>
              {role === 'admin' ? 'A' : role === 'teacher' ? 'T' : 'S'}
            </div>
            <div className="text-sm">
              <div className="font-medium text-white">
                {role === 'admin' ? 'Administrator' : role === 'teacher' ? 'Instructor' : 'Student'}
              </div>
              <div className="text-xs text-green-400">● Online</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}