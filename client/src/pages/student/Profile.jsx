import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userApi } from '../../services';
import { loadMe } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';

export default function StudentProfile() {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const [form, setForm] = useState({ name: user?.name, bio: user?.bio, phone: user?.phone });
  const save = async () => {
    await userApi.updateMe(form);
    await dispatch(loadMe());
    toast.success('Profile updated');
  };
  return (
    <div className="container page" style={{ maxWidth: 600 }}>
      <h1>Profile</h1>
      <label className="label">Name</label>
      <input className="input" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <label className="label">Bio</label>
      <textarea className="textarea" rows={4} value={form.bio || ''} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
      <label className="label">Phone</label>
      <input className="input" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <div style={{ height: 12 }} />
      <button className="btn btn-primary" onClick={save}>Save</button>
    </div>
  );
}
