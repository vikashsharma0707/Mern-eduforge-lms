// import { useEffect, useState } from 'react';
// import { enrollmentApi } from '../../services';
// import { Link } from 'react-router-dom';
// import Empty from '../../components/Empty.jsx';

// export default function MyCourses() {
//   const [items, setItems] = useState([]);
//   useEffect(() => { enrollmentApi.list().then(r => setItems(r.data)); }, []);
//   return (
//     <div className="container page">
//       <h1>My Courses</h1>
//       {items.length === 0 && <Empty title="No enrollments yet" text="Browse the catalog to find your first course." />}
//       <div className="course-grid">
//         {items.map(e => (
//           <Link to={`/learn/${e.course?.slug}`} key={e._id} className="course-card">
//             <div className="course-body">
//               <h3>{e.course?.title}</h3>
//               <p className="muted">{e.progress}% complete</p>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }



import { useEffect, useState } from 'react';
import { enrollmentApi } from '../../services';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, TrendingUp, Play, Search, Filter } from 'lucide-react';

export default function MyCourses() {
  const [items, setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  useEffect(() => {
    enrollmentApi.list()
      .then((r) => setItems(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((e) =>
    e.course?.title?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total:      items.length,
    completed:  items.filter((e) => e.progress === 100).length,
    inProgress: items.filter((e) => e.progress > 0 && e.progress < 100).length,
  };

  return (
    <div className="min-h-screen bg-[#09090F] text-white p-6 lg:p-10 font-['Inter',sans-serif]">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1">My Courses</h1>
        <p className="text-white/40 text-sm">Continue where you left off</p>
      </motion.div>

      {/* Stats Row */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: BookOpen,    label: 'Enrolled',    val: stats.total,      color: '#7C5CFF' },
          { icon: TrendingUp,  label: 'In Progress', val: stats.inProgress, color: '#f97316' },
          { icon: Clock,       label: 'Completed',   val: stats.completed,  color: '#10b981' },
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

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search your courses..."
          className="w-full bg-[#121826] border border-white/[0.08] rounded-[16px] pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#7C5CFF]/50"
        />
      </motion.div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#7C5CFF] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center py-20 rounded-[20px] border border-white/[0.06] bg-[#121826]">
          <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <p className="text-white/50 font-medium">No courses found</p>
          <p className="text-white/25 text-sm mt-1">
            {search ? 'Try a different search term' : 'Browse the catalog to enroll in your first course'}
          </p>
          <Link to="/courses"
            className="inline-block mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg,#FF2E63,#7C5CFF)' }}>
            Browse Courses
          </Link>
        </motion.div>
      )}

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((e, i) => {
          const progress = e.progress || 0;
          const done = progress === 100;
          return (
            <motion.div key={e._id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              whileHover={{ y: -4 }}>
              <Link to={`/learn/${e.course?.slug}`}
                className="block rounded-[20px] border border-white/[0.08] bg-[#121826] overflow-hidden hover:border-[#7C5CFF]/40 transition-all group">
                {/* Thumbnail */}
                <div className="relative h-36 bg-gradient-to-br from-[#7C5CFF]/30 to-[#FF2E63]/20 flex items-center justify-center">
                  {e.course?.thumbnail
                    ? <img src={e.course.thumbnail} alt={e.course.title} className="w-full h-full object-cover" />
                    : <BookOpen className="w-10 h-10 text-white/20" />
                  }
                  {done && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-lg text-[10px] font-bold text-white bg-[#10b981]">
                      ✓ Done
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* Body */}
                <div className="p-4">
                  <h3 className="font-semibold text-white text-[15px] leading-tight mb-1 line-clamp-2">
                    {e.course?.title || 'Untitled Course'}
                  </h3>
                  <p className="text-xs text-white/30 mb-3">
                    {e.course?.teacher?.name || 'Instructor'}
                  </p>

                  {/* Progress bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-white/40">Progress</span>
                      <span className={done ? 'text-[#10b981]' : 'text-white/60'}>{progress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <motion.div className="h-full rounded-full"
                        style={{ background: done ? '#10b981' : 'linear-gradient(90deg,#7C5CFF,#FF2E63)' }}
                        initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}