// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { courseApi, enrollmentApi } from '../../services';
// import { fileUrl, formatINR } from '../../utils/format';
// import { payForCourse } from '../../utils/razorpay';
// import { toast } from 'react-toastify';
// import Loader from '../../components/Loader.jsx';

// export default function CourseDetails() {
//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const { user } = useSelector((s) => s.auth);
//   const [data, setData] = useState(null);

//   useEffect(() => { courseApi.get(slug).then((r) => setData(r.data)); }, [slug]);
//   if (!data) return <Loader />;
//   const { course, lessons } = data;
//   const price = course.discountPrice || course.price;

//   const enroll = async () => {
//     if (!user) return navigate('/login');
//     if (price > 0) return payForCourse(course._id, () => navigate(`/learn/${course.slug}`));
//     await enrollmentApi.enroll(course._id);
//     toast.success('Enrolled!');
//     navigate(`/learn/${course.slug}`);
//   };

//   return (
//     <div className="container page">
//       <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
//         <div>
//           <h1>{course.title}</h1>
//           <p className="muted">By {course.teacher?.name}</p>
//           <p>{course.description}</p>
//           <h3>What you'll learn</h3>
//           <ul>{(course.whatYouLearn || []).map((x, i) => <li key={i}>{x}</li>)}</ul>
//           <h3>Curriculum ({lessons.length} lessons)</h3>
//           <div className="card">
//             {lessons.map((l, i) => (
//               <div key={l._id} className="lesson-item">
//                 <span>{i + 1}. {l.title}</span>
//                 <span className="muted">{l.durationMinutes || 0}m</span>
//               </div>
//             ))}
//           </div>
//         </div>
//         <aside className="card" style={{ height: 'max-content', position: 'sticky', top: 84 }}>
//           {course.thumbnail && <img src={fileUrl(course.thumbnail)} alt="" style={{ borderRadius: 8 }} />}
//           <h2 style={{ margin: '16px 0 4px' }}>{price ? formatINR(price) : 'Free'}</h2>
//           <p className="muted">{course.enrollmentCount} learners</p>
//           <button className="btn btn-primary btn-block" onClick={enroll}>
//             {price ? 'Enroll — pay now' : 'Enroll for free'}
//           </button>
//         </aside>
//       </div>
//     </div>
//   );
// }




import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { courseApi, enrollmentApi } from "../../services";
import { fileUrl, formatINR } from "../../utils/format";
import { payForCourse } from "../../utils/razorpay";
import { toast } from "react-toastify";
import Loader from "../../components/Loader.jsx";

export default function CourseDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const [data, setData] = useState(null);

  useEffect(() => {
    courseApi.get(slug).then((r) => setData(r.data));
  }, [slug]);

  if (!data) return <Loader />;

  const { course, lessons } = data;
  const price = course.discountPrice || course.price;

  const enroll = async () => {
    if (!user) return navigate("/login");

    if (price > 0) {
      return payForCourse(course._id, () =>
        navigate(`/learn/${course.slug}`)
      );
    }

    await enrollmentApi.enroll(course._id);
    toast.success("Enrolled!");
    navigate(`/learn/${course.slug}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="mb-4 text-4xl font-bold">{course.title}</h1>

          <p className="mb-4 text-slate-400">
            By {course.teacher?.name}
          </p>

          <p className="mb-8 text-slate-300">
            {course.description}
          </p>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-4 text-2xl font-semibold">
              What You'll Learn
            </h2>

            <ul className="space-y-3">
              {(course.whatYouLearn || []).map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-slate-300"
                >
                  <span className="h-2 w-2 rounded-full bg-violet-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-4 text-2xl font-semibold">
              Curriculum ({lessons.length} lessons)
            </h2>

            <div className="space-y-3">
              {lessons.map((lesson, index) => (
                <div
                  key={lesson._id}
                  className="flex items-center justify-between rounded-xl border border-slate-800 p-4"
                >
                  <span>
                    {index + 1}. {lesson.title}
                  </span>

                  <span className="text-sm text-slate-500">
                    {lesson.durationMinutes || 0}m
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-slate-800 bg-slate-900 p-5 lg:sticky lg:top-24">
          {course.thumbnail && (
            <img
              src={fileUrl(course.thumbnail)}
              alt={course.title}
              className="mb-4 w-full rounded-xl"
            />
          )}

          <h2 className="mb-2 text-4xl font-bold">
            {price ? formatINR(price) : "Free"}
          </h2>

          <p className="mb-6 text-slate-400">
            {course.enrollmentCount || 0} learners enrolled
          </p>

          <button
            onClick={enroll}
            className="w-full rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-500"
          >
            {price ? "Enroll Now" : "Enroll For Free"}
          </button>
        </aside>
      </div>
    </div>
  );
}