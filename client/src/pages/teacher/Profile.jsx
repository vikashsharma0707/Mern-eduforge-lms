// import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { userApi } from '../../services';
// import { loadMe } from '../../redux/slices/authSlice';
// import { toast } from 'react-toastify';

// export default function TeacherProfile() {
//   const { user } = useSelector(s => s.auth);
//   const dispatch = useDispatch();
//   const [form, setForm] = useState({ name: user?.name, bio: user?.bio, phone: user?.phone });
//   const save = async () => {
//     await userApi.updateMe(form);
//     await dispatch(loadMe());
//     toast.success('Profile updated');
//   };
//   return (
//     <div className="container page" style={{ maxWidth: 600 }}>
//       <h1>Profile</h1>
//       <label className="label">Name</label>
//       <input className="input" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
//       <label className="label">Bio</label>
//       <textarea className="textarea" rows={4} value={form.bio || ''} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
//       <label className="label">Phone</label>
//       <input className="input" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
//       <div style={{ height: 12 }} />
//       <button className="btn btn-primary" onClick={save}>Save</button>
//     </div>
//   );
// }



/**
 * TeacherProfile.jsx
 * Premium instructor profile page — cyan/teal theme matching TeacherDashboard.
 * All original logic preserved: userApi.updateMe(), dispatch(loadMe()), toast
 */
import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userApi } from '../../services';
import { loadMe } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';

const T = {
  bg:      '#08100F',
  surface: 'rgba(255,255,255,0.04)',
  border:  'rgba(255,255,255,0.07)',
  cyan:    '#06B6D4',
  teal:    '#0D9488',
  emerald: '#10B981',
};

function Icon({ d, size = 'w-5 h-5', className = '' }) {
  return (
    <svg className={`${size} ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

function Field({ label, icon, children, hint }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>
        <Icon d={icon} size="w-3.5 h-3.5" />
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.22)' }}>{hint}</p>}
    </div>
  );
}

export default function TeacherProfile() {
  const { user } = useSelector((s) => s.auth);
  const dispatch  = useDispatch();
  const [form, setForm]   = useState({ name: user?.name || '', bio: user?.bio || '', phone: user?.phone || '' });
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty]   = useState(false);
  const fileRef = useRef(null);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setDirty(true); };

  const save = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      await userApi.updateMe(form);
      await dispatch(loadMe());
      toast.success('Profile updated successfully');
      setDirty(false);
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const initials = (form.name || 'T').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen" style={{ background: T.bg, color: '#fff' }}>

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[500px] rounded-full blur-[140px]"
          style={{ background: 'rgba(6,182,212,0.07)' }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px]"
          style={{ background: 'rgba(13,148,136,0.05)' }} />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-7">

        {/* Page header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: T.cyan }}>Instructor</span>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>/</span>
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>Profile</span>
          </div>
          <h1 className="text-[24px] font-bold text-white tracking-tight">Your profile</h1>
          <p className="text-[13px] mt-1" style={{ color: 'rgba(255,255,255,0.38)' }}>
            This information is visible to your students on your instructor page.
          </p>
        </div>

        {/* Avatar + name card */}
        <div className="rounded-2xl p-6" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-[26px] font-bold text-white select-none"
                style={{ background: 'linear-gradient(135deg, #0D9488, #06B6D4)', boxShadow: '0 8px 32px rgba(6,182,212,0.3)' }}>
                {user?.avatar
                  ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover rounded-2xl" />
                  : initials}
              </div>
              <button onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-7 h-7 rounded-xl flex items-center justify-center transition-colors hover:opacity-80"
                style={{ background: 'linear-gradient(135deg, #0D9488, #06B6D4)', boxShadow: '0 4px 12px rgba(6,182,212,0.4)' }}>
                <Icon d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z" size="w-3.5 h-3.5" className="text-white" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" hidden />
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-[18px] font-bold text-white truncate">{form.name || 'Your Name'}</div>
              <div className="text-[13px] mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{user?.email}</div>
              <div className="flex items-center gap-2 mt-2.5">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                  style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)', color: '#67E8F9' }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: T.emerald }} />
                  Instructor
                </span>
                {user?.isVerified && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                    style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#6EE7B7' }}>
                    ✓ Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="rounded-2xl overflow-hidden" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
          <div className="px-6 py-4" style={{ borderBottom: `1px solid ${T.border}`, background: 'rgba(255,255,255,0.02)' }}>
            <h2 className="text-[14px] font-bold text-white">Personal information</h2>
            <p className="text-[12px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Update your public instructor details</p>
          </div>

          <div className="px-6 py-6 space-y-6">

            {/* Name */}
            <Field label="Full name" icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z">
              <div className="relative">
                <input
                  className="w-full rounded-xl px-4 py-3 text-[14px] text-white outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={(e) => { e.target.style.borderColor = T.cyan; e.target.style.boxShadow = `0 0 0 3px rgba(6,182,212,0.12)`; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                />
              </div>
            </Field>

            {/* Bio */}
            <Field label="Bio" icon="M4 6h16M4 12h16M4 18h7"
              hint="Write a short bio that appears on your instructor page. Max 300 characters.">
              <div className="relative">
                <textarea
                  rows={4}
                  className="w-full rounded-xl px-4 py-3 text-[14px] text-white outline-none resize-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={(e) => { e.target.style.borderColor = T.cyan; e.target.style.boxShadow = `0 0 0 3px rgba(6,182,212,0.12)`; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                  placeholder="Tell students about yourself, your experience, and what you teach..."
                  value={form.bio}
                  onChange={(e) => set('bio', e.target.value)}
                  maxLength={300}
                />
                <span className="absolute bottom-3 right-4 text-[11px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  {form.bio?.length || 0}/300
                </span>
              </div>
            </Field>

            {/* Phone */}
            <Field label="Phone number" icon="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              hint="Used for account verification only. Not shown publicly.">
              <div className="relative flex">
                <div className="flex items-center px-3 rounded-l-xl text-[13px] font-medium shrink-0"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRight: 'none', color: 'rgba(255,255,255,0.4)' }}>
                  +91
                </div>
                <input
                  className="flex-1 rounded-r-xl px-4 py-3 text-[14px] text-white outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={(e) => { e.target.style.borderColor = T.cyan; e.target.style.boxShadow = `0 0 0 3px rgba(6,182,212,0.12)`; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                  placeholder="10-digit number"
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  type="tel"
                />
              </div>
            </Field>

          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: `1px solid ${T.border}`, background: 'rgba(255,255,255,0.01)' }}>
            <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.28)' }}>
              {dirty ? '● Unsaved changes' : 'All changes saved'}
            </p>
            <button
              onClick={save}
              disabled={saving || !dirty}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: saving || !dirty ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #0D9488, #06B6D4)', boxShadow: saving || !dirty ? 'none' : '0 4px 20px rgba(6,182,212,0.3)' }}>
              {saving ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving…
                </>
              ) : (
                <>
                  <Icon d="M5 13l4 4L19 7" size="w-4 h-4" />
                  Save changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Read-only info */}
        <div className="rounded-2xl p-5" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
          <h3 className="text-[13px] font-bold text-white mb-4">Account details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'Email',   value: user?.email,                   icon: 'M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207' },
              { label: 'Role',    value: 'Instructor',                  icon: 'M12 14l9-5-9-5-9 5 9 5zm0 7l-9-5 9-5 9 5-9 5z' },
              { label: 'Joined',  value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' }) : '—', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
              { label: 'Status',  value: user?.isVerified ? 'Verified ✓' : 'Pending', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.2)' }}>
                  <Icon d={item.icon} size="w-3.5 h-3.5" style={{ color: T.cyan }} />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>{item.label}</div>
                  <div className="text-[13px] font-medium text-white/70 truncate">{item.value || '—'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}