// import { useEffect, useState } from 'react';
// import { courseApi } from '../../services';
// import { Link } from 'react-router-dom';

// export default function TeacherCourseList() {
//   const [items, setItems] = useState([]);
//   useEffect(() => { courseApi.myOwned().then(r => setItems(r.data)); }, []);
//   const remove = async (id) => { if (!confirm('Delete?')) return; await courseApi.remove(id); setItems(items.filter(c => c._id !== id)); };
//   return (
//     <div className="container page">
//       <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//         <h1>My Courses</h1>
//         <Link to="/teacher/courses/new" className="btn btn-primary">+ New course</Link>
//       </div>
//       <table className="table">
//         <thead><tr><th>Title</th><th>Level</th><th>Price</th><th>Students</th><th>Published</th><th></th></tr></thead>
//         <tbody>
//           {items.map(c => (
//             <tr key={c._id}>
//               <td>{c.title}</td><td>{c.level}</td><td>₹{c.price}</td><td>{c.enrollmentCount}</td>
//               <td>{c.isPublished ? '✓' : '—'}</td>
//               <td>
//                 <Link to={`/teacher/courses/${c._id}/edit`} className="btn btn-ghost">Edit</Link>
//                 <button className="btn btn-danger" style={{ marginLeft: 6 }} onClick={() => remove(c._id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { courseApi } from '../../services';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Plus, Edit, Trash2, BookOpen, Users, TrendingUp, Eye, EyeOff, AlertCircle, BarChart3, Award } from 'lucide-react';

export default function TeacherCourseList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const r = await courseApi.myOwned();
      setItems(r.data);
    } catch (err) {
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    try {
      await courseApi.remove(id);
      setItems(items.filter(c => c._id !== id));
      setDeleteModal(null);
      toast.success('✓ Course deleted');
    } catch (err) {
      toast.error('Failed to delete course');
    }
  };

  const stats = {
    total: items.length,
    published: items.filter(c => c.isPublished).length,
    draft: items.filter(c => !c.isPublished).length,
    totalStudents: items.reduce((sum, c) => sum + (c.enrollmentCount || 0), 0),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
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
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-white mb-2">
                My <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Courses</span>
              </h1>
              <p className="text-slate-400">Manage your courses and track student progress</p>
            </div>
            <Link
              to="/teacher/courses/new"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all hover:shadow-xl hover:shadow-green-500/20"
            >
              <Plus className="w-5 h-5" />
              <span>New Course</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      {!loading && items.length > 0 && (
        <div className="border-b border-white/10 bg-gradient-to-b from-[#0a0e27] to-transparent px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {[
                { label: 'Total Courses', value: stats.total, icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
                { label: 'Published', value: stats.published, icon: Eye, color: 'from-green-500 to-emerald-500' },
                { label: 'Drafts', value: stats.draft, icon: EyeOff, color: 'from-orange-500 to-red-500' },
                { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'from-purple-500 to-pink-500' },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div key={i} variants={itemVariants}>
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-lg p-4">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-2xl lg:text-3xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400">Loading your courses...</p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 mb-4">
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No courses yet</h2>
            <p className="text-slate-400 mb-6">Start by creating your first course and share your expertise with students.</p>
            <Link
              to="/teacher/courses/new"
              className="inline-flex bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-semibold gap-2 transition-all hover:shadow-xl hover:shadow-blue-500/20"
            >
              <Plus className="w-5 h-5" />
              Create First Course
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {items.map((course, idx) => (
              <motion.div
                key={course._id}
                variants={itemVariants}
                className="group bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 rounded-lg overflow-hidden transition-all"
              >
                <div className="p-4 lg:p-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: Course Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-sm font-bold text-blue-400">
                          {idx + 1}
                        </div>
                        <h3 className="text-lg font-semibold text-white truncate group-hover:text-blue-400 transition">
                          {course.title}
                        </h3>
                        {course.isPublished ? (
                          <span className="inline-flex items-center gap-1 bg-green-500/10 border border-green-500/20 rounded px-2 py-1">
                            <Eye className="w-3 h-3 text-green-400" />
                            <span className="text-xs font-semibold text-green-400">Live</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 rounded px-2 py-1">
                            <EyeOff className="w-3 h-3 text-yellow-400" />
                            <span className="text-xs font-semibold text-yellow-400">Draft</span>
                          </span>
                        )}
                      </div>

                      {/* Stats Row */}
                      <div className="flex items-center gap-6 text-sm text-slate-400 mt-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-blue-400" />
                          <span className="capitalize">{course.level}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-purple-400" />
                          <span>{course.enrollmentCount || 0} students</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-orange-400" />
                          <span>₹{course.price}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-pink-400" />
                          <span>{course.lessonCount || 0} lessons</span>
                        </div>
                      </div>

                      {/* Description */}
                      {course.description && (
                        <p className="text-sm text-slate-400 mt-3 line-clamp-2">
                          {course.description}
                        </p>
                      )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex gap-2 ml-4 flex-shrink-0">
                      <Link
                        to={`/teacher/courses/${course._id}/edit`}
                        className="bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 p-2.5 rounded-lg transition-all"
                        title="Edit course"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => setDeleteModal(course._id)}
                        className="bg-red-500/20 hover:bg-red-500/40 text-red-400 p-2.5 rounded-lg transition-all"
                        title="Delete course"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-6 max-w-sm w-full"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/20 mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white text-center mb-2">
                Delete Course?
              </h2>
              <p className="text-slate-400 text-center mb-6">
                This action cannot be undone. All lessons and student enrollments will be deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    remove(deleteModal);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}