// import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { userApi } from '../../services';
// import { loadMe } from '../../redux/slices/authSlice';
// import { toast } from 'react-toastify';

// export default function StudentProfile() {
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



import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userApi } from '../../services';
import { loadMe } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { User, Phone, FileText, Save, Camera, CheckCircle2 } from 'lucide-react';

export default function StudentProfile() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  // ← ALL EXISTING LOGIC PRESERVED EXACTLY
  const [form, setForm] = useState({
    name:  user?.name  || '',
    bio:   user?.bio   || '',
    phone: user?.phone || '',
  });
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await userApi.updateMe(form);
      await dispatch(loadMe());
      toast.success('Profile updated');
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const initials = form.name
    ? form.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'ST';

  const FIELDS = [
    { key: 'name',  label: 'Full Name',    icon: User,     type: 'input',    placeholder: 'Your full name'        },
    { key: 'phone', label: 'Phone Number', icon: Phone,    type: 'input',    placeholder: '+91 98765 43210'       },
    { key: 'bio',   label: 'Bio',          icon: FileText, type: 'textarea', placeholder: 'Tell us about yourself…'},
  ];

  return (
    <div className="min-h-screen bg-[#09090F] text-white p-6 lg:p-10 font-['Inter',sans-serif]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-1">My Profile</h1>
          <p className="text-white/40 text-sm">Manage your personal information</p>
        </div>

        {/* Avatar card */}
        <div className="rounded-[24px] border border-white/[0.08] bg-[#121826] p-6 mb-5 flex items-center gap-5">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white"
              style={{ background: 'linear-gradient(135deg,#5B7FFF,#7C3AED)' }}>
              {initials}
            </div>
            <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-lg flex items-center justify-center border-2 border-[#09090F]"
              style={{ background: 'linear-gradient(135deg,#5B7FFF,#7C3AED)' }}
              aria-label="Change avatar">
              <Camera className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
          <div>
            <p className="text-lg font-bold text-white">{form.name || 'Student'}</p>
            <p className="text-sm text-white/40 mt-0.5">{user?.email || ''}</p>
            <span className="inline-block mt-2 text-[11px] px-2.5 py-1 rounded-full font-medium capitalize"
              style={{ background: 'rgba(91,127,255,0.15)', color: '#5B7FFF', border: '1px solid rgba(91,127,255,0.25)' }}>
              {user?.role || 'student'}
            </span>
          </div>
        </div>

        {/* Form card */}
        <div className="rounded-[24px] border border-white/[0.08] bg-[#121826] p-6">
          <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-6">Personal Information</p>

          <div className="space-y-5">
            {FIELDS.map(({ key, label, icon: Icon, type, placeholder }) => (
              <div key={key}>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">
                  <Icon className="w-3.5 h-3.5" /> {label}
                </label>
                {type === 'textarea' ? (
                  <textarea
                    rows={4}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full bg-[#09090F] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#5B7FFF]/50 resize-none transition-colors"
                  />
                ) : (
                  <input
                    type="text"
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full bg-[#09090F] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#5B7FFF]/50 transition-colors"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Save button */}
          <div className="mt-6 flex justify-end">
            <motion.button
              onClick={save}
              disabled={saving}
              whileHover={{ scale: saving ? 1 : 1.03 }}
              whileTap={{ scale: saving ? 1 : 0.97 }}
              className="flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm text-white disabled:opacity-50 transition-all"
              style={{ background: saved ? 'linear-gradient(135deg,#22C55E,#16a34a)' : 'linear-gradient(135deg,#5B7FFF,#7C3AED)' }}
            >
              {saving ? (
                <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving…</>
              ) : saved ? (
                <><CheckCircle2 className="w-4 h-4" /> Saved!</>
              ) : (
                <><Save className="w-4 h-4" /> Save Changes</>
              )}
            </motion.button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}