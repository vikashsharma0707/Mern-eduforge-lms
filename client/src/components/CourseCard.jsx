// import { Link } from 'react-router-dom';

// export default function CourseCard({ course }) {
//   const price = course.discountPrice || course.price;
//   return (
//     <Link to={`/courses/${course.slug}`} className="course-card">
//       <div className="course-thumb">
//         {course.thumbnail
//           ? <img src={`${(import.meta.env.VITE_API_URL || '').replace('/api','')}${course.thumbnail}`} alt={course.title} />
//           : <div className="thumb-placeholder">{course.title?.[0]}</div>}
//         <span className={`badge level-${course.level}`}>{course.level}</span>
//       </div>
//       <div className="course-body">
//         <h3>{course.title}</h3>
//         <p className="muted">{course.teacher?.name || 'Instructor'}</p>
//         <div className="course-meta">
//           <span className="price">{price ? `₹${price}` : 'Free'}</span>
//           <span className="muted">{course.enrollmentCount || 0} learners</span>
//         </div>
//       </div>
//     </Link>
//   );
// }


import { Link } from 'react-router-dom';

export default function CourseCard({ course }) {
  const price = course.discountPrice || course.price;

  // Correct Image URL Logic
  const getImageUrl = (thumbnail) => {
    if (!thumbnail) return null;

    const baseUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('/api', '') 
      : 'http://localhost:5000';

    return `${baseUrl}${thumbnail}`;
  };

  return (
    <Link to={`/courses/${course.slug}`} className="course-card">
      <div className="course-thumb">
        {course.thumbnail ? (
          <img 
            src={getImageUrl(course.thumbnail)} 
            alt={course.title} 
            loading="lazy"
          />
        ) : (
          <div className="thumb-placeholder">
            {course.title?.[0] || 'C'}
          </div>
        )}

        {course.level && (
          <span className={`badge level-${course.level.toLowerCase()}`}>
            {course.level}
          </span>
        )}
      </div>

      <div className="course-body">
        <h3>{course.title}</h3>
        <p className="muted">{course.teacher?.name || 'Instructor'}</p>
        
        <div className="course-meta">
          <span className="price">
            {price ? `₹${price}` : 'Free'}
          </span>
          <span className="muted">
            {course.enrollmentCount || 0} learners
          </span>
        </div>
      </div>
    </Link>
  );
}