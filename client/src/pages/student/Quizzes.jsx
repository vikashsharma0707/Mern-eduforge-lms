// // import { useEffect, useState } from 'react';
// // import { enrollmentApi, quizApi } from '../../services';

// // export default function StudentQuizzes() {
// //   const [quizzes, setQuizzes] = useState([]);
// //   const [active, setActive] = useState(null);
// //   const [answers, setAnswers] = useState({});
// //   const [result, setResult] = useState(null);

// //   useEffect(() => {
// //     enrollmentApi.list().then(async r => {
// //       const all = [];
// //       for (const e of r.data) {
// //         const q = await quizApi.byCourse(e.course._id);
// //         q.data.forEach(x => all.push({ ...x, courseTitle: e.course.title }));
// //       }
// //       setQuizzes(all);
// //     });
// //   }, []);

// //   const open = async (id) => {
// //     const r = await quizApi.get(id);
// //     setActive(r.data); setAnswers({}); setResult(null);
// //   };
// //   const submit = async () => {
// //     const payload = Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer }));
// //     const r = await quizApi.submit(active._id, payload);
// //     setResult(r.data);
// //   };

// //   if (active) return (
// //     <div className="container page">
// //       <h1>{active.title}</h1>
// //       {active.questions.map((q, i) => (
// //         <div className="card" key={q._id} style={{ marginBottom: 12 }}>
// //           <p><b>{i + 1}.</b> {q.text}</p>
// //           {q.type === 'mcq' ? q.options.map((o, j) => (
// //             <label key={j} style={{ display: 'block', padding: 4 }}>
// //               <input type="radio" name={q._id} value={o} onChange={(e) => setAnswers({ ...answers, [q._id]: e.target.value })} /> {o}
// //             </label>
// //           )) : <input className="input" onChange={(e) => setAnswers({ ...answers, [q._id]: e.target.value })} />}
// //         </div>
// //       ))}
// //       {!result && <button className="btn btn-primary" onClick={submit}>Submit</button>}
// //       {result && (
// //         <div className="card"><h3>Score: {result.score}/{result.totalMarks} ({result.percent}%) — {result.passed ? 'Passed' : 'Try again'}</h3></div>
// //       )}
// //       <button className="btn btn-ghost" style={{ marginLeft: 8 }} onClick={() => setActive(null)}>Back</button>
// //     </div>
// //   );

// //   return (
// //     <div className="container page">
// //       <h1>Quizzes</h1>
// //       {quizzes.map(q => (
// //         <div className="card" key={q._id} style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
// //           <div><h3>{q.title}</h3><small className="muted">{q.courseTitle}</small></div>
// //           <button className="btn btn-primary" onClick={() => open(q._id)}>Start</button>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }


// import { useEffect, useState } from 'react';
// import { enrollmentApi, quizApi } from '../../services';
// import { toast } from 'react-toastify';
// import Loader from '../../components/Loader.jsx';

// export default function StudentQuizzes() {
//   const [quizzes, setQuizzes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeQuiz, setActiveQuiz] = useState(null);
//   const [answers, setAnswers] = useState({});
//   const [result, setResult] = useState(null);
//   const [submitting, setSubmitting] = useState(false);

//   // Fetch all quizzes from enrolled courses
//   useEffect(() => {
//     const fetchQuizzes = async () => {
//       try {
//         setLoading(true);
//         const enrollRes = await enrollmentApi.list();
//         const enrollments = enrollRes.data || [];

//         const allQuizzes = [];

//         for (const e of enrollments) {
//           if (e.course?._id) {
//             const quizRes = await quizApi.byCourse(e.course._id);
//             const courseQuizzes = quizRes.data || [];
//             courseQuizzes.forEach(q => {
//               allQuizzes.push({ ...q, courseTitle: e.course.title });
//             });
//           }
//         }

//         setQuizzes(allQuizzes);
//       } catch (err) {
//         console.error(err);
//         toast.error('Failed to load quizzes');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuizzes();
//   }, []);

//   const startQuiz = async (quizId) => {
//     try {
//       const r = await quizApi.get(quizId);
//       setActiveQuiz(r.data);
//       setAnswers({});
//       setResult(null);
//     } catch (err) {
//       toast.error('Failed to load quiz');
//     }
//   };

//   const handleAnswer = (questionId, answer) => {
//     setAnswers(prev => ({ ...prev, [questionId]: answer }));
//   };

//   const submitQuiz = async () => {
//     if (!activeQuiz) return;

//     setSubmitting(true);
//     try {
//       const payload = Object.entries(answers).map(([questionId, answer]) => ({
//         questionId,
//         answer
//       }));

//       const r = await quizApi.submit(activeQuiz._id, payload);
//       setResult(r.data);
//       toast.success('Quiz submitted successfully!');
//     } catch (err) {
//       console.error(err);
//       toast.error('Failed to submit quiz');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Quiz Taking Screen
//   if (activeQuiz) {
//     return (
//       <div className="container page">
//         <h1>{activeQuiz.title}</h1>
//         <p className="muted">{activeQuiz.courseTitle}</p>

//         {activeQuiz.questions.map((q, i) => (
//           <div className="card" key={q._id} style={{ marginBottom: 16 }}>
//             <p><strong>{i + 1}. {q.text}</strong></p>

//             {q.type === 'mcq' ? (
//               q.options.map((option, idx) => (
//                 <label key={idx} style={{ display: 'block', padding: '6px 0' }}>
//                   <input
//                     type="radio"
//                     name={q._id}                    // Important: same name for group
//                     value={option}
//                     checked={answers[q._id] === option}
//                     onChange={(e) => handleAnswer(q._id, e.target.value)}
//                   />
//                   {' '}{option}
//                 </label>
//               ))
//             ) : (
//               <input
//                 className="input"
//                 value={answers[q._id] || ''}
//                 onChange={(e) => handleAnswer(q._id, e.target.value)}
//                 placeholder="Type your answer..."
//               />
//             )}
//           </div>
//         ))}

//         <div style={{ marginTop: 20 }}>
//           {!result && (
//             <button 
//               className="btn btn-primary" 
//               onClick={submitQuiz}
//               disabled={submitting}
//             >
//               {submitting ? 'Submitting...' : 'Submit Quiz'}
//             </button>
//           )}

//           <button 
//             className="btn btn-ghost" 
//             style={{ marginLeft: 12 }}
//             onClick={() => setActiveQuiz(null)}
//           >
//             Back to All Quizzes
//           </button>
//         </div>

//         {result && (
//           <div className="card" style={{ marginTop: 20 }}>
//             <h3>Result: {result.score} / {result.totalMarks} ({result.percent}%)</h3>
//             <h4 style={{ color: result.passed ? 'green' : 'red' }}>
//               {result.passed ? '🎉 Passed!' : '❌ Try Again'}
//             </h4>
//           </div>
//         )}
//       </div>
//     );
//   }

//   // All Quizzes List
//   return (
//     <div className="container page">
//       <h1>My Quizzes</h1>

//       {loading && <Loader />}

//       {!loading && quizzes.length === 0 && (
//         <p className="muted">No quizzes available in your enrolled courses.</p>
//       )}

//       {quizzes.map((q) => (
//         <div className="card" key={q._id} style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <div>
//             <h3>{q.title}</h3>
//             <small className="muted">{q.courseTitle}</small>
//           </div>
//           <button className="btn btn-primary" onClick={() => startQuiz(q._id)}>
//             Start Quiz
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }





import { useEffect, useState } from 'react';
import { enrollmentApi, quizApi } from '../../services';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, CheckCircle2, XCircle, ChevronLeft, Trophy, Clock, Target } from 'lucide-react';

export default function StudentQuizzes() {
  const [quizzes, setQuizzes]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [answers, setAnswers]     = useState({});
  const [result, setResult]       = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [current, setCurrent]     = useState(0); // current question index

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
            (quizRes.data || []).forEach((q) =>
              allQuizzes.push({ ...q, courseTitle: e.course.title })
            );
          }
        }
        setQuizzes(allQuizzes);
      } catch (err) {
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
      setCurrent(0);
    } catch {
      toast.error('Failed to load quiz');
    }
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const submitQuiz = async () => {
    if (!activeQuiz) return;
    setSubmitting(true);
    try {
      const payload = Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer }));
      const r = await quizApi.submit(activeQuiz._id, payload);
      setResult(r.data);
      toast.success('Quiz submitted!');
    } catch {
      toast.error('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const questions   = activeQuiz?.questions || [];
  const totalQ      = questions.length;
  const answered    = Object.keys(answers).length;
  const currentQ    = questions[current];

  // ─── QUIZ TAKING SCREEN ───────────────────────────────────────────────────
  if (activeQuiz) {
    return (
      <div className="min-h-screen bg-[#09090F] text-white p-6 lg:p-10 font-['Inter',sans-serif]">

        {/* Result overlay */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6">
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="rounded-[24px] border border-white/[0.08] bg-[#121826] p-10 text-center max-w-sm w-full">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 ${result.passed ? 'bg-[#10b981]/20' : 'bg-[#FF2E63]/20'}`}>
                  {result.passed
                    ? <Trophy className="w-10 h-10 text-[#10b981]" />
                    : <XCircle className="w-10 h-10 text-[#FF2E63]" />
                  }
                </div>
                <h2 className="text-2xl font-black mb-1">{result.passed ? '🎉 Passed!' : 'Try Again'}</h2>
                <p className="text-white/40 text-sm mb-6">
                  {result.score} / {result.totalMarks} marks &nbsp;·&nbsp; {result.percent}%
                </p>
                <div className="h-2 rounded-full bg-white/[0.06] mb-6 overflow-hidden">
                  <motion.div className="h-full rounded-full"
                    style={{ background: result.passed ? '#10b981' : '#FF2E63' }}
                    initial={{ width: 0 }} animate={{ width: `${result.percent}%` }} transition={{ duration: 0.8 }} />
                </div>
                <button onClick={() => setActiveQuiz(null)}
                  className="w-full py-3 rounded-xl font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg,#FF2E63,#7C5CFF)' }}>
                  Back to Quizzes
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setActiveQuiz(null)}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/[0.08] flex items-center justify-center hover:bg-white/10 transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-white truncate">{activeQuiz.title}</h1>
            <p className="text-sm text-white/40">{activeQuiz.courseTitle}</p>
          </div>
          <div className="text-sm text-white/40 shrink-0">
            {answered}/{totalQ} answered
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="h-1.5 rounded-full bg-white/[0.06] mb-8 overflow-hidden">
          <motion.div className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg,#7C5CFF,#FF2E63)', width: `${totalQ ? (answered / totalQ) * 100 : 0}%` }}
            transition={{ duration: 0.3 }} />
        </div>

        {/* Question navigator dots */}
        <div className="flex flex-wrap gap-2 mb-6">
          {questions.map((q, i) => (
            <button key={q._id} onClick={() => setCurrent(i)}
              className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
                i === current
                  ? 'text-white scale-110' : answers[q._id]
                  ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30'
                  : 'bg-white/5 text-white/40 border border-white/[0.08] hover:bg-white/10'
              }`}
              style={i === current ? { background: 'linear-gradient(135deg,#7C5CFF,#FF2E63)' } : {}}>
              {i + 1}
            </button>
          ))}
        </div>

        {/* Current question card */}
        {currentQ && (
          <AnimatePresence mode="wait">
            <motion.div key={current}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="rounded-[20px] border border-white/[0.08] bg-[#121826] p-6 mb-6">
              <p className="text-xs text-[#7C5CFF] font-semibold uppercase tracking-wider mb-3">
                Question {current + 1} of {totalQ}
              </p>
              <p className="text-[17px] font-semibold text-white leading-relaxed mb-6">
                {currentQ.text}
              </p>

              {currentQ.type === 'mcq' ? (
                <div className="space-y-3">
                  {currentQ.options.map((option, idx) => {
                    const selected = answers[currentQ._id] === option;
                    return (
                      <label key={idx}
                        className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                          selected
                            ? 'border-[#7C5CFF] bg-[#7C5CFF]/10 text-white'
                            : 'border-white/[0.08] bg-white/[0.02] text-white/70 hover:border-white/20 hover:text-white'
                        }`}>
                        <input type="radio" name={currentQ._id} value={option}
                          checked={selected}
                          onChange={() => handleAnswer(currentQ._id, option)}
                          className="hidden" />
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selected ? 'border-[#7C5CFF]' : 'border-white/20'}`}>
                          {selected && <div className="w-2.5 h-2.5 rounded-full bg-[#7C5CFF]" />}
                        </div>
                        <span className="text-[15px]">{option}</span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <input
                  className="w-full bg-[#09090F] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-[#7C5CFF]/50"
                  value={answers[currentQ._id] || ''}
                  onChange={(e) => handleAnswer(currentQ._id, e.target.value)}
                  placeholder="Type your answer..."
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3">
          <button onClick={() => setCurrent((c) => Math.max(0, c - 1))} disabled={current === 0}
            className="flex-1 py-3 rounded-xl border border-white/[0.08] text-sm font-semibold text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-all">
            Previous
          </button>
          {current < totalQ - 1
            ? <button onClick={() => setCurrent((c) => c + 1)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg,#7C5CFF,#FF2E63)' }}>
                Next
              </button>
            : !result && (
                <button onClick={submitQuiz} disabled={submitting}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg,#FF2E63,#7C5CFF)' }}>
                  {submitting ? 'Submitting...' : 'Submit Quiz'}
                </button>
              )
          }
        </div>
      </div>
    );
  }

  // ─── QUIZ LIST ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#09090F] text-white p-6 lg:p-10 font-['Inter',sans-serif]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1">My Quizzes</h1>
        <p className="text-white/40 text-sm">Test your knowledge from enrolled courses</p>
      </motion.div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#7C5CFF] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && quizzes.length === 0 && (
        <div className="text-center py-20 rounded-[20px] border border-white/[0.06] bg-[#121826]">
          <HelpCircle className="w-12 h-12 text-white/20 mx-auto mb-3" />
          <p className="text-white/50 font-medium">No quizzes available</p>
          <p className="text-white/25 text-sm mt-1">Enroll in courses to access their quizzes</p>
        </div>
      )}

      <div className="space-y-3">
        {quizzes.map((q, i) => (
          <motion.div key={q._id}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="rounded-[20px] border border-white/[0.08] bg-[#121826] p-5 flex items-center gap-4 hover:border-[#7C5CFF]/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#7C5CFF]/15 flex items-center justify-center shrink-0">
              <HelpCircle className="w-6 h-6 text-[#7C5CFF]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-[15px] truncate">{q.title}</h3>
              <p className="text-sm text-white/40 mt-0.5">{q.courseTitle}</p>
              <div className="flex items-center gap-3 mt-2">
                {q.questions?.length && (
                  <span className="text-[11px] text-white/30 flex items-center gap-1">
                    <Target className="w-3 h-3" /> {q.questions.length} questions
                  </span>
                )}
                {q.duration && (
                  <span className="text-[11px] text-white/30 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {q.duration} mins
                  </span>
                )}
              </div>
            </div>
            <button onClick={() => startQuiz(q._id)}
              className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: 'linear-gradient(135deg,#7C5CFF,#FF2E63)' }}>
              Start
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}