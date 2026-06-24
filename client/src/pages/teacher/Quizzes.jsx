// import { useEffect, useState } from 'react';
// import { courseApi, quizApi, aiApi } from '../../services';
// import { toast } from 'react-toastify';

// export default function TeacherQuizzes() {
//   const [courses, setCourses] = useState([]);
//   const [courseId, setCourseId] = useState('');
//   const [quizzes, setQuizzes] = useState([]);
//   const [topic, setTopic] = useState('');

//   useEffect(() => { courseApi.myOwned().then(r => setCourses(r.data)); }, []);
//   useEffect(() => { if (courseId) quizApi.byCourse(courseId).then(r => setQuizzes(r.data)); }, [courseId]);

//   const aiGenerate = async () => {
//     const r = await aiApi.generate('quiz', topic);
//     toast.success('AI generated quiz draft — paste into questions below');
//     alert(r.data.reply);
//   };

//   const create = async () => {
//     const r = await quizApi.create({ course: courseId, title: topic || 'Quiz', questions: [
//       { text: 'Sample MCQ?', type: 'mcq', options: ['A', 'B', 'C', 'D'], correctAnswer: 'A', marks: 1 }
//     ] });
//     setQuizzes([...quizzes, r.data]);
//   };

//   return (
//     <div className="container page">
//       <h1>Quizzes</h1>
//       <select className="select" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
//         <option value="">Select course</option>
//         {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
//       </select>
//       {courseId && (
//         <div className="card" style={{ marginTop: 12 }}>
//           <input className="input" placeholder="Topic / title" value={topic} onChange={(e) => setTopic(e.target.value)} />
//           <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
//             <button className="btn btn-ghost" onClick={aiGenerate}>✨ AI generate</button>
//             <button className="btn btn-primary" onClick={create}>+ Create blank quiz</button>
//           </div>
//         </div>
//       )}
//       {quizzes.map(q => (
//         <div className="card" key={q._id} style={{ marginTop: 8 }}>
//           <h3>{q.title}</h3>
//           <p className="muted">{q.questions.length} questions</p>
//         </div>
//       ))}
//     </div>
//   );
// }




/**
 * TeacherQuizzes.jsx
 * Premium quiz management page — cyan/teal theme matching TeacherDashboard.
 * All original logic preserved: courseApi.myOwned(), quizApi.byCourse(),
 * quizApi.create(), aiApi.generate('quiz', topic), toast
 */
import { useEffect, useState } from 'react';
import { courseApi, quizApi, aiApi } from '../../services';
import { toast } from 'react-toastify';

const T = {
  bg:      '#08100F',
  surface: 'rgba(255,255,255,0.04)',
  border:  'rgba(255,255,255,0.07)',
  cyan:    '#06B6D4',
  teal:    '#0D9488',
  emerald: '#10B981',
  amber:   '#F59E0B',
  violet:  '#8B5CF6',
  rose:    '#F43F5E',
};

function Icon({ d, size = 'w-5 h-5', className = '', style }) {
  return (
    <svg className={`${size} ${className}`} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

function Skeleton({ className = '' }) {
  return <div className={`rounded-xl animate-pulse ${className}`} style={{ background: 'rgba(255,255,255,0.06)' }} />;
}

// ─── Difficulty badge ──────────────────────────────────────────────────────
function DiffBadge({ count }) {
  const level = count <= 5 ? 'Easy' : count <= 15 ? 'Medium' : 'Hard';
  const cfg = {
    Easy:   { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', color: '#6EE7B7' },
    Medium: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)', color: '#FCD34D' },
    Hard:   { bg: 'rgba(244,63,94,0.12)',  border: 'rgba(244,63,94,0.25)',  color: '#FDA4AF' },
  }[level];
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}>
      {level}
    </span>
  );
}

// ─── Quiz card ─────────────────────────────────────────────────────────────
function QuizCard({ quiz, onDelete }) {
  const [open, setOpen] = useState(false);
  const qCount = quiz.questions?.length || 0;
  return (
    <div className="rounded-2xl overflow-hidden transition-all duration-200 hover:border-cyan-500/30"
      style={{ background: T.surface, border: `1px solid ${T.border}` }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 24px rgba(6,182,212,0.1)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; }}>

      <div className="flex items-start gap-4 p-5">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
          style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.22)' }}>⚡</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-[14px] font-semibold text-white/85 truncate">{quiz.title}</h3>
            <DiffBadge count={qCount} />
            {quiz.isPublished && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(16,185,129,0.15)', color: '#6EE7B7' }}>LIVE</span>
            )}
          </div>
          <div className="flex items-center gap-4 text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
            <span className="flex items-center gap-1">
              <Icon d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                size="w-3.5 h-3.5" /> {qCount} question{qCount !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1">
              <Icon d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" size="w-3.5 h-3.5" />
              {quiz.timeLimit ? `${quiz.timeLimit} min` : 'No limit'}
            </span>
            {quiz.attempts > 0 && (
              <span className="flex items-center gap-1">
                <Icon d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  size="w-3.5 h-3.5" /> {quiz.attempts} attempts
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => setOpen(!open)}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-white/10"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <Icon d={open ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} size="w-4 h-4" style={{ color: 'rgba(255,255,255,0.4)' }} />
          </button>
          <button onClick={() => onDelete && onDelete(quiz._id)}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-rose-500/15"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <Icon d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              size="w-4 h-4" style={{ color: T.rose }} />
          </button>
        </div>
      </div>

      {/* Expandable questions preview */}
      {open && quiz.questions?.length > 0 && (
        <div className="px-5 pb-4 pt-0" style={{ borderTop: `1px solid ${T.border}` }}>
          <p className="text-[10px] font-bold uppercase tracking-widest pt-4 pb-2" style={{ color: 'rgba(255,255,255,0.25)' }}>Questions preview</p>
          <div className="space-y-2">
            {quiz.questions.slice(0, 3).map((q, i) => (
              <div key={i} className="flex items-start gap-3 px-3 py-2.5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0"
                  style={{ background: 'rgba(6,182,212,0.2)', color: '#67E8F9' }}>{i + 1}</span>
                <div className="min-w-0">
                  <p className="text-[12px] text-white/65 truncate">{q.text || 'Question'}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.28)' }}>
                    {q.type?.toUpperCase() || 'MCQ'} · {q.marks || 1} mark{(q.marks || 1) > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            ))}
            {quiz.questions.length > 3 && (
              <p className="text-[11px] text-center" style={{ color: 'rgba(255,255,255,0.28)' }}>
                +{quiz.questions.length - 3} more questions
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── AI Draft modal ────────────────────────────────────────────────────────
function AIDraftModal({ draft, onClose }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: '#0c1a18', border: `1px solid ${T.border}` }}
        onClick={(e) => e.stopPropagation()}>

        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${T.border}` }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
              style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.25)' }}>✨</div>
            <div>
              <h3 className="text-[14px] font-bold text-white">AI-generated quiz draft</h3>
              <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Review and use as a starting point</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            <Icon d="M6 18L18 6M6 6l12 12" size="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.5)' }} />
          </button>
        </div>

        <div className="px-5 py-4 max-h-72 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          <pre className="text-[12px] whitespace-pre-wrap font-mono leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{draft}</pre>
        </div>

        <div className="flex gap-2 px-5 py-4" style={{ borderTop: `1px solid ${T.border}` }}>
          <button onClick={copy}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
            style={{ background: copied ? 'rgba(16,185,129,0.2)' : 'rgba(6,182,212,0.15)', border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'rgba(6,182,212,0.25)'}`, color: copied ? '#6EE7B7' : '#67E8F9' }}>
            <Icon d={copied ? 'M5 13l4 4L19 7' : 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'} size="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy to clipboard'}
          </button>
          <button onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-[13px] font-medium transition-colors hover:bg-white/10"
            style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════
export default function TeacherQuizzes() {
  const [courses,      setCourses]      = useState([]);
  const [courseId,     setCourseId]     = useState('');
  const [quizzes,      setQuizzes]      = useState([]);
  const [topic,        setTopic]        = useState('');
  const [loadingQ,     setLoadingQ]     = useState(false);
  const [aiLoading,    setAiLoading]    = useState(false);
  const [creating,     setCreating]     = useState(false);
  const [aiDraft,      setAiDraft]      = useState(null);
  const [search,       setSearch]       = useState('');

  useEffect(() => { courseApi.myOwned().then((r) => setCourses(r.data)); }, []);

  useEffect(() => {
    if (!courseId) { setQuizzes([]); return; }
    setLoadingQ(true);
    quizApi.byCourse(courseId)
      .then((r) => setQuizzes(r.data))
      .finally(() => setLoadingQ(false));
  }, [courseId]);

  const aiGenerate = async () => {
    if (!topic.trim()) { toast.error('Enter a topic first'); return; }
    setAiLoading(true);
    try {
      const r = await aiApi.generate('quiz', topic);
      setAiDraft(r.data.reply);
      toast.success('AI quiz draft ready!');
    } catch {
      toast.error('AI generation failed');
    } finally {
      setAiLoading(false);
    }
  };

  const create = async () => {
    if (!courseId) { toast.error('Select a course first'); return; }
    setCreating(true);
    try {
      const r = await quizApi.create({
        course: courseId,
        title: topic.trim() || 'New Quiz',
        questions: [{ text: 'Sample MCQ?', type: 'mcq', options: ['A', 'B', 'C', 'D'], correctAnswer: 'A', marks: 1 }],
      });
      setQuizzes((prev) => [r.data, ...prev]);
      setTopic('');
      toast.success('Quiz created!');
    } catch {
      toast.error('Failed to create quiz');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = (id) => {
    setQuizzes((prev) => prev.filter((q) => q._id !== id));
    toast.success('Quiz removed');
  };

  const selectedCourse = courses.find((c) => c._id === courseId);
  const filtered = quizzes.filter((q) => !search.trim() || q.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen" style={{ background: T.bg, color: '#fff' }}>

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[500px] rounded-full blur-[140px]"
          style={{ background: 'rgba(6,182,212,0.07)' }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px]"
          style={{ background: 'rgba(13,148,136,0.05)' }} />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-7">

        {/* Page header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: T.cyan }}>Instructor</span>
              <span style={{ color: 'rgba(255,255,255,0.15)' }}>/</span>
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>Quizzes</span>
            </div>
            <h1 className="text-[24px] font-bold text-white tracking-tight">Quiz Manager</h1>
            <p className="text-[13px] mt-1" style={{ color: 'rgba(255,255,255,0.38)' }}>
              Create, manage, and AI-generate quizzes for your courses.
            </p>
          </div>
          {quizzes.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl shrink-0"
              style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
              <span className="text-[13px] font-bold" style={{ color: T.cyan }}>{quizzes.length}</span>
              <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.4)' }}>quiz{quizzes.length !== 1 ? 'zes' : ''}</span>
            </div>
          )}
        </div>

        {/* Course selector */}
        <div className="rounded-2xl p-5" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
          <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest mb-3"
            style={{ color: 'rgba(255,255,255,0.35)' }}>
            <Icon d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              size="w-3.5 h-3.5" /> Select course
          </label>
          <div className="relative">
            <select
              className="w-full rounded-xl px-4 py-3 text-[14px] text-white outline-none appearance-none cursor-pointer transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: courseId ? '#fff' : 'rgba(255,255,255,0.35)' }}
              onFocus={(e) => { e.target.style.borderColor = T.cyan; e.target.style.boxShadow = `0 0 0 3px rgba(6,182,212,0.12)`; }}
              onBlur={(e)  => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}>
              <option value="" style={{ background: '#0c1a18' }}>— Choose a course —</option>
              {courses.map((c) => (
                <option key={c._id} value={c._id} style={{ background: '#0c1a18' }}>
                  {c.title}{c.isPublished ? ' ✓' : ' (draft)'}
                </option>
              ))}
            </select>
            <Icon d="M19 9l-7 7-7-7" size="w-4 h-4"
              className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'rgba(255,255,255,0.4)' }} />
          </div>

          {selectedCourse && (
            <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-xl"
              style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)' }}>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: T.emerald }} />
              <span className="text-[12px] font-medium" style={{ color: '#A5F3FC' }}>{selectedCourse.title}</span>
              {selectedCourse.isPublished
                ? <span className="ml-auto text-[10px] font-bold text-emerald-400">● LIVE</span>
                : <span className="ml-auto text-[10px] font-bold text-amber-400">● DRAFT</span>}
            </div>
          )}
        </div>

        {/* Create panel — only shown when course selected */}
        {courseId && (
          <div className="rounded-2xl overflow-hidden" style={{ background: T.surface, border: `1px solid ${T.border}` }}>
            <div className="px-5 py-4" style={{ borderBottom: `1px solid ${T.border}`, background: 'rgba(255,255,255,0.02)' }}>
              <h2 className="text-[14px] font-bold text-white">Create quiz</h2>
              <p className="text-[12px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Enter a topic/title and create manually or let AI generate a draft
              </p>
            </div>

            <div className="px-5 py-5 space-y-4">
              {/* Topic input */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Icon d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    size="w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
                </div>
                <input
                  className="w-full rounded-xl pl-11 pr-4 py-3.5 text-[14px] text-white outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={(e) => { e.target.style.borderColor = T.cyan; e.target.style.boxShadow = `0 0 0 3px rgba(6,182,212,0.12)`; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                  placeholder="Quiz topic or title (e.g. React Hooks, Data Structures...)"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && create()}
                />
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* AI Generate */}
                <button onClick={aiGenerate} disabled={aiLoading || !topic.trim()}
                  className="group flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-semibold text-[13px] transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(6,182,212,0.3))', border: '1px solid rgba(139,92,246,0.35)' }}>
                  {aiLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span style={{ color: '#C4B5FD' }}>Generating…</span>
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      <span style={{ color: '#C4B5FD' }}>AI Generate quiz</span>
                    </>
                  )}
                </button>

                {/* Create blank */}
                <button onClick={create} disabled={creating}
                  className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-semibold text-[13px] text-white transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: creating ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #0D9488, #06B6D4)', boxShadow: creating ? 'none' : '0 4px 20px rgba(6,182,212,0.3)' }}>
                  {creating ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creating…
                    </>
                  ) : (
                    <>
                      <Icon d="M12 4v16m8-8H4" size="w-4 h-4" />
                      Create blank quiz
                    </>
                  )}
                </button>
              </div>

              {/* AI hint */}
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.15)' }}>
                <span className="text-sm shrink-0">💡</span>
                <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  AI generates a draft based on your topic. Review and customise before publishing to students.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quiz list */}
        {courseId && (
          <div className="space-y-4">
            {/* List header */}
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[15px] font-bold text-white">
                {loadingQ ? 'Loading quizzes…' : `${filtered.length} quiz${filtered.length !== 1 ? 'zes' : ''}`}
                {selectedCourse && (
                  <span className="ml-2 text-[13px] font-normal" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    in {selectedCourse.title}
                  </span>
                )}
              </h2>
              {quizzes.length > 2 && (
                <div className="relative shrink-0 w-52">
                  <Icon d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0" size="w-4 h-4"
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: 'rgba(255,255,255,0.3)' }} />
                  <input
                    className="w-full rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-white outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                    placeholder="Search quizzes…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Loading skeletons */}
            {loadingQ ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-20" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 rounded-2xl"
                style={{ border: '2px dashed rgba(255,255,255,0.07)' }}>
                <span className="text-5xl mb-4 opacity-30">⚡</span>
                <h3 className="text-[15px] font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {search ? 'No matching quizzes' : 'No quizzes yet'}
                </h3>
                <p className="text-[13px] text-center max-w-xs" style={{ color: 'rgba(255,255,255,0.28)' }}>
                  {search ? 'Try a different search term' : 'Create your first quiz using the panel above'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((q) => (
                  <QuizCard key={q._id} quiz={q} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* No course selected state */}
        {!courseId && (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl"
            style={{ border: '2px dashed rgba(255,255,255,0.07)' }}>
            <span className="text-5xl mb-4 opacity-30">📚</span>
            <h3 className="text-[16px] font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>Select a course first</h3>
            <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.28)' }}>Choose a course above to view and manage its quizzes</p>
          </div>
        )}

      </div>

      {/* AI Draft Modal */}
      {aiDraft && <AIDraftModal draft={aiDraft} onClose={() => setAiDraft(null)} />}
    </div>
  );
}