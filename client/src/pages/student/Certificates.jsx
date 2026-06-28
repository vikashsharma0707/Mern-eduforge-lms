// import { useEffect, useState } from 'react';
// import { certificateApi, enrollmentApi } from '../../services';

// export default function Certificates() {
//   const [certs, setCerts] = useState([]);
//   const [enrolls, setEnrolls] = useState([]);
//   useEffect(() => {
//     certificateApi.my().then(r => setCerts(r.data));
//     enrollmentApi.list().then(r => setEnrolls(r.data));
//   }, []);
//   const issue = async (cid) => {
//     const r = await certificateApi.issue(cid);
//     setCerts([...certs, r.data]);
//   };
//   return (
//     <div className="container page">
//       <h1>Certificates</h1>
//       <h3>Eligible (100% complete)</h3>
//       {enrolls.filter(e => e.progress === 100 && !certs.find(c => c.course?._id === e.course._id)).map(e => (
//         <div className="card" key={e._id} style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
//           <span>{e.course.title}</span>
//           <button className="btn btn-primary" onClick={() => issue(e.course._id)}>Issue certificate</button>
//         </div>
//       ))}
//       <h3 style={{ marginTop: 28 }}>Issued</h3>
//       {certs.map(c => (
//         <div className="card" key={c._id} style={{ marginBottom: 8 }}>
//           <h3>{c.course?.title}</h3>
//           <p className="muted">Serial: {c.serial}</p>
//         </div>
//       ))}
//     </div>
//   );
// }






import { useEffect, useState } from 'react';
import { certificateApi, enrollmentApi } from '../../services';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Trophy, Download, Award, CheckCircle2, Lock } from 'lucide-react';

export default function Certificates() {
  const [certs, setCerts]     = useState([]);
  const [enrolls, setEnrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState({});

  useEffect(() => {
    Promise.all([
      certificateApi.my().then((r) => setCerts(r.data || [])),
      enrollmentApi.list().then((r) => setEnrolls(r.data || [])),
    ])
      .catch(() => toast.error('Failed to load certificates'))
      .finally(() => setLoading(false));
  }, []);

  const issue = async (courseId) => {
    setIssuing((s) => ({ ...s, [courseId]: true }));
    try {
      const r = await certificateApi.issue(courseId);
      setCerts((c) => [...c, r.data]);
      toast.success('Certificate issued! 🎉');
    } catch {
      toast.error('Failed to issue certificate');
    } finally {
      setIssuing((s) => ({ ...s, [courseId]: false }));
    }
  };

  const eligible = enrolls.filter(
    (e) => e.progress === 100 && !certs.find((c) => c.course?._id === e.course._id)
  );

  return (
    <div className="min-h-screen bg-[#09090F] text-white p-6 lg:p-10 font-['Inter',sans-serif]">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1">Certificates</h1>
        <p className="text-white/40 text-sm">Your achievements and earned credentials</p>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4 mb-10">
        {[
          { icon: Trophy,        label: 'Earned',   val: certs.length,    color: '#f59e0b' },
          { icon: CheckCircle2,  label: 'Eligible', val: eligible.length, color: '#10b981' },
          { icon: Award,         label: 'Courses',  val: enrolls.length,  color: '#7C5CFF' },
        ].map((s) => (
          <div key={s.label} className="rounded-[20px] border border-white/[0.08] bg-[#121826] p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s.color}22` }}>
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{s.val}</p>
              <p className="text-xs text-white/40">{s.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#f59e0b] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Eligible for certificate */}
      {eligible.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mb-10">
          <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-4">
            Ready to claim
          </p>
          <div className="space-y-3">
            {eligible.map((e, i) => (
              <motion.div key={e._id}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="rounded-[20px] border border-[#10b981]/30 bg-[#10b981]/5 p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#10b981]/15 flex items-center justify-center shrink-0">
                  <Trophy className="w-6 h-6 text-[#10b981]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{e.course.title}</h3>
                  <p className="text-sm text-[#10b981] mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> 100% completed
                  </p>
                </div>
                <button
                  onClick={() => issue(e.course._id)}
                  disabled={issuing[e.course._id]}
                  className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all"
                  style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
                  {issuing[e.course._id] ? 'Issuing...' : 'Claim Certificate'}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Issued certificates */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-4">
          Issued certificates
        </p>

        {certs.length === 0 && !loading ? (
          <div className="text-center py-16 rounded-[20px] border border-white/[0.06] bg-[#121826]">
            <Lock className="w-10 h-10 text-white/15 mx-auto mb-3" />
            <p className="text-white/40 text-sm">Complete a course to earn your first certificate</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certs.map((c, i) => (
              <motion.div key={c._id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i }}
                whileHover={{ y: -4 }}
                className="rounded-[20px] border border-[#f59e0b]/20 bg-[#121826] overflow-hidden group">

                {/* Gold banner */}
                <div className="h-24 relative flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#f59e0b22,#d9770622)' }}>
                  <div className="absolute inset-0 opacity-20 blur-xl"
                    style={{ background: 'radial-gradient(circle,#f59e0b,transparent)' }} />
                  <Trophy className="w-10 h-10 text-[#f59e0b] relative z-10" />
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-white text-[15px] mb-1 truncate">
                    {c.course?.title || 'Course Certificate'}
                  </h3>
                  <p className="text-xs text-white/30 mb-1">Certificate of Completion</p>
                  <p className="text-xs text-white/25 font-mono mb-4">#{c.serial}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#f59e0b]/15 text-[#f59e0b] font-medium">
                      ✓ Verified
                    </span>
                    {c.fileUrl && (
                      <a href={c.fileUrl} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors">
                        <Download className="w-3.5 h-3.5" /> Download
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
}