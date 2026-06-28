// export default function StudentSettings() {
//   return (
//     <div className="container page">
//       <h1>Settings</h1>
//       <div className="card"><h3>Notifications</h3><label><input type="checkbox" defaultChecked /> Email me about new lessons</label></div>
//       <div className="card" style={{ marginTop: 12 }}><h3>Appearance</h3><p className="muted">Dark theme (default)</p></div>
//     </div>
//   );
// }




import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell, Moon, Globe, Shield, Smartphone, Mail,
  BookOpen, Zap, ChevronRight, Check,
} from 'lucide-react';
import { toast } from 'react-toastify';

const Toggle = ({ checked, onChange }) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className="relative w-11 h-6 rounded-full transition-all shrink-0"
    style={{ background: checked ? 'linear-gradient(135deg,#5B7FFF,#7C3AED)' : 'rgba(255,255,255,0.1)' }}
  >
    <motion.span
      className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow"
      animate={{ left: checked ? '22px' : '2px' }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    />
  </button>
);

const SettingRow = ({ icon: Icon, label, desc, checked, onChange }) => (
  <div className="flex items-center justify-between gap-4 py-4 border-b border-white/[0.05] last:border-0">
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: 'rgba(91,127,255,0.12)' }}>
        <Icon className="w-4 h-4 text-[#5B7FFF]" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-white">{label}</p>
        {desc && <p className="text-xs text-white/40 mt-0.5">{desc}</p>}
      </div>
    </div>
    <Toggle checked={checked} onChange={onChange} />
  </div>
);

export default function StudentSettings() {
  // ← ALL EXISTING LOGIC PRESERVED — just expanded with proper state
  const [settings, setSettings] = useState({
    emailLessons:   true,
    emailCerts:     true,
    emailPromo:     false,
    pushReminders:  true,
    darkTheme:      true,
    compactMode:    false,
    language:       'English',
    twoFactor:      false,
    activityVisible: true,
  });

  const toggle = (key) =>
    setSettings((s) => ({ ...s, [key]: !s[key] }));

  const saveAll = () => toast.success('Settings saved');

  const NOTIFICATION_ROWS = [
    { key: 'emailLessons',  icon: Mail,      label: 'New lesson emails',      desc: 'Get notified when new lessons are published' },
    { key: 'emailCerts',    icon: BookOpen,  label: 'Certificate emails',     desc: 'Notify when you earn a certificate' },
    { key: 'emailPromo',    icon: Zap,       label: 'Promotional emails',     desc: 'Offers, discounts and announcements' },
    { key: 'pushReminders', icon: Smartphone,label: 'Learning reminders',     desc: 'Daily nudges to keep your streak' },
  ];

  const APPEARANCE_ROWS = [
    { key: 'darkTheme',   icon: Moon,  label: 'Dark theme',    desc: 'Use dark background across the app' },
    { key: 'compactMode', icon: Globe, label: 'Compact mode',  desc: 'Reduce spacing for more content' },
  ];

  const PRIVACY_ROWS = [
    { key: 'twoFactor',      icon: Shield,   label: 'Two-factor authentication', desc: 'Extra security for your account' },
    { key: 'activityVisible',icon: ChevronRight, label: 'Public activity',       desc: 'Let others see your learning progress' },
  ];

  const SECTIONS = [
    { title: 'Notifications', icon: Bell,   rows: NOTIFICATION_ROWS },
    { title: 'Appearance',    icon: Moon,   rows: APPEARANCE_ROWS   },
    { title: 'Privacy',       icon: Shield, rows: PRIVACY_ROWS      },
  ];

  return (
    <div className="min-h-screen bg-[#09090F] text-white p-6 lg:p-10 font-['Inter',sans-serif]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-1">Settings</h1>
          <p className="text-white/40 text-sm">Manage your preferences and account settings</p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {SECTIONS.map(({ title, icon: SectionIcon, rows }, si) => (
            <motion.div key={title}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * si }}
              className="rounded-[24px] border border-white/[0.08] bg-[#121826] px-6 py-2">
              <div className="flex items-center gap-2 py-4 border-b border-white/[0.06] mb-1">
                <SectionIcon className="w-4 h-4 text-[#5B7FFF]" />
                <p className="text-xs uppercase tracking-widest font-semibold text-white/40">{title}</p>
              </div>
              {rows.map(({ key, icon, label, desc }) => (
                <SettingRow key={key} icon={icon} label={label} desc={desc}
                  checked={settings[key]} onChange={() => toggle(key)} />
              ))}
            </motion.div>
          ))}

          {/* Language selector */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="rounded-[24px] border border-white/[0.08] bg-[#121826] px-6 py-5">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-4 h-4 text-[#5B7FFF]" />
              <p className="text-xs uppercase tracking-widest font-semibold text-white/40">Language</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {['English', 'Hindi', 'Spanish'].map((lang) => (
                <button key={lang}
                  onClick={() => setSettings((s) => ({ ...s, language: lang }))}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                  style={settings.language === lang ? {
                    background: 'linear-gradient(135deg,#5B7FFF,#7C3AED)', color: 'white',
                  } : {
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)',
                  }}>
                  {settings.language === lang && <Check className="w-3.5 h-3.5" />}
                  {lang}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Save button */}
        <div className="mt-6 flex justify-end">
          <motion.button onClick={saveAll}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="px-7 py-3 rounded-xl font-semibold text-sm text-white"
            style={{ background: 'linear-gradient(135deg,#5B7FFF,#7C3AED)' }}>
            Save Settings
          </motion.button>
        </div>

      </motion.div>
    </div>
  );
}