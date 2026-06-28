// import { useEffect, useState } from 'react';
// import { enrollmentApi, assignmentApi } from '../../services';

// export default function StudentAssignments() {
//   const [list, setList] = useState([]);
//   useEffect(() => {
//     enrollmentApi.list().then(async r => {
//       const all = [];
//       for (const e of r.data) {
//         const a = await assignmentApi.byCourse(e.course._id);
//         a.data.forEach(x => all.push({ ...x, courseTitle: e.course.title }));
//       }
//       setList(all);
//     });
//   }, []);
//   const [text, setText] = useState({});
//   const submit = async (id) => {
//     const fd = new FormData(); fd.append('text', text[id] || '');
//     await assignmentApi.submit(id, fd);
//     alert('Submitted');
//   };
//   return (
//     <div className="container page">
//       <h1>Assignments</h1>
//       {list.map(a => (
//         <div className="card" key={a._id} style={{ marginBottom: 12 }}>
//           <h3>{a.title} <small className="muted">({a.courseTitle})</small></h3>
//           <p>{a.description}</p>
//           <textarea className="textarea" rows={3} placeholder="Type your answer…" onChange={(e) => setText({ ...text, [a._id]: e.target.value })} />
//           <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => submit(a._id)}>Submit</button>
//         </div>
//       ))}
//     </div>
//   );
// }





import { useEffect, useState } from 'react';
import { enrollmentApi, assignmentApi } from '../../services';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, CheckCircle2, Send, ChevronDown, ChevronUp, Calendar } from 'lucide-react';

export default function StudentAssignments() {
  const [list, setList]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText]       = useState({});
  const [submitted, setSubmitted] = useState({});
  const [expanded, setExpanded]   = useState({});

  useEffect(() => {
    const fetch = async () => {
      try {
        const r = await enrollmentApi.list();
        const all = [];
        for (const e of r.data || []) {
          if (!e.course?._id) continue;
          const a = await assignmentApi.byCourse(e.course._id);
          (a.data || []).forEach((x) => all.push({ ...x, courseTitle: e.course.title }));
        }
        setList(all);
      } catch {
        toast.error('Failed to load assignments');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const submit = async (id) => {
    try {
      const fd = new FormData();
      fd.append('text', text[id] || '');
      await assignmentApi.submit(id, fd);
      setSubmitted((s) => ({ ...s, [id]: true }));
      toast.success('Assignment submitted!');
    } catch {
      toast.error('Failed to submit');
    }
  };

  const toggle = (id) => setExpanded((e) => ({ ...e, [id]: !e[id] }));

  return (
    <div className="min-h-screen bg-[#09090F] text-white p-6 lg:p-10 font-['Inter',sans-serif]">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1">Assignments</h1>
        <p className="text-white/40 text-sm">Submit your work for enrolled courses</p>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex gap-4 mb-8 flex-wrap">
        {[
          { label: 'Total',     val: list.length,                                  color: '#7C5CFF' },
          { label: 'Submitted', val: Object.keys(submitted).length,                color: '#10b981' },
          { label: 'Pending',   val: list.length - Object.keys(submitted).length,  color: '#f97316' },
        ].map((s) => (
          <div key={s.label} className="rounded-[16px] border border-white/[0.08] bg-[#121826] px-5 py-3 flex items-center gap-3">
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.val}</p>
            <p className="text-sm text-white/40">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#7C5CFF] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && list.length === 0 && (
        <div className="text-center py-20 rounded-[20px] border border-white/[0.06] bg-[#121826]">
          <ClipboardList className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <p className="text-white/50 font-medium">No assignments yet</p>
          <p className="text-white/25 text-sm mt-1">Assignments from your enrolled courses will appear here</p>
        </div>
      )}

      <div className="space-y-4">
        {list.map((a, i) => {
          const done = submitted[a._id];
          const open = expanded[a._id];
          return (
            <motion.div key={a._id}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className={`rounded-[20px] border bg-[#121826] overflow-hidden transition-all ${
                done ? 'border-[#10b981]/30' : 'border-white/[0.08] hover:border-[#7C5CFF]/30'
              }`}>

              {/* Assignment header — click to expand */}
              <button onClick={() => toggle(a._id)}
                className="w-full flex items-center gap-4 p-5 text-left">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${done ? 'bg-[#10b981]/15' : 'bg-[#7C5CFF]/15'}`}>
                  {done
                    ? <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                    : <ClipboardList className="w-5 h-5 text-[#7C5CFF]" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-[15px] truncate">{a.title}</h3>
                  <p className="text-sm text-white/40 mt-0.5">{a.courseTitle}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {done && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-[#10b981]/15 text-[#10b981] font-medium">
                      Submitted
                    </span>
                  )}
                  {open ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
                </div>
              </button>

              {/* Expanded body */}
              <AnimatePresence>
                {open && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="px-5 pb-5 border-t border-white/[0.06] pt-5">
                      {a.description && (
                        <p className="text-[14px] text-white/60 leading-relaxed mb-5">{a.description}</p>
                      )}
                      {!done ? (
                        <>
                          <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">
                            Your answer
                          </label>
                          <textarea
                            rows={4}
                            value={text[a._id] || ''}
                            onChange={(e) => setText((t) => ({ ...t, [a._id]: e.target.value }))}
                            placeholder="Write your answer here..."
                            className="w-full bg-[#09090F] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#7C5CFF]/50 resize-none mb-4"
                          />
                          <button onClick={() => submit(a._id)}
                            disabled={!text[a._id]?.trim()}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40 transition-all"
                            style={{ background: 'linear-gradient(135deg,#FF2E63,#7C5CFF)' }}>
                            <Send className="w-4 h-4" /> Submit Assignment
                          </button>
                        </>
                      ) : (
                        <div className="rounded-xl bg-[#10b981]/10 border border-[#10b981]/20 p-4 flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-[#10b981] shrink-0" />
                          <p className="text-sm text-[#10b981]">Assignment submitted successfully. Awaiting review.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}