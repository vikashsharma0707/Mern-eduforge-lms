// import { useEffect, useState } from 'react';
// import { enrollmentApi, quizApi } from '../../services';

// export default function StudentQuizzes() {
//   const [quizzes, setQuizzes] = useState([]);
//   const [active, setActive] = useState(null);
//   const [answers, setAnswers] = useState({});
//   const [result, setResult] = useState(null);

//   useEffect(() => {
//     enrollmentApi.list().then(async r => {
//       const all = [];
//       for (const e of r.data) {
//         const q = await quizApi.byCourse(e.course._id);
//         q.data.forEach(x => all.push({ ...x, courseTitle: e.course.title }));
//       }
//       setQuizzes(all);
//     });
//   }, []);

//   const open = async (id) => {
//     const r = await quizApi.get(id);
//     setActive(r.data); setAnswers({}); setResult(null);
//   };
//   const submit = async () => {
//     const payload = Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer }));
//     const r = await quizApi.submit(active._id, payload);
//     setResult(r.data);
//   };

//   if (active) return (
//     <div className="container page">
//       <h1>{active.title}</h1>
//       {active.questions.map((q, i) => (
//         <div className="card" key={q._id} style={{ marginBottom: 12 }}>
//           <p><b>{i + 1}.</b> {q.text}</p>
//           {q.type === 'mcq' ? q.options.map((o, j) => (
//             <label key={j} style={{ display: 'block', padding: 4 }}>
//               <input type="radio" name={q._id} value={o} onChange={(e) => setAnswers({ ...answers, [q._id]: e.target.value })} /> {o}
//             </label>
//           )) : <input className="input" onChange={(e) => setAnswers({ ...answers, [q._id]: e.target.value })} />}
//         </div>
//       ))}
//       {!result && <button className="btn btn-primary" onClick={submit}>Submit</button>}
//       {result && (
//         <div className="card"><h3>Score: {result.score}/{result.totalMarks} ({result.percent}%) — {result.passed ? 'Passed' : 'Try again'}</h3></div>
//       )}
//       <button className="btn btn-ghost" style={{ marginLeft: 8 }} onClick={() => setActive(null)}>Back</button>
//     </div>
//   );

//   return (
//     <div className="container page">
//       <h1>Quizzes</h1>
//       {quizzes.map(q => (
//         <div className="card" key={q._id} style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
//           <div><h3>{q.title}</h3><small className="muted">{q.courseTitle}</small></div>
//           <button className="btn btn-primary" onClick={() => open(q._id)}>Start</button>
//         </div>
//       ))}
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { enrollmentApi, quizApi } from '../../services';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader.jsx';

export default function StudentQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch all quizzes from enrolled courses
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const enrollRes = await enrollmentApi.list();
        const enrollments = enrollRes.data || [];

        const allQuizzes = [];

        for (const e of enrollments) {
          if (e.course?._id) {
            const quizRes = await quizApi.byCourse(e.course._id);
            const courseQuizzes = quizRes.data || [];
            courseQuizzes.forEach(q => {
              allQuizzes.push({ ...q, courseTitle: e.course.title });
            });
          }
        }

        setQuizzes(allQuizzes);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load quizzes');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const startQuiz = async (quizId) => {
    try {
      const r = await quizApi.get(quizId);
      setActiveQuiz(r.data);
      setAnswers({});
      setResult(null);
    } catch (err) {
      toast.error('Failed to load quiz');
    }
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const submitQuiz = async () => {
    if (!activeQuiz) return;

    setSubmitting(true);
    try {
      const payload = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer
      }));

      const r = await quizApi.submit(activeQuiz._id, payload);
      setResult(r.data);
      toast.success('Quiz submitted successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  // Quiz Taking Screen
  if (activeQuiz) {
    return (
      <div className="container page">
        <h1>{activeQuiz.title}</h1>
        <p className="muted">{activeQuiz.courseTitle}</p>

        {activeQuiz.questions.map((q, i) => (
          <div className="card" key={q._id} style={{ marginBottom: 16 }}>
            <p><strong>{i + 1}. {q.text}</strong></p>

            {q.type === 'mcq' ? (
              q.options.map((option, idx) => (
                <label key={idx} style={{ display: 'block', padding: '6px 0' }}>
                  <input
                    type="radio"
                    name={q._id}                    // Important: same name for group
                    value={option}
                    checked={answers[q._id] === option}
                    onChange={(e) => handleAnswer(q._id, e.target.value)}
                  />
                  {' '}{option}
                </label>
              ))
            ) : (
              <input
                className="input"
                value={answers[q._id] || ''}
                onChange={(e) => handleAnswer(q._id, e.target.value)}
                placeholder="Type your answer..."
              />
            )}
          </div>
        ))}

        <div style={{ marginTop: 20 }}>
          {!result && (
            <button 
              className="btn btn-primary" 
              onClick={submitQuiz}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          )}

          <button 
            className="btn btn-ghost" 
            style={{ marginLeft: 12 }}
            onClick={() => setActiveQuiz(null)}
          >
            Back to All Quizzes
          </button>
        </div>

        {result && (
          <div className="card" style={{ marginTop: 20 }}>
            <h3>Result: {result.score} / {result.totalMarks} ({result.percent}%)</h3>
            <h4 style={{ color: result.passed ? 'green' : 'red' }}>
              {result.passed ? '🎉 Passed!' : '❌ Try Again'}
            </h4>
          </div>
        )}
      </div>
    );
  }

  // All Quizzes List
  return (
    <div className="container page">
      <h1>My Quizzes</h1>

      {loading && <Loader />}

      {!loading && quizzes.length === 0 && (
        <p className="muted">No quizzes available in your enrolled courses.</p>
      )}

      {quizzes.map((q) => (
        <div className="card" key={q._id} style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3>{q.title}</h3>
            <small className="muted">{q.courseTitle}</small>
          </div>
          <button className="btn btn-primary" onClick={() => startQuiz(q._id)}>
            Start Quiz
          </button>
        </div>
      ))}
    </div>
  );
}