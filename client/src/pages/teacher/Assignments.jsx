// import { useEffect, useState } from 'react';
// import { courseApi, assignmentApi } from '../../services';

// export default function TeacherAssignments() {
//   const [courses, setCourses] = useState([]);
//   const [courseId, setCourseId] = useState('');
//   const [assignments, setAssignments] = useState([]);
//   const [form, setForm] = useState({ title: '', description: '', maxMarks: 100 });

//   useEffect(() => { courseApi.myOwned().then(r => setCourses(r.data)); }, []);
//   useEffect(() => { if (courseId) assignmentApi.byCourse(courseId).then(r => setAssignments(r.data)); }, [courseId]);

//   const create = async () => {
//     const fd = new FormData();
//     Object.entries({ ...form, course: courseId }).forEach(([k, v]) => fd.append(k, v));
//     const r = await assignmentApi.create(fd);
//     setAssignments([...assignments, r.data]);
//   };

//   return (
//     <div className="container page">
//       <h1>Assignments</h1>
//       <select className="select" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
//         <option value="">Select course</option>
//         {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
//       </select>
//       {courseId && (
//         <>
//           <div className="card" style={{ marginTop: 12 }}>
//             <h3>New assignment</h3>
//             <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
//             <textarea className="textarea" rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ marginTop: 8 }} />
//             <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={create}>Create</button>
//           </div>
//           {assignments.map(a => (
//             <div className="card" key={a._id} style={{ marginTop: 8 }}>
//               <h3>{a.title}</h3><p>{a.description}</p>
//             </div>
//           ))}
//         </>
//       )}
//     </div>
//   );
// }



import { useEffect, useState } from 'react';
import { courseApi, assignmentApi } from '../../services';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  ClipboardList, Plus, ChevronDown, FileText,
  BookOpen, Hash, X, Check, Loader2,
} from 'lucide-react';

export default function TeacherAssignments() {
  // ── ALL EXISTING LOGIC PRESERVED EXACTLY ──
  const [courses,     setCourses]     = useState([]);
  const [courseId,    setCourseId]    = useState('');
  const [assignments, setAssignments] = useState([]);
  const [form,        setForm]        = useState({ title: '', description: '', maxMarks: 100 });
  const [creating,    setCreating]    = useState(false);
  const [showForm,    setShowForm]    = useState(false);

  useEffect(() => {
    courseApi.myOwned().then((r) => setCourses(r.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (courseId)
      assignmentApi.byCourse(courseId).then((r) => setAssignments(r.data || [])).catch(() => {});
    else
      setAssignments([]);
  }, [courseId]);

  const create = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setCreating(true);
    try {
      const fd = new FormData();
      Object.entries({ ...form, course: courseId }).forEach(([k, v]) => fd.append(k, v));
      const r = await assignmentApi.create(fd);
      setAssignments((a) => [r.data, ...a]);
      setForm({ title: '', description: '', maxMarks: 100 });
      setShowForm(false);
      toast.success('Assignment created!');
    } catch {
      toast.error('Failed to create assignment');
    } finally {
      setCreating(false);
    }
  };

  const selectedCourse = courses.find((c) => c._id === courseId);

  return (
    <div className="min-h-screen bg-[#09090F] text-white p-6 lg:p-10 font-['Inter',sans-serif]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">Assignments</h1>
            <p className="text-white/40 text-sm">Create and manage course assignments</p>
          </div>
          {courseId && (
            <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              onClick={() => setShowForm((v) => !v)}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: showForm ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg,#5B7FFF,#7C3AED)' }}>
              {showForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> New Assignment</>}
            </motion.button>
          )}
        </div>

        {/* Course selector */}
        <div className="rounded-[20px] border border-white/[0.08] bg-[#121826] p-5 mb-5">
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">
            <BookOpen className="w-3.5 h-3.5" /> Select Course
          </label>
          <div className="relative">
            <select
              value={courseId}
              onChange={(e) => { setCourseId(e.target.value); setShowForm(false); }}
              className="w-full appearance-none bg-[#09090F] border border-white/[0.08] rounded-xl px-4 py-3 pr-10 text-white text-sm focus:outline-none focus:border-[#5B7FFF]/50 cursor-pointer transition-colors"
            >
              <option value="">Choose a course…</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
          </div>
          {courses.length === 0 && (
            <p className="text-xs text-white/30 mt-2">No courses found. Create a course first.</p>
          )}
        </div>

        <AnimatePresence>
          {courseId && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

              {/* Create form */}
              <AnimatePresence>
                {showForm && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-[20px] border border-[#5B7FFF]/30 bg-[#121826] p-6 mb-5"
                    style={{ boxShadow: '0 0 30px rgba(91,127,255,0.08)' }}
                  >
                    <p className="text-xs uppercase tracking-widest font-semibold text-white/40 mb-5">New Assignment</p>

                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">
                          <FileText className="w-3.5 h-3.5" /> Title
                        </label>
                        <input
                          value={form.title}
                          onChange={(e) => setForm({ ...form, title: e.target.value })}
                          placeholder="e.g. Build a REST API"
                          className="w-full bg-[#09090F] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#5B7FFF]/50 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">
                          <ClipboardList className="w-3.5 h-3.5" /> Description
                        </label>
                        <textarea
                          rows={3}
                          value={form.description}
                          onChange={(e) => setForm({ ...form, description: e.target.value })}
                          placeholder="Describe the assignment requirements…"
                          className="w-full bg-[#09090F] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#5B7FFF]/50 resize-none transition-colors"
                        />
                      </div>

                      <div className="w-40">
                        <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">
                          <Hash className="w-3.5 h-3.5" /> Max Marks
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={form.maxMarks}
                          onChange={(e) => setForm({ ...form, maxMarks: Number(e.target.value) })}
                          className="w-full bg-[#09090F] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#5B7FFF]/50 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-5">
                      <motion.button
                        onClick={create}
                        disabled={creating || !form.title.trim()}
                        whileHover={{ scale: creating ? 1 : 1.03 }}
                        whileTap={{ scale: creating ? 1 : 0.97 }}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all"
                        style={{ background: 'linear-gradient(135deg,#5B7FFF,#7C3AED)' }}
                      >
                        {creating
                          ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</>
                          : <><Check className="w-4 h-4" /> Create Assignment</>
                        }
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Assignment list */}
              <div className="space-y-3">
                {assignments.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-center py-16 rounded-[20px] border border-white/[0.06] bg-[#121826]">
                    <ClipboardList className="w-10 h-10 text-white/15 mx-auto mb-3" />
                    <p className="text-white/40 text-sm font-medium">No assignments yet</p>
                    <p className="text-white/25 text-xs mt-1">Click "New Assignment" to create one</p>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex items-center justify-between px-1 mb-2">
                      <p className="text-xs uppercase tracking-widest font-semibold text-white/30">
                        {assignments.length} Assignment{assignments.length !== 1 ? 's' : ''}
                      </p>
                      {selectedCourse && (
                        <p className="text-xs text-white/30 truncate max-w-[200px]">{selectedCourse.title}</p>
                      )}
                    </div>
                    <AnimatePresence>
                      {assignments.map((a, i) => (
                        <motion.div key={a._id}
                          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.04 * i }}
                          className="rounded-[20px] border border-white/[0.08] bg-[#121826] p-5 hover:border-[#5B7FFF]/30 transition-all group">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                              style={{ background: 'rgba(91,127,255,0.12)' }}>
                              <ClipboardList className="w-5 h-5 text-[#5B7FFF]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-white text-[15px] mb-1 group-hover:text-[#5B7FFF] transition-colors">
                                {a.title}
                              </h3>
                              {a.description && (
                                <p className="text-sm text-white/50 leading-relaxed line-clamp-2">{a.description}</p>
                              )}
                              {a.maxMarks && (
                                <div className="flex items-center gap-1.5 mt-2">
                                  <Hash className="w-3 h-3 text-white/30" />
                                  <span className="text-xs text-white/30">{a.maxMarks} marks</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty — no course selected */}
        {!courseId && courses.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-16 rounded-[20px] border border-white/[0.06] bg-[#121826]">
            <BookOpen className="w-10 h-10 text-white/15 mx-auto mb-3" />
            <p className="text-white/40 text-sm font-medium">Select a course to manage assignments</p>
          </motion.div>
        )}

      </motion.div>
    </div>
  );
}