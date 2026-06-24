import { useState } from 'react';
import { notificationApi } from '../../services';
import api from '../../services/api';
import { toast } from 'react-toastify';
export default function NotificationsAdmin() {
  const [form, setForm] = useState({ user: '', title: '', message: '', type: 'info' });
  const send = async () => {
    await api.post('/notifications', form);
    toast.success('Sent');
  };
  return (
    <div className="container page">
      <h1>Send Notification</h1>
      <input className="input" placeholder="User ID" value={form.user} onChange={(e) => setForm({...form, user: e.target.value})} />
      <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} style={{marginTop:8}} />
      <textarea className="textarea" rows={3} placeholder="Message" value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} style={{marginTop:8}} />
      <button className="btn btn-primary" onClick={send} style={{marginTop:12}}>Send</button>
    </div>
  );
}
