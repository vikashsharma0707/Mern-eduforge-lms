// import { Link, NavLink, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { logout } from '../redux/slices/authSlice';
// import { useState } from 'react';

// export default function Navbar() {
//   const { user } = useSelector((s) => s.auth);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [open, setOpen] = useState(false);

//   const onLogout = () => { dispatch(logout()); navigate('/'); };

//   return (
//     <header className="navbar">
//       <div className="container nav-inner">
//         <Link to="/" className="brand">Edu<span>Forge</span></Link>
//         <button className="nav-toggle" onClick={() => setOpen(!open)}>☰</button>
//         <nav className={`nav-links ${open ? 'open' : ''}`}>
//           <NavLink to="/courses">Courses</NavLink>
//           {user && <NavLink to="/dashboard">Dashboard</NavLink>}
//           {user && <NavLink to="/ai-assistant">AI Assistant</NavLink>}
//           {user?.role === 'teacher' && <NavLink to="/teacher">Teacher</NavLink>}
//           {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
//           {!user ? (
//             <>
//               <NavLink to="/login" className="btn btn-ghost">Sign in</NavLink>
//               <NavLink to="/register" className="btn btn-primary">Sign up</NavLink>
//             </>
//           ) : (
//             <>
//               <NavLink to="/profile" className="user-chip">{user.name}</NavLink>
//               <button className="btn btn-ghost" onClick={onLogout}>Logout</button>
//             </>
//           )}
//         </nav>
//       </div>
//     </header>
//   );
// }




import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useState } from 'react';

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const onLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // Role-based Dashboard Link
  const dashboardLink = () => {
    if (!user) return '/dashboard';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'teacher') return '/teacher';
    return '/dashboard'; // student
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand">
          Edu<span>Forge</span>
        </Link>

        <button className="nav-toggle" onClick={() => setOpen(!open)}>
          ☰
        </button>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          <NavLink to="/courses">Courses</NavLink>

          {user && (
            <NavLink to={dashboardLink()}>
              Dashboard
            </NavLink>
          )}

          {user && <NavLink to="/ai-assistant">AI Assistant</NavLink>}

          {/* Teacher Link */}
          {(user?.role === 'teacher' || user?.role === 'admin') && (
            <NavLink to="/teacher">Teacher</NavLink>
          )}

          {/* Admin Link */}
          {user?.role === 'admin' && (
            <NavLink to="/admin">Admin</NavLink>
          )}

          {!user ? (
            <>
              <NavLink to="/login" className="btn btn-ghost">Sign in</NavLink>
              <NavLink to="/register" className="btn btn-primary">Sign up</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/profile" className="user-chip">
                {user.name}
              </NavLink>
              <button className="btn btn-ghost" onClick={onLogout}>
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}