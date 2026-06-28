// import { Outlet } from 'react-router-dom';
// import Sidebar from './Sidebar.jsx';
// import Navbar from './Navbar.jsx';

// export default function AdminLayout() {
//   const links = [
//     { to: "/admin", label: "Dashboard", icon: "🏠" },
//     { to: "/admin/teachers", label: "Teachers", icon: "👨‍🏫" },
//     { to: "/admin/students", label: "Students", icon: "👨‍🎓" },
//     { to: "/admin/courses", label: "Courses", icon: "📚" },
//     { to: "/admin/categories", label: "Categories", icon: "🏷️" },
//     { to: "/admin/enrollments", label: "Enrollments", icon: "📝" },
//     { to: "/admin/payments", label: "Payments", icon: "💰" },
//     { to: "/admin/certificates", label: "Certificates", icon: "🏆" },
//     { to: "/admin/notifications", label: "Notifications", icon: "🛎️" },
//     { to: "/admin/ai-analytics", label: "AI Analytics", icon: "📈" },
//     { to: "/admin/profile", label: "Profile", icon: "👤" },
//     { to: "/admin/settings", label: "Settings", icon: "⚙️" },
//   ];

//   return (
//     <div className="flex h-screen overflow-hidden bg-gray-950 text-white">
//       <Sidebar links={links} role="admin" />
      
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Navbar />
//         <main className="flex-1 overflow-auto p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }





import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const NAV_ITEMS = [
  { to: '/admin',                icon: '🏠',  label: 'Dashboard'    },
  { to: '/',    icon: '🏠', label: 'Home'   },
  { to: '/admin/teachers',       icon: '👨‍🏫', label: 'Teachers'     },
  { to: '/admin/students',       icon: '👨‍🎓', label: 'Students'     },
  { to: '/admin/courses',        icon: '📚',  label: 'Courses'      },
  { to: '/admin/categories',     icon: '🏷️',  label: 'Categories'   },
  { to: '/admin/enrollments',    icon: '📝',  label: 'Enrollments'  },
  { to: '/admin/payments',       icon: '💰',  label: 'Payments'     },
  { to: '/admin/certificates',   icon: '🏆',  label: 'Certificates' },
  { to: '/admin/notifications',  icon: '🛎️',  label: 'Notifications'},
  { to: '/admin/ai-analytics',   icon: '📈',  label: 'AI Analytics' },
  { to: '/admin/profile',        icon: '👤',  label: 'Profile'      },
  { to: '/admin/settings',       icon: '⚙️',  label: 'Settings'     },
];

const BOTTOM_TABS = [
  { to: '/admin',             icon: '🏠',  label: 'Home'     },
  { to: '/admin/courses',     icon: '📚',  label: 'Courses'  },
  { to: '/admin/students',    icon: '👨‍🎓', label: 'Students' },
  { to: '/admin/payments',    icon: '💰',  label: 'Payments' },
  { to: '/admin/settings',    icon: '⚙️',  label: 'Settings' },
];

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => { dispatch(logout()); navigate('/login'); };

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'A';

  return (
    <div className="flex h-screen bg-[#0d0d1a] text-white overflow-hidden">

      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="hidden lg:flex w-[260px] shrink-0 flex-col bg-[#13132b] border-r border-white/[0.06] h-full">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.06]">
          <div className="w-9 h-9 rounded-lg bg-[#e11d48] flex items-center justify-center font-bold text-sm shrink-0">E</div>
          <div>
            <p className="font-bold text-[15px] leading-none">Edu<span className="text-[#f97316]">Forge</span></p>
            <p className="text-[11px] text-white/40 mt-0.5">Admin Console</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map((item) => <SidebarLink key={item.to} {...item} />)}
        </nav>

        <div className="border-t border-white/[0.06] p-3">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-[#e11d48] flex items-center justify-center font-semibold text-sm shrink-0 relative">
              {initials}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#22c55e] rounded-full border-2 border-[#13132b]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium truncate">{user?.name || 'Admin'}</p>
              <p className="text-[11px] text-[#e11d48] font-medium">● Admin</p>
            </div>
            <button
              onClick={handleLogout}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-red-400 text-xs px-2 py-1 rounded-md hover:bg-white/10"
              title="Logout"
            >↩</button>
          </div>
        </div>
      </aside>

      {/* ===== MOBILE TOP BAR ===== */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-[#13132b] border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#e11d48] flex items-center justify-center font-bold text-sm">E</div>
          <span className="font-bold text-[15px]">Edu<span className="text-[#f97316]">Forge</span></span>
          <span className="text-[10px] bg-[#e11d48]/20 text-[#e11d48] px-2 py-0.5 rounded-full font-medium border border-[#e11d48]/30">ADMIN</span>
        </div>
        <button onClick={() => setDrawerOpen(true)} className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center" aria-label="Open menu">
          <span className="flex flex-col gap-[5px] w-[18px]">
            <span className="block h-[2px] bg-white rounded-full" />
            <span className="block h-[2px] bg-white rounded-full" />
            <span className="block h-[2px] bg-white rounded-full" />
          </span>
        </button>
      </div>

      {/* ===== MOBILE DRAWER ===== */}
      {drawerOpen && <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-[280px] z-50 bg-[#13132b] border-r border-white/[0.06] flex flex-col transition-transform duration-300 ease-out ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#e11d48] flex items-center justify-center font-bold text-sm">E</div>
            <span className="font-bold text-[15px]">Edu<span className="text-[#f97316]">Forge</span></span>
          </div>
          <button onClick={() => setDrawerOpen(false)} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:text-white">✕</button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map((item) => <SidebarLink key={item.to} {...item} onClick={() => setDrawerOpen(false)} />)}
        </nav>
        <div className="border-t border-white/[0.06] p-3 space-y-2">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-[#e11d48] flex items-center justify-center font-semibold text-sm shrink-0 relative">
              {initials}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#22c55e] rounded-full border-2 border-[#13132b]" />
            </div>
            <div>
              <p className="text-[13px] font-medium">{user?.name || 'Admin'}</p>
              <p className="text-[11px] text-[#e11d48] font-medium">● Admin</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-colors">
            <span>↩</span> Logout
          </button>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 min-w-0 overflow-y-auto lg:pt-0 pt-[52px] pb-[72px] lg:pb-0">
        <Outlet />
      </main>

      {/* ===== MOBILE BOTTOM TAB BAR ===== */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#13132b] border-t border-white/[0.06] flex items-center justify-around px-2 pb-safe">
        {BOTTOM_TABS.map((tab) => <BottomTab key={tab.to} {...tab} />)}
      </nav>
    </div>
  );
}

function SidebarLink({ to, icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      end={to === '/admin'}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
          isActive ? 'bg-[#2d1a1a] text-white font-medium' : 'text-white/60 hover:text-white hover:bg-white/5'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className="text-[18px] w-6 text-center shrink-0">{icon}</span>
          <span className="flex-1">{label}</span>
          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48] shrink-0" />}
        </>
      )}
    </NavLink>
  );
}

function BottomTab({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      end={to === '/admin'}
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all ${isActive ? 'text-[#e11d48]' : 'text-white/40'}`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`text-[22px] leading-none transition-transform ${isActive ? 'scale-110' : ''}`}>{icon}</span>
          <span className="text-[10px] font-medium leading-none">{label}</span>
          {isActive && <span className="w-1 h-1 rounded-full bg-[#e11d48]" />}
        </>
      )}
    </NavLink>
  );
}