// import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { login } from '../../redux/slices/authSlice';
// import { toast } from 'react-toastify';

// export default function Login() {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const loc = useLocation();
//   const { loading } = useSelector((s) => s.auth);

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     const r = await dispatch(login(form));
//     if (r.meta.requestStatus === 'fulfilled') {
//       toast.success('Welcome back!');
//       navigate(loc.state?.from?.pathname || '/dashboard');
//     } else {
//       toast.error(r.payload || 'Login failed');
//     }
//   };

//   return (
//     <div className="container">
//       <div className="card auth-wrap">
//         <h1>Sign in</h1>
//         <form onSubmit={onSubmit}>
//           <label className="label">Email</label>
//           <input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
//           <label className="label">Password</label>
//           <input className="input" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
//           <div style={{ height: 16 }} />
//           <button className="btn btn-primary btn-block" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
//         </form>
//         <p className="muted" style={{ marginTop: 16 }}>
//           No account? <Link to="/register" style={{ color: 'var(--primary)' }}>Create one</Link>
//         </p>
//       </div>
//     </div>
//   );
// }





import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading } = useSelector((s) => s.auth);

  const onSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(login(form));

    if (result.meta.requestStatus === 'fulfilled') {
      const user = result.payload?.user;   // Make sure your authSlice returns user

      toast.success('Welcome back!');

      // Role-based Redirect
      let redirectTo = location.state?.from?.pathname || '/dashboard';

      if (user?.role === 'teacher') {
        redirectTo = '/teacher';
      } else if (user?.role === 'admin') {
        redirectTo = '/admin';
      } 
      // student stays on /dashboard

      navigate(redirectTo, { replace: true });
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };

  return (
    <div className="container">
      <div className="card auth-wrap">
        <h1>Sign in</h1>
        <form onSubmit={onSubmit}>
          <label className="label">Email</label>
          <input 
            className="input" 
            type="email" 
            required 
            value={form.email} 
            onChange={(e) => setForm({ ...form, email: e.target.value })} 
          />
          
          <label className="label">Password</label>
          <input 
            className="input" 
            type="password" 
            required 
            value={form.password} 
            onChange={(e) => setForm({ ...form, password: e.target.value })} 
          />

          <div style={{ height: 16 }} />
          <button 
            className="btn btn-primary btn-block" 
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="muted" style={{ marginTop: 16 }}>
          No account? <Link to="/register" style={{ color: 'var(--primary)' }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}