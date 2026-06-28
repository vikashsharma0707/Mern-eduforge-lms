// // import { Link } from 'react-router-dom';

// // export default function CourseCard({ course }) {
// //   const price = course.discountPrice || course.price;
// //   return (
// //     <Link to={`/courses/${course.slug}`} className="course-card">
// //       <div className="course-thumb">
// //         {course.thumbnail
// //           ? <img src={`${(import.meta.env.VITE_API_URL || '').replace('/api','')}${course.thumbnail}`} alt={course.title} />
// //           : <div className="thumb-placeholder">{course.title?.[0]}</div>}
// //         <span className={`badge level-${course.level}`}>{course.level}</span>
// //       </div>
// //       <div className="course-body">
// //         <h3>{course.title}</h3>
// //         <p className="muted">{course.teacher?.name || 'Instructor'}</p>
// //         <div className="course-meta">
// //           <span className="price">{price ? `₹${price}` : 'Free'}</span>
// //           <span className="muted">{course.enrollmentCount || 0} learners</span>
// //         </div>
// //       </div>
// //     </Link>
// //   );
// // }


// import { Link } from 'react-router-dom';

// export default function CourseCard({ course }) {
//   const price = course.discountPrice || course.price;

//   // Correct Image URL Logic
//   const getImageUrl = (thumbnail) => {
//     if (!thumbnail) return null;

//     const baseUrl = import.meta.env.VITE_API_URL 
//       ? import.meta.env.VITE_API_URL.replace('/api', '') 
//       : 'http://localhost:5000';

//     return `${baseUrl}${thumbnail}`;
//   };

//   return (
//     <Link to={`/courses/${course.slug}`} className="course-card">
//       <div className="course-thumb">
//         {course.thumbnail ? (
//           <img 
//             src={getImageUrl(course.thumbnail)} 
//             alt={course.title} 
//             loading="lazy"
//           />
//         ) : (
//           <div className="thumb-placeholder">
//             {course.title?.[0] || 'C'}
//           </div>
//         )}

//         {course.level && (
//           <span className={`badge level-${course.level.toLowerCase()}`}>
//             {course.level}
//           </span>
//         )}
//       </div>

//       <div className="course-body">
//         <h3>{course.title}</h3>
//         <p className="muted">{course.teacher?.name || 'Instructor'}</p>
        
//         <div className="course-meta">
//           <span className="price">
//             {price ? `₹${price}` : 'Free'}
//           </span>
//           <span className="muted">
//             {course.enrollmentCount || 0} learners
//           </span>
//         </div>
//       </div>
//     </Link>
//   );
// }


import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Star, BookOpen, Clock, Award, CheckCircle2, Zap } from 'lucide-react';

const PRIMARY = '#5B7FFF';
const ACCENT  = '#7C3AED';
const CARD    = '#101828';
const BORDER  = 'rgba(255,255,255,0.08)';

const LEVEL_CONFIG = {
  beginner:     { color: '#22C55E', label: 'Beginner'     },
  intermediate: { color: '#F59E0B', label: 'Intermediate' },
  advanced:     { color: '#EF4444', label: 'Advanced'     },
};

const GRADIENT_PALETTES = [
  'linear-gradient(135deg,#1e3a5f,#0d1b2a)',
  'linear-gradient(135deg,#2d1b4e,#0d0b1e)',
  'linear-gradient(135deg,#1a3a2a,#0d1b15)',
  'linear-gradient(135deg,#3a1a1a,#1b0d0d)',
  'linear-gradient(135deg,#1a2a3a,#0d151b)',
];

export default function CourseCard({ course }) {
  // ← ALL EXISTING LOGIC PRESERVED EXACTLY
  const price = course.discountPrice || course.price;

  const getImageUrl = (thumbnail) => {
    if (!thumbnail) return null;
    const baseUrl = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace('/api', '')
      : 'http://localhost:5000';
    return `${baseUrl}${thumbnail}`;
  };

  // Derived display values
  const levelCfg     = LEVEL_CONFIG[course.level?.toLowerCase()] || null;
  const hasDiscount  = course.discountPrice && course.price && course.discountPrice < course.price;
  const discountPct  = hasDiscount ? Math.round((1 - course.discountPrice / course.price) * 100) : 0;
  const placeholderBg = GRADIENT_PALETTES[(course.title?.charCodeAt(0) || 0) % GRADIENT_PALETTES.length];
  const initials     = course.title?.slice(0, 2).toUpperCase() || 'C';
  const teacherInit  = course.teacher?.name?.[0]?.toUpperCase() || 'T';
  const rating       = course.ratingAvg || 4.5;
  const imageUrl     = getImageUrl(course.thumbnail);

  return (
    <Link to={`/courses/${course.slug}`} className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B7FFF] rounded-[24px]">
      <motion.div
        className="relative rounded-[24px] overflow-hidden h-full flex flex-col"
        style={{ background: CARD, border: `1px solid ${BORDER}` }}
        whileHover={{
          borderColor: `${PRIMARY}60`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${PRIMARY}18`,
        }}
        transition={{ duration: 0.25 }}
      >
        {/* ── Thumbnail ── */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
          {imageUrl ? (
            <motion.img
              src={imageUrl}
              alt={course.title}
              loading="lazy"
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.4 }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl font-black text-white/20 select-none"
              style={{ background: placeholderBg }}>
              {initials}
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Top-left badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {course.isBestseller && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold text-black"
                style={{ background: '#F59E0B' }}>
                🏆 Bestseller
              </span>
            )}
            {course.isNew && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white"
                style={{ background: `linear-gradient(135deg,${PRIMARY},${ACCENT})` }}>
                ✨ New
              </span>
            )}
            {course.isTrending && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#EF4444,#f97316)' }}>
                🔥 Trending
              </span>
            )}
          </div>

          {/* Level badge — bottom right */}
          {levelCfg && (
            <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg text-[11px] font-semibold"
              style={{ background: `${levelCfg.color}25`, color: levelCfg.color, border: `1px solid ${levelCfg.color}40` }}>
              {levelCfg.label}
            </span>
          )}

          {/* Discount badge */}
          {hasDiscount && (
            <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold text-white"
              style={{ background: '#22C55E' }}>
              -{discountPct}%
            </span>
          )}
        </div>

        {/* ── Card body ── */}
        <div className="flex flex-col flex-1 p-5">

          {/* Category + duration row */}
          <div className="flex items-center justify-between mb-3">
            {course.category?.name && (
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{ background: `${PRIMARY}18`, color: PRIMARY }}>
                {course.category.name}
              </span>
            )}
            {course.duration && (
              <span className="flex items-center gap-1 text-[11px] text-[#A3AED0]">
                <Clock className="w-3 h-3" /> {course.duration}h
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-[15px] font-bold text-white leading-snug mb-3 line-clamp-2 group-hover:text-[#5B7FFF] transition-colors">
            {course.title}
          </h3>

          {/* Instructor */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
              style={{ background: `linear-gradient(135deg,${PRIMARY},${ACCENT})` }}>
              {teacherInit}
            </div>
            <span className="text-[12px] text-[#A3AED0] truncate">{course.teacher?.name || 'Instructor'}</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
          </div>

          {/* Meta row — rating, students, lessons */}
          <div className="flex items-center gap-3 text-[11px] text-[#A3AED0] mb-4 flex-wrap">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
              <span className="text-white font-semibold">{rating.toFixed(1)}</span>
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {(course.enrollmentCount || 0).toLocaleString()}
            </span>
            {course.lessonCount && (
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {course.lessonCount} lessons
              </span>
            )}
            {course.certificate && (
              <span className="flex items-center gap-1">
                <Award className="w-3 h-3 text-[#F59E0B]" />
                <span className="text-[#F59E0B]">Certificate</span>
              </span>
            )}
          </div>

          {/* Spacer pushes price + CTA to bottom */}
          <div className="flex-1" />

          {/* Price + CTA */}
          <div className="flex items-center justify-between pt-4"
            style={{ borderTop: `1px solid ${BORDER}` }}>
            <div>
              <span className="text-xl font-black text-white">
                {price ? `₹${price}` : 'Free'}
              </span>
              {hasDiscount && (
                <span className="ml-2 text-sm text-[#A3AED0] line-through">
                  ₹{course.price}
                </span>
              )}
              {hasDiscount && (
                <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: '#22C55E20', color: '#22C55E' }}>
                  Save {discountPct}%
                </span>
              )}
            </div>

            <motion.span
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold text-white shrink-0"
              style={{ background: `linear-gradient(135deg,${PRIMARY},${ACCENT})` }}
              whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${PRIMARY}50` }}
              whileTap={{ scale: 0.95 }}>
              <Zap className="w-3.5 h-3.5" /> Enroll
            </motion.span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}