import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    const r = await dispatch(register(form));
    if (r.meta.requestStatus === 'fulfilled') {
      toast.success('Account created');
      navigate('/dashboard');
    } else {
      toast.error(r.payload || 'Could not register');
    }
  };

  return (
    <div className="container">
      <div className="card auth-wrap">
        <h1>Create account</h1>
        <form onSubmit={onSubmit}>
          <label className="label">Full name</label>
          <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <label className="label">Email</label>
          <input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <label className="label">Password</label>
          <input className="input" type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <label className="label">I am a</label>
          <select className="select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          <div style={{ height: 16 }} />
          <button className="btn btn-primary btn-block">Sign up</button>
        </form>
        <p className="muted" style={{ marginTop: 16 }}>
          Have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
