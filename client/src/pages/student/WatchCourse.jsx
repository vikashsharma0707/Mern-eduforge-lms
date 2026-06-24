// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { courseApi, enrollmentApi } from '../../services';
// import { fileUrl } from '../../utils/format';
// import Loader from '../../components/Loader.jsx';
// import { toast } from 'react-toastify';

// export default function WatchCourse() {
//   const { slug } = useParams();
//   const [data, setData] = useState(null);
//   const [current, setCurrent] = useState(0);
//   const [done, setDone] = useState([]);

//   useEffect(() => {
//     courseApi.get(slug).then((r) => setData(r.data));
//     enrollmentApi.list().then((r) => {
//       const mine = r.data.find((e) => e.course?.slug === slug);
//       if (mine) setDone(mine.completedLessons.map(String));
//     });
//   }, [slug]);

//   if (!data) return <Loader />;
//   const { course, lessons } = data;
//   const lesson = lessons[current];

//   const markDone = async () => {
//     const r = await enrollmentApi.complete(course._id, lesson._id);
//     setDone(r.data.completedLessons.map(String));
//     toast.success('Marked complete');
//   };

//   return (
//     <div className="container page">
//       <h1>{course.title}</h1>
//       <div className="player-layout">
//         <div className="player">
//           {lesson.videoUrl
//             ? <video src={fileUrl(lesson.videoUrl)} controls />
//             : <div style={{ aspectRatio: '16/9', background: '#000', display: 'grid', placeItems: 'center' }} className="muted">No video</div>}
//           <h2>{lesson.title}</h2>
//           <p className="muted">{lesson.description}</p>
//           <div style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>{lesson.content}</div>
//           <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={markDone}>
//             ✓ Mark lesson complete
//           </button>
//         </div>
//         <div className="lesson-list">
//           {lessons.map((l, i) => (
//             <div key={l._id}
//                  className={`lesson-item ${i === current ? 'active' : ''} ${done.includes(String(l._id)) ? 'done' : ''}`}
//                  onClick={() => setCurrent(i)}>
//               <span>{done.includes(String(l._id)) ? '✓' : i + 1}. {l.title}</span>
//               <span className="muted">{l.durationMinutes || 0}m</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }




import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { courseApi, enrollmentApi } from '../../services';
import { fileUrl } from '../../utils/format';
import Loader from '../../components/Loader.jsx';
import { toast } from 'react-toastify';

export default function WatchCourse() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [courseRes, enrollmentRes] = await Promise.all([
          courseApi.get(slug),
          enrollmentApi.list()
        ]);

        setData(courseRes.data);

        const mine = enrollmentRes.data.find((e) => e.course?.slug === slug);
        if (mine?.completedLessons) {
          setDone(mine.completedLessons.map(String));
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load course.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  if (loading) return <Loader />;
  if (error) return <div className="container page"><h1>Error</h1><p>{error}</p></div>;
  if (!data?.course) return <div className="container page"><h1>Course not found</h1></div>;

  const { course, lessons = [] } = data;
  const lesson = lessons[current];

  const markDone = async () => {
    try {
      const r = await enrollmentApi.complete(course._id, lesson._id);
      setDone(r.data.completedLessons.map(String));
      toast.success('Lesson marked as complete');
    } catch (err) {
      toast.error('Failed to mark complete');
    }
  };

  return (
    <div className="container page">
      <h1>{course.title}</h1>

      <div className="player-layout">
        <div className="player">
          {/* {lesson?.videoUrl ? (
            <video
              key={lesson._id}
              src={fileUrl(lesson.videoUrl)}
              controls
              autoPlay={false}
              style={{ width: '100%', borderRadius: '8px', background: '#000' }}
              onError={(e) => {
                const url = fileUrl(lesson.videoUrl);
                console.error("🚨 VIDEO LOAD ERROR");
                console.error("Raw path:", lesson.videoUrl);
                console.error("Final URL:", url);
                toast.error("Video load failed - Check console");
              }}
              onLoadedData={() => console.log("✅ Video loaded successfully")}
            />
          ) : (
            <div className="no-video">No video available</div>
          )} */}

          {lesson?.videoUrl ? (
  <div>
    <video
      key={lesson._id}
      src={fileUrl(lesson.videoUrl)}
      controls
      autoPlay={false}
      style={{ width: '100%', borderRadius: '8px', background: '#000' }}
      onError={(e) => {
        const url = fileUrl(lesson.videoUrl);
        console.error("🚨 VIDEO LOAD ERROR");
        console.error("Raw path:", lesson.videoUrl);
        console.error("Final URL:", url);
        toast.error("Video load failed");
      }}
      onLoadedData={() => console.log("✅ Video loaded successfully")}
    />
    <small style={{ display: 'block', marginTop: '8px', color: '#666', wordBreak: 'break-all' }}>
      Debug URL: {fileUrl(lesson.videoUrl)}
    </small>
  </div>
) : (
  <div className="no-video">No video available</div>
)}

          <h2>{lesson?.title}</h2>
          <p className="muted">{lesson?.description}</p>
          <div style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>{lesson?.content}</div>

          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={markDone}>
            ✓ Mark lesson complete
          </button>
        </div>

        <div className="lesson-list">
          {lessons.map((l, i) => (
            <div
              key={l._id}
              className={`lesson-item ${i === current ? 'active' : ''} ${done.includes(String(l._id)) ? 'done' : ''}`}
              onClick={() => setCurrent(i)}
            >
              <span>{done.includes(String(l._id)) ? '✓' : `${i + 1}.`} {l.title}</span>
              <span className="muted">{l.durationMinutes || 0} min</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}