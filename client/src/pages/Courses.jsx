// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchCourses } from '../redux/slices/courseSlice';
// import CourseCard from '../components/CourseCard.jsx';

// export default function Courses() {
//   const dispatch = useDispatch();
//   const { items, loading } = useSelector((s) => s.courses);
//   const [q, setQ] = useState('');
//   const [level, setLevel] = useState('');

//   useEffect(() => {
//     dispatch(fetchCourses({ q, level, published: 'true' }));
//   }, [dispatch, q, level]);

//   return (
//     <div className="container page">
//       <h1>All Courses</h1>
//       <div className="field-row">
//         <input className="input" placeholder="Search courses…" value={q} onChange={(e) => setQ(e.target.value)} />
//         <select className="select" value={level} onChange={(e) => setLevel(e.target.value)}>
//           <option value="">All levels</option>
//           <option value="beginner">Beginner</option>
//           <option value="intermediate">Intermediate</option>
//           <option value="advanced">Advanced</option>
//         </select>
//       </div>
//       <div style={{ height: 18 }} />
//       {loading ? <p className="muted">Loading…</p> : (
//         <div className="course-grid">
//           {items.map((c) => <CourseCard key={c._id} course={c} />)}
//         </div>
//       )}
//     </div>
//   );
// }



import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../redux/slices/courseSlice';
import CourseCard from '../components/CourseCard.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronDown, Zap, TrendingUp, Clock } from 'lucide-react';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

// Loading Skeleton
const CourseSkeleton = () => (
  <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl h-[300px] animate-pulse" />
);

// Empty State
const EmptyState = ({ searchQuery, level }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="col-span-full flex flex-col items-center justify-center py-20"
  >
    <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-4">
      <Search className="w-8 h-8 text-slate-400" />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
    <p className="text-slate-400 text-center max-w-md">
      {searchQuery || level 
        ? `We couldn't find any courses matching "${searchQuery || 'your filters'}". Try adjusting your search or filters.`
        : 'Start exploring our course library by searching or applying filters.'}
    </p>
  </motion.div>
);

// Header Section
const HeaderSection = ({ searchQuery, level, onSearchChange, onLevelChange }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-[#0a0e27] via-[#0f1535] to-[#1a1f3a] border-b border-white/10 px-6 lg:px-8 py-16 lg:py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-3xl"
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4">
              <h1 className="text-4xl lg:text-5xl font-black text-white mb-2">
                Explore <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Courses</span>
              </h1>
              <p className="text-slate-400 text-lg">Discover expert-led programs from top instructors</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#0a0e27] border-b border-white/10 px-6 lg:px-8 py-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            {/* Search Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search courses by title, instructor, or topic…"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Mobile: Filter Toggle */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-lg px-4 py-3 text-white font-medium flex items-center justify-between hover:border-white/20 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  <span>Filter by Level</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Desktop: Filter Row */}
            <div className="hidden lg:block">
              <div className="flex gap-4">
                <select
                  value={level}
                  onChange={(e) => onLevelChange(e.target.value)}
                  className="bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  <option value="">All levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            {/* Mobile: Filter Panel */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="lg:hidden space-y-3 pt-4 border-t border-white/10"
                >
                  <select
                    value={level}
                    onChange={(e) => {
                      onLevelChange(e.target.value);
                      setIsFilterOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                  >
                    <option value="">All levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Active Filters Badge */}
          {(searchQuery || level) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex gap-2 pt-4 flex-wrap"
            >
              {searchQuery && (
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-1.5">
                  <span className="text-sm text-blue-400">Search: "{searchQuery}"</span>
                  <button
                    onClick={() => onSearchChange('')}
                    className="hover:text-blue-300 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              {level && (
                <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-lg px-3 py-1.5">
                  <span className="text-sm text-purple-400 capitalize">{level} level</span>
                  <button
                    onClick={() => onLevelChange('')}
                    className="hover:text-purple-300 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <button
                onClick={() => {
                  onSearchChange('');
                  onLevelChange('');
                }}
                className="text-sm text-slate-400 hover:text-slate-300 transition underline"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

// Results Header
const ResultsHeader = ({ itemCount, loading, searchQuery, level }) => {
  if (loading) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex items-center justify-between mb-8"
    >
      <div>
        <h2 className="text-lg font-semibold text-white">
          {itemCount === 0 ? 'No results' : `${itemCount} course${itemCount !== 1 ? 's' : ''} found`}
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          {searchQuery || level
            ? 'Refine your search to explore more options'
            : 'Browse and find the perfect course for you'}
        </p>
      </div>

      {/* Sort (future enhancement) */}
      <div className="hidden lg:block">
        <select className="bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer">
          <option value="popular">Most Popular</option>
          <option value="newest">Newest</option>
          <option value="rating">Top Rated</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>
    </motion.div>
  );
};

// Main Courses Component
export default function Courses() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.courses);
  const [q, setQ] = useState('');
  const [level, setLevel] = useState('');

  useEffect(() => {
    dispatch(fetchCourses({ q, level, published: 'true' }));
  }, [dispatch, q, level]);

  return (
    <div className="min-h-screen bg-[#0a0e27]">
      {/* Header */}
      <HeaderSection
        searchQuery={q}
        level={level}
        onSearchChange={setQ}
        onLevelChange={setLevel}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Loading State */}
        {loading ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[...Array(8)].map((_, i) => (
              <motion.div key={i} variants={itemVariants}>
                <CourseSkeleton />
              </motion.div>
            ))}
          </motion.div>
        ) : items.length === 0 ? (
          <>
            <ResultsHeader itemCount={0} loading={false} searchQuery={q} level={level} />
            <EmptyState searchQuery={q} level={level} />
          </>
        ) : (
          <>
            <ResultsHeader itemCount={items.length} loading={false} searchQuery={q} level={level} />

            {/* Course Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <AnimatePresence mode="wait">
                {items.map((course, i) => (
                  <motion.div
                    key={course._id}
                    variants={itemVariants}
                    exit={{ opacity: 0, y: 20 }}
                    layout
                  >
                    <CourseCard course={course} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}

        {/* No Results Message */}
        {!loading && items.length === 0 && (q || level) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-12 pt-12 border-t border-white/10 text-center"
          >
            <h3 className="text-lg font-semibold text-white mb-2">Tips for better search:</h3>
            <ul className="text-slate-400 space-y-1">
              <li>• Try different keywords or course names</li>
              <li>• Check your spelling</li>
              <li>• Try less specific search terms</li>
              <li>• Browse all levels to see available options</li>
            </ul>
          </motion.div>
        )}
      </div>

      {/* Footer CTA */}
      {!loading && items.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-b from-transparent to-[#1a1f3a] border-t border-white/10 px-6 lg:px-8 py-16"
        >
          <div className="max-w-7xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Can't find what you're looking for?
            </h3>
            <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
              Our AI tutor can help you learn any topic on demand. Get personalized explanations, create custom learning paths, and master new skills instantly.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-8 py-4 rounded-lg font-semibold transition-all hover:shadow-xl hover:shadow-blue-500/20">
              Start with AI Tutor
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}