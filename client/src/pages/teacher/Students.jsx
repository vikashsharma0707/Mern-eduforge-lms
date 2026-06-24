// // import { useEffect, useState } from 'react';
// // import { courseApi } from '../../services';
// // import api from '../../services/api';

// // export default function TeacherStudents() {
// //   const [enrolls, setEnrolls] = useState([]);
// //   useEffect(() => {
// //     (async () => {
// //       const cs = await courseApi.myOwned();
// //       const all = [];
// //       for (const c of cs.data) {
// //         const r = await api.get('/enrollments');
// //         r.data.filter(e => e.course?._id === c._id).forEach(e => all.push({ ...e, courseTitle: c.title }));
// //       }
// //       setEnrolls(all);
// //     })();
// //   }, []);
// //   return (
// //     <div className="container page">
// //       <h1>Students</h1>
// //       <table className="table">
// //         <thead><tr><th>Student</th><th>Email</th><th>Course</th><th>Progress</th></tr></thead>
// //         <tbody>{enrolls.map(e => (
// //           <tr key={e._id}><td>{e.student?.name}</td><td>{e.student?.email}</td><td>{e.courseTitle}</td><td>{e.progress}%</td></tr>
// //         ))}</tbody>
// //       </table>
// //     </div>
// //   );
// // }



// import { useEffect, useState } from 'react';
// import { courseApi } from '../../services';
// import api from '../../services/api';
// import { toast } from 'react-toastify';

// export default function TeacherStudents() {
//   const [enrolls, setEnrolls] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTeacherStudents = async () => {
//       try {
//         setLoading(true);

//         const coursesRes = await courseApi.myOwned();
//         const teacherCourses = coursesRes.data || [];

//         console.log("Teacher Courses:", teacherCourses);

//         if (teacherCourses.length === 0) {
//           setEnrolls([]);
//           return;
//         }

//         // ✅ Better Approach: Try teacher-specific endpoint first
//         let allEnrollments = [];

//         try {
//           // Option 1: Try teacher-specific API (Recommended)
//           const teacherEnrollRes = await api.get('/enrollments/teacher');
//           allEnrollments = teacherEnrollRes.data || [];
//         } catch (e) {
//           console.log("Teacher-specific endpoint not available, trying general...");

//           // Option 2: Fallback to general endpoint
//           const enrollRes = await api.get('/enrollments');
//           allEnrollments = enrollRes.data || [];
//         }

//         console.log("Total Enrollments received:", allEnrollments.length);

//         // Combine data
//         const result = [];
//         for (const course of teacherCourses) {
//           const courseEnrolls = allEnrollments.filter(e => {
//             const enrollCourseId = e.course?._id || e.course;
//             return enrollCourseId === course._id;
//           });

//           courseEnrolls.forEach(e => {
//             result.push({
//               ...e,
//               courseTitle: course.title
//             });
//           });
//         }

//         console.log("Final Students Found:", result.length);
//         setEnrolls(result);

//       } catch (err) {
//         console.error(err);
//         toast.error('Failed to load students');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTeacherStudents();
//   }, []);

//   return (
//     <div className="container page">
//       <h1>My Students</h1>

//       {loading && <p>Loading your students...</p>}

//       {!loading && enrolls.length === 0 && (
//         <p className="muted">No students enrolled in your courses yet.</p>
//       )}

//       {enrolls.length > 0 && (
//         <table className="table">
//           <thead>
//             <tr>
//               <th>Student</th>
//               <th>Email</th>
//               <th>Course</th>
//               <th>Progress</th>
//             </tr>
//           </thead>
//           <tbody>
//             {enrolls.map((e) => (
//               <tr key={e._id}>
//                 <td>{e.student?.name || 'N/A'}</td>
//                 <td>{e.student?.email || 'N/A'}</td>
//                 <td>{e.courseTitle}</td>
//                 <td>{e.progress || 0}%</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }



import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { courseApi } from '../../services';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { Users, BarChart3, TrendingUp, Search, Filter, Download, Mail, Phone } from 'lucide-react';

export default function TeacherStudents() {
  const [enrolls, setEnrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const coursesRes = await courseApi.myOwned();
      const teacherCourses = coursesRes.data || [];
      setCourses(teacherCourses);

      if (teacherCourses.length === 0) {
        setEnrolls([]);
        return;
      }

      let allEnrollments = [];

      try {
        const teacherEnrollRes = await api.get('/enrollments/teacher');
        allEnrollments = teacherEnrollRes.data || [];
      } catch (e) {
        const enrollRes = await api.get('/enrollments');
        allEnrollments = enrollRes.data || [];
      }

      const result = [];
      for (const course of teacherCourses) {
        const courseEnrolls = allEnrollments.filter(e => {
          const enrollCourseId = e.course?._id || e.course;
          return enrollCourseId === course._id;
        });

        courseEnrolls.forEach(e => {
          result.push({
            ...e,
            courseTitle: course.title,
            courseId: course._id
          });
        });
      }

      setEnrolls(result);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  // Filters
  const filteredEnrolls = enrolls.filter(e => {
    const matchSearch = !searchQuery || 
      e.student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.student?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchCourse = !selectedCourse || e.courseId === selectedCourse;
    
    return matchSearch && matchCourse;
  });

  // Stats
  const stats = {
    totalStudents: enrolls.length,
    totalCourses: courses.length,
    avgProgress: enrolls.length > 0 ? Math.round(enrolls.reduce((sum, e) => sum + (e.progress || 0), 0) / enrolls.length) : 0,
    completedCourses: enrolls.filter(e => e.progress === 100).length
  };

  // Group by course
  const groupedByCourseByCourse = courses.map(course => ({
    ...course,
    students: enrolls.filter(e => e.courseId === course._id)
  }));

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
          >
            <h1 className="text-4xl lg:text-5xl font-black text-white mb-2">
              My <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Students</span>
            </h1>
            <p className="text-slate-400">Track student progress and engagement across all your courses</p>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      {!loading && enrolls.length > 0 && (
        <div className="border-b border-white/10 bg-gradient-to-b from-[#0a0e27] to-transparent px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {[
                { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'from-blue-500 to-cyan-500' },
                { label: 'Courses Teaching', value: stats.totalCourses, icon: BarChart3, color: 'from-purple-500 to-pink-500' },
                { label: 'Avg Progress', value: stats.avgProgress + '%', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
                { label: 'Completed', value: stats.completedCourses, icon: Users, color: 'from-orange-500 to-red-500' },
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

      {/* Filters */}
      <div className="border-b border-white/10 bg-[#0a0e27] px-6 lg:px-8 py-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex gap-3 flex-wrap"
          >
            {/* Search */}
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search students by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
              />
            </div>

            {/* Filter by Course */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500/50 text-sm cursor-pointer"
              >
                <option value="">All courses</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.title} ({enrolls.filter(e => e.courseId === course._id).length})
                  </option>
                ))}
              </select>
            </div>

            {/* Export (Future) */}
            <button className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-3 py-2 rounded-lg flex items-center gap-2 transition-all text-sm">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400">Loading your students...</p>
            </div>
          </div>
        ) : enrolls.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 mb-4">
              <Users className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No students yet</h2>
            <p className="text-slate-400">
              Students will appear here once they enroll in your courses.
            </p>
          </motion.div>
        ) : filteredEnrolls.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Users className="w-12 h-12 text-slate-500 mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-semibold text-white mb-2">No students found</h2>
            <p className="text-slate-400">Try adjusting your search or filter criteria</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {filteredEnrolls.map((enrollment) => (
              <motion.div
                key={enrollment._id}
                variants={itemVariants}
                className="group bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 rounded-lg p-4 lg:p-6 transition-all"
              >
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  {/* Student Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-lg font-bold text-blue-400 flex-shrink-0">
                        {enrollment.student?.name?.[0]?.toUpperCase() || '?'}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white">
                          {enrollment.student?.name || 'Unknown Student'}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-slate-400 mt-1 flex-wrap">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            <a href={`mailto:${enrollment.student?.email}`} className="hover:text-blue-400 transition">
                              {enrollment.student?.email || 'N/A'}
                            </a>
                          </div>
                          <div className="text-slate-500">•</div>
                          <span className="font-medium text-white">{enrollment.courseTitle}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full lg:w-48 flex-shrink-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white">Progress</span>
                      <span className="text-sm font-bold text-blue-400">{enrollment.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${enrollment.progress || 0}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                      />
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex-shrink-0">
                    {(enrollment.progress || 0) === 100 ? (
                      <span className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        <span className="text-xs font-semibold text-green-400">Completed</span>
                      </span>
                    ) : (enrollment.progress || 0) >= 50 ? (
                      <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        <span className="text-xs font-semibold text-blue-400">In Progress</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 bg-slate-500/10 border border-slate-500/20 rounded-full px-3 py-1">
                        <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                        <span className="text-xs font-semibold text-slate-400">Just Started</span>
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Results Info */}
        {filteredEnrolls.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center text-sm text-slate-400"
          >
            Showing <span className="font-semibold text-white">{filteredEnrolls.length}</span> of <span className="font-semibold text-white">{enrolls.length}</span> students
          </motion.div>
        )}
      </div>
    </div>
  );
}