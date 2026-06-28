// // import { useEffect, useState } from 'react';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { fetchCourses } from '../redux/slices/courseSlice';
// // import CourseCard from '../components/CourseCard.jsx';

// // export default function Courses() {
// //   const dispatch = useDispatch();
// //   const { items, loading } = useSelector((s) => s.courses);
// //   const [q, setQ] = useState('');
// //   const [level, setLevel] = useState('');

// //   useEffect(() => {
// //     dispatch(fetchCourses({ q, level, published: 'true' }));
// //   }, [dispatch, q, level]);

// //   return (
// //     <div className="container page">
// //       <h1>All Courses</h1>
// //       <div className="field-row">
// //         <input className="input" placeholder="Search courses…" value={q} onChange={(e) => setQ(e.target.value)} />
// //         <select className="select" value={level} onChange={(e) => setLevel(e.target.value)}>
// //           <option value="">All levels</option>
// //           <option value="beginner">Beginner</option>
// //           <option value="intermediate">Intermediate</option>
// //           <option value="advanced">Advanced</option>
// //         </select>
// //       </div>
// //       <div style={{ height: 18 }} />
// //       {loading ? <p className="muted">Loading…</p> : (
// //         <div className="course-grid">
// //           {items.map((c) => <CourseCard key={c._id} course={c} />)}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }



// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchCourses } from '../redux/slices/courseSlice';
// import CourseCard from '../components/CourseCard.jsx';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Search, Filter, X, ChevronDown, Zap, TrendingUp, Clock } from 'lucide-react';

// // Animation Variants
// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: { staggerChildren: 0.08, delayChildren: 0.1 }
//   }
// };

// const itemVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
// };

// // Loading Skeleton
// const CourseSkeleton = () => (
//   <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl h-[300px] animate-pulse" />
// );

// // Empty State
// const EmptyState = ({ searchQuery, level }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     className="col-span-full flex flex-col items-center justify-center py-20"
//   >
//     <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-4">
//       <Search className="w-8 h-8 text-slate-400" />
//     </div>
//     <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
//     <p className="text-slate-400 text-center max-w-md">
//       {searchQuery || level 
//         ? `We couldn't find any courses matching "${searchQuery || 'your filters'}". Try adjusting your search or filters.`
//         : 'Start exploring our course library by searching or applying filters.'}
//     </p>
//   </motion.div>
// );

// // Header Section
// const HeaderSection = ({ searchQuery, level, onSearchChange, onLevelChange }) => {
//   const [isFilterOpen, setIsFilterOpen] = useState(false);

//   return (
//     <>
//       {/* Hero Section */}
//       <div className="relative bg-gradient-to-b from-[#0a0e27] via-[#0f1535] to-[#1a1f3a] border-b border-white/10 px-6 lg:px-8 py-16 lg:py-20">
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <motion.div
//             className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-3xl"
//             animate={{ y: [0, 20, 0] }}
//             transition={{ duration: 5, repeat: Infinity }}
//           />
//         </div>

//         <div className="relative z-10 max-w-7xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//           >
//             <div className="mb-4">
//               <h1 className="text-4xl lg:text-5xl font-black text-white mb-2">
//                 Explore <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Courses</span>
//               </h1>
//               <p className="text-slate-400 text-lg">Discover expert-led programs from top instructors</p>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Search & Filter Bar */}
//       <div className="bg-[#0a0e27] border-b border-white/10 px-6 lg:px-8 py-8 sticky top-0 z-40">
//         <div className="max-w-7xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.1 }}
//             className="space-y-4"
//           >
//             {/* Search Input */}
//             <div className="relative">
//               <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
//                 <Search className="w-5 h-5" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search courses by title, instructor, or topic…"
//                 value={searchQuery}
//                 onChange={(e) => onSearchChange(e.target.value)}
//                 className="w-full bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
//               />
//             </div>

//             {/* Mobile: Filter Toggle */}
//             <div className="lg:hidden">
//               <button
//                 onClick={() => setIsFilterOpen(!isFilterOpen)}
//                 className="w-full bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-lg px-4 py-3 text-white font-medium flex items-center justify-between hover:border-white/20 transition-all"
//               >
//                 <div className="flex items-center gap-2">
//                   <Filter className="w-5 h-5" />
//                   <span>Filter by Level</span>
//                 </div>
//                 <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
//               </button>
//             </div>

//             {/* Desktop: Filter Row */}
//             <div className="hidden lg:block">
//               <div className="flex gap-4">
//                 <select
//                   value={level}
//                   onChange={(e) => onLevelChange(e.target.value)}
//                   className="bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all cursor-pointer flex items-center gap-2"
//                 >
//                   <option value="">All levels</option>
//                   <option value="beginner">Beginner</option>
//                   <option value="intermediate">Intermediate</option>
//                   <option value="advanced">Advanced</option>
//                 </select>
//               </div>
//             </div>

//             {/* Mobile: Filter Panel */}
//             <AnimatePresence>
//               {isFilterOpen && (
//                 <motion.div
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: 'auto' }}
//                   exit={{ opacity: 0, height: 0 }}
//                   transition={{ duration: 0.3 }}
//                   className="lg:hidden space-y-3 pt-4 border-t border-white/10"
//                 >
//                   <select
//                     value={level}
//                     onChange={(e) => {
//                       onLevelChange(e.target.value);
//                       setIsFilterOpen(false);
//                     }}
//                     className="w-full bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
//                   >
//                     <option value="">All levels</option>
//                     <option value="beginner">Beginner</option>
//                     <option value="intermediate">Intermediate</option>
//                     <option value="advanced">Advanced</option>
//                   </select>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.div>

//           {/* Active Filters Badge */}
//           {(searchQuery || level) && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               className="flex gap-2 pt-4 flex-wrap"
//             >
//               {searchQuery && (
//                 <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-1.5">
//                   <span className="text-sm text-blue-400">Search: "{searchQuery}"</span>
//                   <button
//                     onClick={() => onSearchChange('')}
//                     className="hover:text-blue-300 transition"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 </div>
//               )}
//               {level && (
//                 <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-lg px-3 py-1.5">
//                   <span className="text-sm text-purple-400 capitalize">{level} level</span>
//                   <button
//                     onClick={() => onLevelChange('')}
//                     className="hover:text-purple-300 transition"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 </div>
//               )}
//               <button
//                 onClick={() => {
//                   onSearchChange('');
//                   onLevelChange('');
//                 }}
//                 className="text-sm text-slate-400 hover:text-slate-300 transition underline"
//               >
//                 Clear all
//               </button>
//             </motion.div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// // Results Header
// const ResultsHeader = ({ itemCount, loading, searchQuery, level }) => {
//   if (loading) return null;

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.4, delay: 0.2 }}
//       className="flex items-center justify-between mb-8"
//     >
//       <div>
//         <h2 className="text-lg font-semibold text-white">
//           {itemCount === 0 ? 'No results' : `${itemCount} course${itemCount !== 1 ? 's' : ''} found`}
//         </h2>
//         <p className="text-sm text-slate-400 mt-1">
//           {searchQuery || level
//             ? 'Refine your search to explore more options'
//             : 'Browse and find the perfect course for you'}
//         </p>
//       </div>

//       {/* Sort (future enhancement) */}
//       <div className="hidden lg:block">
//         <select className="bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer">
//           <option value="popular">Most Popular</option>
//           <option value="newest">Newest</option>
//           <option value="rating">Top Rated</option>
//           <option value="price-low">Price: Low to High</option>
//           <option value="price-high">Price: High to Low</option>
//         </select>
//       </div>
//     </motion.div>
//   );
// };

// // Main Courses Component
// export default function Courses() {
//   const dispatch = useDispatch();
//   const { items, loading } = useSelector((s) => s.courses);
//   const [q, setQ] = useState('');
//   const [level, setLevel] = useState('');

//   useEffect(() => {
//     dispatch(fetchCourses({ q, level, published: 'true' }));
//   }, [dispatch, q, level]);

//   return (
//     <div className="min-h-screen bg-[#0a0e27]">
//       {/* Header */}
//       <HeaderSection
//         searchQuery={q}
//         level={level}
//         onSearchChange={setQ}
//         onLevelChange={setLevel}
//       />

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
//         {/* Loading State */}
//         {loading ? (
//           <motion.div
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
//           >
//             {[...Array(8)].map((_, i) => (
//               <motion.div key={i} variants={itemVariants}>
//                 <CourseSkeleton />
//               </motion.div>
//             ))}
//           </motion.div>
//         ) : items.length === 0 ? (
//           <>
//             <ResultsHeader itemCount={0} loading={false} searchQuery={q} level={level} />
//             <EmptyState searchQuery={q} level={level} />
//           </>
//         ) : (
//           <>
//             <ResultsHeader itemCount={items.length} loading={false} searchQuery={q} level={level} />

//             {/* Course Grid */}
//             <motion.div
//               variants={containerVariants}
//               initial="hidden"
//               animate="visible"
//               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
//             >
//               <AnimatePresence mode="wait">
//                 {items.map((course, i) => (
//                   <motion.div
//                     key={course._id}
//                     variants={itemVariants}
//                     exit={{ opacity: 0, y: 20 }}
//                     layout
//                   >
//                     <CourseCard course={course} />
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//             </motion.div>
//           </>
//         )}

//         {/* No Results Message */}
//         {!loading && items.length === 0 && (q || level) && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.4, delay: 0.3 }}
//             className="mt-12 pt-12 border-t border-white/10 text-center"
//           >
//             <h3 className="text-lg font-semibold text-white mb-2">Tips for better search:</h3>
//             <ul className="text-slate-400 space-y-1">
//               <li>• Try different keywords or course names</li>
//               <li>• Check your spelling</li>
//               <li>• Try less specific search terms</li>
//               <li>• Browse all levels to see available options</li>
//             </ul>
//           </motion.div>
//         )}
//       </div>

//       {/* Footer CTA */}
//       {!loading && items.length > 0 && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="bg-gradient-to-b from-transparent to-[#1a1f3a] border-t border-white/10 px-6 lg:px-8 py-16"
//         >
//           <div className="max-w-7xl mx-auto text-center">
//             <h3 className="text-2xl font-bold text-white mb-4">
//               Can't find what you're looking for?
//             </h3>
//             <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
//               Our AI tutor can help you learn any topic on demand. Get personalized explanations, create custom learning paths, and master new skills instantly.
//             </p>
//             <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-8 py-4 rounded-lg font-semibold transition-all hover:shadow-xl hover:shadow-blue-500/20">
//               Start with AI Tutor
//             </button>
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// }





import { useEffect, useState, useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../redux/slices/courseSlice';
import CourseCard from '../components/CourseCard.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, X, ChevronDown, Zap, TrendingUp, Clock,
  Users, BookOpen, Award, Star, Mic, SlidersHorizontal,
  Sparkles, Brain, ArrowRight, GraduationCap, Target,
} from 'lucide-react';

// ─── Design tokens ────────────────────────────────────────────────────────────
const BG       = '#070B1A';
const CARD     = '#101828';
const CARD2    = '#151F32';
const PRIMARY  = '#5B7FFF';
const ACCENT   = '#7C3AED';
const BORDER   = 'rgba(255,255,255,0.08)';

// ─── Animation variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};
const stagger = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

// ─── Category chips ───────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: 'All',             value: '' },
  { label: '⚛️ Frontend',     value: 'frontend' },
  { label: '🛠 Backend',      value: 'backend' },
  { label: '🤖 AI / ML',      value: 'ai' },
  { label: '☁️ Cloud',        value: 'cloud' },
  { label: '🔧 DevOps',       value: 'devops' },
  { label: '📊 Data Science', value: 'data-science' },
  { label: '🎨 UI/UX',        value: 'ui-ux' },
  { label: '🔒 Cybersecurity',value: 'cybersecurity' },
  { label: '📱 Mobile',       value: 'mobile' },
];

const STATS = [
  { icon: Users,         val: '15,000+', label: 'Students',        color: PRIMARY },
  { icon: BookOpen,      val: '450+',    label: 'Courses',         color: ACCENT  },
  { icon: GraduationCap, val: '120+',    label: 'Expert Mentors',  color: '#22C55E' },
  { icon: Star,          val: '98%',     label: 'Completion Rate', color: '#F59E0B' },
];

// ─── Skeleton ────────────────────────────────────────────────────────────────
const CourseSkeleton = memo(() => (
  <div className="rounded-[24px] overflow-hidden border animate-pulse" style={{ background: CARD, borderColor: BORDER }}>
    <div className="h-44 bg-white/5" />
    <div className="p-5 space-y-3">
      <div className="h-3 bg-white/10 rounded-full w-1/3" />
      <div className="h-4 bg-white/10 rounded-full w-full" />
      <div className="h-4 bg-white/10 rounded-full w-4/5" />
      <div className="flex gap-2 pt-2">
        <div className="h-3 bg-white/10 rounded-full w-1/4" />
        <div className="h-3 bg-white/10 rounded-full w-1/4" />
      </div>
      <div className="h-10 bg-white/10 rounded-xl mt-2" />
    </div>
  </div>
));

// ─── Empty state ─────────────────────────────────────────────────────────────
const EmptyState = memo(({ searchQuery, level, onClear, onAI }) => (
  <motion.div variants={fadeUp} initial="hidden" animate="visible"
    className="col-span-full flex flex-col items-center justify-center py-24 text-center">
    <div className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 relative"
      style={{ background: `linear-gradient(135deg, ${PRIMARY}22, ${ACCENT}22)`, border: `1px solid ${BORDER}` }}>
      <Search className="w-10 h-10 text-[#A3AED0]" />
      <motion.div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
        style={{ background: PRIMARY }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
        <Sparkles className="w-3 h-3 text-white" />
      </motion.div>
    </div>
    <h3 className="text-2xl font-bold text-white mb-3">No matching courses found</h3>
    <p className="text-[#A3AED0] text-base max-w-md mb-8 leading-relaxed">
      Try different keywords or explore AI recommendations to find your perfect learning path.
    </p>
    <div className="flex flex-wrap gap-3 justify-center">
      <button onClick={onClear}
        className="px-6 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90"
        style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})` }}>
        Browse All Courses
      </button>
      <button onClick={onAI}
        className="px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:bg-white/10"
        style={{ border: `1px solid ${BORDER}`, color: '#A3AED0' }}>
        <span className="flex items-center gap-2"><Brain className="w-4 h-4" /> Ask AI Tutor</span>
      </button>
    </div>
  </motion.div>
));

// ─── Hero ─────────────────────────────────────────────────────────────────────
const Hero = memo(() => (
  <section className="relative overflow-hidden pt-14 pb-16 px-6 lg:px-8"
    style={{ background: `linear-gradient(180deg, #0D1225 0%, ${BG} 100%)` }}>

    {/* Background glows */}
    <motion.div className="absolute -top-40 right-0 w-[700px] h-[500px] rounded-full pointer-events-none opacity-25 blur-[120px]"
      style={{ background: `radial-gradient(circle, ${ACCENT} 0%, transparent 70%)` }}
      animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 10, repeat: Infinity }} />
    <motion.div className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full pointer-events-none opacity-15 blur-[100px]"
      style={{ background: `radial-gradient(circle, ${PRIMARY} 0%, transparent 70%)` }}
      animate={{ x: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity }} />

    <div className="max-w-[1440px] mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-12">

        {/* Left */}
        <motion.div className="flex-1" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ background: `${PRIMARY}18`, border: `1px solid ${PRIMARY}40`, color: PRIMARY }}>
            <Zap className="w-3.5 h-3.5" /> AI-Powered Learning Platform
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-5 tracking-tight">
            🚀 Explore<br />
            <span style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Professional
            </span>{' '}
            <span className="text-white">Courses</span>
          </h1>
          <p className="text-[#A3AED0] text-lg leading-relaxed max-w-xl mb-8">
            Learn industry-ready skills from expert instructors, build real-world projects, earn certificates, and accelerate your career with AI-powered learning.
          </p>
          <div className="flex flex-wrap gap-3">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="px-7 py-3.5 rounded-xl font-semibold text-white text-[15px] flex items-center gap-2"
              style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`, boxShadow: `0 0 40px ${PRIMARY}40` }}>
              <Sparkles className="w-4 h-4" /> Start Learning
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="px-7 py-3.5 rounded-xl font-semibold text-[15px] flex items-center gap-2 text-[#A3AED0] hover:text-white transition-colors"
              style={{ border: `1px solid ${BORDER}`, background: 'rgba(255,255,255,0.04)' }}>
              <TrendingUp className="w-4 h-4" /> Browse Paths
            </motion.button>
          </div>
        </motion.div>

        {/* Right — animated orb */}
        <motion.div className="shrink-0 relative w-[280px] h-[280px]"
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }}>
          <motion.div className="absolute inset-0 rounded-full blur-2xl opacity-40"
            style={{ background: `conic-gradient(from 0deg, ${PRIMARY}, ${ACCENT}, #22C55E, ${PRIMARY})` }}
            animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }} />
          <div className="absolute inset-6 rounded-full flex items-center justify-center"
            style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="text-center">
              <div className="text-5xl mb-2">🎓</div>
              <p className="text-white font-bold text-sm">Learn Anything</p>
              <p className="text-[#A3AED0] text-xs mt-1">AI-Powered</p>
            </div>
          </div>
          {/* Floating icons */}
          {[
            { icon: '⚛️', top: '5%',  left: '50%',  delay: 0   },
            { icon: '🤖', top: '50%', left: '95%',  delay: 0.5 },
            { icon: '📊', top: '85%', left: '60%',  delay: 1   },
            { icon: '☁️', top: '65%', left: '2%',   delay: 1.5 },
            { icon: '💡', top: '15%', left: '5%',   delay: 2   },
          ].map((f, i) => (
            <motion.div key={i} className="absolute w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-lg"
              style={{ top: f.top, left: f.left, background: CARD2, border: `1px solid ${BORDER}`, transform: 'translate(-50%,-50%)' }}
              animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, delay: f.delay }}>
              {f.icon}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Stats row */}
      <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-14"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
        {STATS.map((s) => (
          <div key={s.label} className="rounded-[20px] p-5 flex items-center gap-4"
            style={{ background: `${CARD}cc`, border: `1px solid ${BORDER}`, backdropFilter: 'blur(20px)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s.color}18` }}>
              <s.icon className="w-6 h-6" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{s.val}</p>
              <p className="text-sm text-[#A3AED0]">{s.label}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
));

// ─── Search + filter bar (sticky) ────────────────────────────────────────────
const SearchBar = memo(({ searchQuery, level, onSearchChange, onLevelChange }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="sticky top-0 z-40 py-5 px-6 lg:px-8" style={{ background: `${BG}f0`, backdropFilter: 'blur(24px)', borderBottom: `1px solid ${BORDER}` }}>
      <div className="max-w-[1440px] mx-auto space-y-4">

        {/* Search row */}
        <div className="flex gap-3">
          <motion.div className="relative flex-1" animate={{ scale: focused ? 1.005 : 1 }} transition={{ duration: 0.2 }}>
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A3AED0]" />
            <input
              type="text"
              placeholder="Search courses, instructors, technologies or skills..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              aria-label="Search courses"
              className="w-full h-[56px] pl-14 pr-14 rounded-[16px] text-white text-[15px] placeholder-[#A3AED0]/60 transition-all focus:outline-none"
              style={{
                background: CARD,
                border: `1.5px solid ${focused ? PRIMARY : BORDER}`,
                boxShadow: focused ? `0 0 0 3px ${PRIMARY}18` : 'none',
              }}
            />
            {searchQuery && (
              <button onClick={() => onSearchChange('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-[#A3AED0] hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>

          {/* Voice button */}
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="h-[56px] w-[56px] rounded-[16px] flex items-center justify-center text-[#A3AED0] hover:text-white transition-colors shrink-0"
            style={{ background: CARD, border: `1.5px solid ${BORDER}` }} aria-label="Voice search">
            <Mic className="w-5 h-5" />
          </motion.button>

          {/* Sort dropdown */}
          <div className="relative hidden md:flex items-center">
            <select
              className="h-[56px] pl-4 pr-10 rounded-[16px] text-white text-sm appearance-none cursor-pointer focus:outline-none"
              style={{ background: CARD, border: `1.5px solid ${BORDER}`, color: 'white', minWidth: 160 }}
              aria-label="Sort courses"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="rating">Top Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A3AED0] pointer-events-none" />
          </div>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const active = level === cat.value;
            return (
              <motion.button key={cat.value}
                onClick={() => onLevelChange(cat.value)}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap"
                style={active ? {
                  background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`,
                  color: 'white',
                  boxShadow: `0 0 20px ${PRIMARY}40`,
                } : {
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${BORDER}`,
                  color: '#A3AED0',
                }}>
                {cat.label}
              </motion.button>
            );
          })}
        </div>

        {/* Active filter badges */}
        <AnimatePresence>
          {(searchQuery || level) && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="flex gap-2 flex-wrap">
              {searchQuery && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
                  style={{ background: `${PRIMARY}18`, border: `1px solid ${PRIMARY}30`, color: PRIMARY }}>
                  Search: "{searchQuery}"
                  <button onClick={() => onSearchChange('')} className="hover:opacity-70"><X className="w-3.5 h-3.5" /></button>
                </div>
              )}
              {level && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm capitalize"
                  style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}30`, color: ACCENT }}>
                  {CATEGORIES.find((c) => c.value === level)?.label || level}
                  <button onClick={() => onLevelChange('')} className="hover:opacity-70"><X className="w-3.5 h-3.5" /></button>
                </div>
              )}
              <button onClick={() => { onSearchChange(''); onLevelChange(''); }}
                className="text-sm text-[#A3AED0] hover:text-white transition-colors underline underline-offset-2">
                Clear all
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

// ─── Results header ───────────────────────────────────────────────────────────
const ResultsHeader = memo(({ itemCount, loading, searchQuery, level }) => {
  if (loading) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
      className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-xl font-bold text-white">
          {itemCount === 0 ? 'No results' : `${itemCount} course${itemCount !== 1 ? 's' : ''} found`}
        </h2>
        <p className="text-sm text-[#A3AED0] mt-1">
          {searchQuery || level ? 'Refine your search to find more' : 'Browse and find the perfect course for you'}
        </p>
      </div>
    </motion.div>
  );
});

// ─── AI Tutor CTA ────────────────────────────────────────────────────────────
const AITutorSection = memo(() => {
  const navigate = useNavigate();
  return (
    <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-[32px] p-10 lg:p-14 mt-20"
      style={{ background: `linear-gradient(135deg, ${CARD2} 0%, #0D1535 100%)`, border: `1px solid ${BORDER}` }}>

      {/* Glow blobs */}
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-30 blur-[80px] pointer-events-none"
        style={{ background: `radial-gradient(circle, ${ACCENT}, transparent)` }} />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full opacity-20 blur-[80px] pointer-events-none"
        style={{ background: `radial-gradient(circle, ${PRIMARY}, transparent)` }} />

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
        {/* Floating AI orb */}
        <div className="shrink-0 relative w-40 h-40">
          <motion.div className="absolute inset-0 rounded-full opacity-40 blur-2xl"
            style={{ background: `conic-gradient(from 0deg, ${PRIMARY}, ${ACCENT}, ${PRIMARY})` }}
            animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} />
          <div className="absolute inset-3 rounded-full flex items-center justify-center"
            style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <span className="text-5xl">🤖</span>
          </div>
          <motion.div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})` }}
            animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <Sparkles className="w-4 h-4 text-white" />
          </motion.div>
        </div>

        {/* Text */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ background: `${PRIMARY}20`, border: `1px solid ${PRIMARY}30`, color: PRIMARY }}>
            <Brain className="w-3.5 h-3.5" /> AI-Powered Personalization
          </div>
          <h3 className="text-3xl lg:text-4xl font-black text-white mb-4 leading-tight">
            Need personalized learning?
          </h3>
          <p className="text-[#A3AED0] text-base lg:text-lg leading-relaxed mb-8 max-w-xl">
            Our AI Tutor creates custom learning paths, explains difficult concepts, recommends resources, and helps you master any skill faster.
          </p>
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/ai-assistant')}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[15px] text-white"
              style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${ACCENT})`, boxShadow: `0 0 40px ${PRIMARY}40` }}>
              <Sparkles className="w-4 h-4" /> Start with AI Tutor
            </motion.button>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/ai-roadmap')}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[15px] text-[#A3AED0] hover:text-white transition-colors"
              style={{ border: `1px solid ${BORDER}`, background: 'rgba(255,255,255,0.04)' }}>
              <Target className="w-4 h-4" /> Generate Learning Roadmap <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.section>
  );
});

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Courses() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.courses);

  // ← ALL EXISTING LOGIC PRESERVED EXACTLY
  const [q, setQ]         = useState('');
  const [level, setLevel] = useState('');

  useEffect(() => {
    dispatch(fetchCourses({ q, level, published: 'true' }));
  }, [dispatch, q, level]);

  const handleClear = useCallback(() => { setQ(''); setLevel(''); }, []);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-['Inter',sans-serif]" style={{ background: BG }}>

      {/* Hero */}
      <Hero />

      {/* Sticky search + filter */}
      <SearchBar
        searchQuery={q}
        level={level}
        onSearchChange={setQ}
        onLevelChange={setLevel}
      />

      {/* Main content */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-12">

        {loading ? (
          // Skeletons
          <motion.div variants={stagger} initial="hidden" animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <motion.div key={i} variants={fadeUp}><CourseSkeleton /></motion.div>
            ))}
          </motion.div>
        ) : items.length === 0 ? (
          <>
            <ResultsHeader itemCount={0} loading={false} searchQuery={q} level={level} />
            <EmptyState
              searchQuery={q} level={level}
              onClear={handleClear}
              onAI={() => navigate('/ai-assistant')}
            />
          </>
        ) : (
          <>
            <ResultsHeader itemCount={items.length} loading={false} searchQuery={q} level={level} />

            {/* ← COURSE GRID — uses existing CourseCard component exactly as before */}
            <motion.div variants={stagger} initial="hidden" animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatePresence mode="wait">
                {items.map((course) => (
                  <motion.div key={course._id} variants={fadeUp} exit={{ opacity: 0, y: 20 }} layout
                    whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
                    <CourseCard course={course} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Search tips */}
            {(q || level) && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="mt-12 pt-10 border-t text-center" style={{ borderColor: BORDER }}>
                <h3 className="text-base font-semibold text-white mb-3">Tips for better results</h3>
                <ul className="text-[#A3AED0] text-sm space-y-1">
                  <li>• Try different keywords or course names</li>
                  <li>• Check your spelling</li>
                  <li>• Try less specific search terms</li>
                  <li>• Browse all levels to see available options</li>
                </ul>
              </motion.div>
            )}
          </>
        )}

        {/* AI Tutor CTA */}
        {!loading && <AITutorSection />}
      </div>
    </div>
  );
}