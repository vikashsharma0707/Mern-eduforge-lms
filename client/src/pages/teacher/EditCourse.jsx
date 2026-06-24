// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { courseApi, lessonApi } from '../../services';
// import { toast } from 'react-toastify';

// export default function EditCourse() {
//   const { id } = useParams();
//   const [course, setCourse] = useState(null);
//   const [lessons, setLessons] = useState([]);
//   const [lesson, setLesson] = useState({ title: '', content: '', durationMinutes: 10 });
//   const [file, setFile] = useState(null);

//   useEffect(() => {
//     (async () => {
//       const all = await courseApi.myOwned();
//       const c = all.data.find(x => x._id === id);
//       setCourse(c);
//       const l = await lessonApi.byCourse(id);
//       setLessons(l.data);
//     })();
//   }, [id]);

//   const saveCourse = async () => {
//     await courseApi.update(id, course);
//     toast.success('Course updated');
//   };

//   const addLesson = async () => {
//     const fd = new FormData();
//     Object.entries(lesson).forEach(([k, v]) => fd.append(k, v));
//     fd.append('course', id);
//     if (file) fd.append('video', file);
//     const r = await lessonApi.create(fd);
//     setLessons([...lessons, r.data]);
//     setLesson({ title: '', content: '', durationMinutes: 10 });
//     setFile(null);
//   };

//   const removeLesson = async (lid) => {
//     await lessonApi.remove(lid);
//     setLessons(lessons.filter(l => l._id !== lid));
//   };

//   if (!course) return <div className="container page">Loading…</div>;

//   return (
//     <div className="container page">
//       <h1>Edit: {course.title}</h1>
//       <div className="card">
//         <label className="label">Title</label>
//         <input className="input" value={course.title} onChange={(e) => setCourse({ ...course, title: e.target.value })} />
//         <label className="label">Description</label>
//         <textarea className="textarea" rows={4} value={course.description || ''} onChange={(e) => setCourse({ ...course, description: e.target.value })} />
//         <label className="label"><input type="checkbox" checked={course.isPublished} onChange={(e) => setCourse({ ...course, isPublished: e.target.checked })} /> Published</label>
//         <div style={{ height: 12 }} />
//         <button className="btn btn-primary" onClick={saveCourse}>Save course</button>
//       </div>

//       <h2 style={{ marginTop: 24 }}>Lessons</h2>
//       {lessons.map((l, i) => (
//         <div className="card" key={l._id} style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
//           <span>{i + 1}. {l.title}</span>
//           <button className="btn btn-danger" onClick={() => removeLesson(l._id)}>Delete</button>
//         </div>
//       ))}
//       <div className="card">
//         <h3>Add lesson</h3>
//         <input className="input" placeholder="Title" value={lesson.title} onChange={(e) => setLesson({ ...lesson, title: e.target.value })} />
//         <textarea className="textarea" rows={3} placeholder="Notes / content" value={lesson.content} onChange={(e) => setLesson({ ...lesson, content: e.target.value })} style={{ marginTop: 8 }} />
//         <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} style={{ marginTop: 8 }} />
//         <div style={{ height: 12 }} />
//         <button className="btn btn-primary" onClick={addLesson}>Add lesson</button>
//       </div>
//     </div>
//   );
// }



import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { courseApi, lessonApi } from '../../services';
import { toast } from 'react-toastify';
import { ChevronRight, Trash2, Plus, BookOpen, Clock, FileText, Video, AlertCircle, Check, X } from 'lucide-react';

export default function EditCourse() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [lesson, setLesson] = useState({ title: '', content: '', durationMinutes: 10 });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingCourse, setSavingCourse] = useState(false);
  const [addingLesson, setAddingLesson] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const all = await courseApi.myOwned();
      const c = all.data.find(x => x._id === id);
      setCourse(c);
      const l = await lessonApi.byCourse(id);
      setLessons(l.data);
    } catch (err) {
      toast.error('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const saveCourse = async () => {
    try {
      setSavingCourse(true);
      await courseApi.update(id, course);
      toast.success('✓ Course updated successfully');
    } catch (err) {
      toast.error('Failed to update course');
    } finally {
      setSavingCourse(false);
    }
  };

  const validateLesson = () => {
    const newErrors = {};
    if (!lesson.title.trim()) newErrors.title = 'Lesson title is required';
    if (lesson.title.length < 3) newErrors.title = 'Title must be at least 3 characters';
    if (lesson.durationMinutes < 1) newErrors.duration = 'Duration must be at least 1 minute';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addLesson = async () => {
    if (!validateLesson()) return;
    
    try {
      setAddingLesson(true);
      const fd = new FormData();
      Object.entries(lesson).forEach(([k, v]) => fd.append(k, v));
      fd.append('course', id);
      if (file) fd.append('video', file);
      const r = await lessonApi.create(fd);
      setLessons([...lessons, r.data]);
      setLesson({ title: '', content: '', durationMinutes: 10 });
      setFile(null);
      setShowAddLesson(false);
      toast.success('✓ Lesson added successfully');
    } catch (err) {
      toast.error('Failed to add lesson');
    } finally {
      setAddingLesson(false);
    }
  };

  const removeLesson = async (lid) => {
    if (!confirm('Delete this lesson? This cannot be undone.')) return;
    try {
      await lessonApi.remove(lid);
      setLessons(lessons.filter(l => l._id !== lid));
      toast.success('✓ Lesson deleted');
    } catch (err) {
      toast.error('Failed to delete lesson');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] to-[#1a1f3a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] to-[#1a1f3a] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-slate-400">Course not found</p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] to-[#1a1f3a]">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0a0e27] px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-black text-white mb-2">
              Edit: <span className="text-blue-400">{course.title}</span>
            </h1>
            <p className="text-slate-400">Manage course content and lessons</p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Course Details Section */}
          <motion.div variants={itemVariants}>
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-400" />
                Course Details
              </h2>

              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Course Title
                  </label>
                  <input
                    type="text"
                    value={course.title}
                    onChange={(e) => setCourse({ ...course, title: e.target.value })}
                    className="w-full bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Description
                  </label>
                  <textarea
                    rows={5}
                    value={course.description || ''}
                    onChange={(e) => setCourse({ ...course, description: e.target.value })}
                    className="w-full bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  />
                </div>

                {/* Status */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={course.isPublished}
                      onChange={(e) => setCourse({ ...course, isPublished: e.target.checked })}
                      className="w-5 h-5 rounded accent-blue-500"
                    />
                    <span className="text-sm font-medium text-white">
                      {course.isPublished ? '✓ Published' : '○ Draft'}
                    </span>
                  </label>

                  <div className="flex-1" />

                  <button
                    onClick={saveCourse}
                    disabled={savingCourse}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all"
                  >
                    {savingCourse ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Save Course
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Lessons Section */}
          <motion.div variants={itemVariants}>
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Video className="w-6 h-6 text-purple-400" />
                  Lessons ({lessons.length})
                </h2>
                <button
                  onClick={() => setShowAddLesson(!showAddLesson)}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Lesson
                </button>
              </div>

              {/* Lessons List */}
              <AnimatePresence mode="popLayout">
                {lessons.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-dashed border-white/20 rounded-xl p-8 text-center"
                  >
                    <Video className="w-12 h-12 text-slate-500 mx-auto mb-4 opacity-50" />
                    <p className="text-slate-400 mb-4">No lessons yet. Start by adding your first lesson.</p>
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    {lessons.map((l, i) => (
                      <motion.div
                        key={l._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="group bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 rounded-lg p-4 flex items-center justify-between transition-all"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-sm font-semibold text-purple-400">
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-white truncate">{l.title}</h3>
                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                              {l.durationMinutes && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {l.durationMinutes} min
                                </span>
                              )}
                              {l.content && (
                                <span className="flex items-center gap-1">
                                  <FileText className="w-3 h-3" />
                                  Has notes
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => removeLesson(l._id)}
                          className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/20 hover:bg-red-500/40 text-red-400 p-2 rounded-lg transition-all"
                          title="Delete lesson"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Add Lesson Form */}
          <AnimatePresence>
            {showAddLesson && (
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6 lg:p-8"
              >
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-green-400" />
                  Add New Lesson
                </h3>

                <div className="space-y-5">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Lesson Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Introduction to State Management"
                      value={lesson.title}
                      onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
                      className="w-full bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                    {errors.title && (
                      <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Notes / Content (Optional)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Add lesson notes, key points, or additional resources..."
                      value={lesson.content}
                      onChange={(e) => setLesson({ ...lesson, content: e.target.value })}
                      className="w-full bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={lesson.durationMinutes}
                      onChange={(e) => setLesson({ ...lesson, durationMinutes: Number(e.target.value) })}
                      className="w-full bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                    {errors.duration && (
                      <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.duration}
                      </p>
                    )}
                  </div>

                  {/* Video */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Video (Optional)
                    </label>
                    <label className="block">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="hidden"
                      />
                      <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center cursor-pointer hover:border-white/40 transition-all">
                        <Video className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-400">{file ? file.name : 'Click to upload video'}</p>
                        <p className="text-xs text-slate-500 mt-1">MP4, WebM (max 500MB)</p>
                      </div>
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-white/10">
                    <button
                      onClick={addLesson}
                      disabled={addingLesson}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-slate-600 disabled:to-slate-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                    >
                      {addingLesson ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Add Lesson
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setShowAddLesson(false);
                        setLesson({ title: '', content: '', durationMinutes: 10 });
                        setFile(null);
                        setErrors({});
                      }}
                      className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}