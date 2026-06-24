// import { Link } from 'react-router-dom';
// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchCourses } from '../redux/slices/courseSlice';
// import CourseCard from '../components/CourseCard.jsx';

// export default function Home() {
//   const dispatch = useDispatch();
//   const { items } = useSelector((s) => s.courses);
//   useEffect(() => { dispatch(fetchCourses({ published: 'true' })); }, [dispatch]);

//   return (
//     <>
//       <section className="hero">
//         <div className="container">
//           <h1>Learn anything with<br /><span>AI by your side.</span></h1>
//           <p>EduForge is an AI-powered LMS with smart tutoring, RAG-based notes chat, agentic learning planners, and a full marketplace of expert-led courses.</p>
//           <div className="hero-actions">
//             <Link to="/courses" className="btn btn-primary">Explore courses</Link>
//             <Link to="/register" className="btn btn-ghost">Start free</Link>
//           </div>
//         </div>
//       </section>

//       <section className="section">
//         <div className="container">
//           <h2>Featured courses</h2>
//           <p className="sub">Hand-picked programs from top instructors.</p>
//           <div className="course-grid">
//             {items.slice(0, 8).map((c) => <CourseCard key={c._id} course={c} />)}
//           </div>
//         </div>
//       </section>

//       <section className="section">
//         <div className="container">
//           <h2>What makes EduForge different</h2>
//           <div className="cards-row">
//             <div className="card"><h3>AI Tutor</h3><p className="muted">Ask anything, get explanations, notes, quizzes, roadmaps — instantly.</p></div>
//             <div className="card"><h3>Chat with PDFs</h3><p className="muted">Upload your textbook — ask questions and get cited answers.</p></div>
//             <div className="card"><h3>Agentic Planner</h3><p className="muted">Tell us your goal, our agent builds a study plan that adapts to you.</p></div>
//             <div className="card"><h3>Certificates</h3><p className="muted">Earn verifiable certificates on completion.</p></div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }





import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../redux/slices/courseSlice';
import CourseCard from '../components/CourseCard.jsx';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';

// ─── Reusable animation variants ───────────────────────────────────────────
const fadeUp = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } };
const stagger = (delayChildren = 0.1) => ({ hidden: {}, visible: { transition: { staggerChildren: delayChildren } } });

function AnimateWhenVisible({ children, variants = fadeUp, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} variants={variants} initial="hidden" animate={inView ? 'visible' : 'hidden'} className={className}>
      {children}
    </motion.div>
  );
}

// ─── Animated Counter ──────────────────────────────────────────────────────
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = parseInt(target.replace(/\D/g, ''));
    const duration = 1800;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  const display = target.includes('M') ? `${(count / 1000000).toFixed(1)}M` : target.includes('K') ? `${Math.round(count / 1000)}K` : count;
  return <span ref={ref}>{display}{suffix}</span>;
}

// ─── AI Dashboard Mockup ───────────────────────────────────────────────────
function AIDashboardMockup() {
  const [activeTab, setActiveTab] = useState('tutor');
  const [typing, setTyping] = useState(true);
  const typedText = "Explain transformer attention mechanism with a visual example";
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      setDisplayed(typedText.slice(0, i));
      if (i >= typedText.length) { clearInterval(t); setTyping(false); }
    }, 40);
    return () => clearInterval(t);
  }, []);

  const tabs = [
    { id: 'tutor', label: 'AI Tutor', icon: '🤖' },
    { id: 'pdf', label: 'PDF Chat', icon: '📄' },
    { id: 'road', label: 'Roadmap', icon: '🗺️' },
    { id: 'code', label: 'Code', icon: '💻' },
  ];

  return (
    <div className="relative w-full max-w-[560px] mx-auto">
      {/* Glow blobs */}
      <div className="absolute -inset-6 bg-gradient-to-br from-violet-600/20 via-cyan-500/10 to-fuchsia-600/20 blur-3xl rounded-3xl pointer-events-none" />

      {/* Main dashboard card */}
      <div className="relative rounded-2xl border border-white/10 bg-[#0d0d14]/90 backdrop-blur-xl overflow-hidden shadow-2xl">
        {/* Top bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.07] bg-white/[0.02]">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <span className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="flex-1 text-center text-[11px] text-white/30 font-mono">eduforge.ai — Learning OS</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-3 pt-3">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${activeTab === t.id ? 'bg-violet-600 text-white' : 'text-white/40 hover:text-white/70'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div className="p-4 space-y-3 min-h-[320px]">
          <AnimatePresence mode="wait">
            {activeTab === 'tutor' && (
              <motion.div key="tutor" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                {/* User message */}
                <div className="flex justify-end">
                  <div className="max-w-[75%] bg-violet-600/30 border border-violet-500/30 rounded-2xl rounded-tr-sm px-3 py-2 text-[12px] text-white/90">
                    {displayed}{typing && <span className="animate-pulse">|</span>}
                  </div>
                </div>
                {/* AI response */}
                {!typing && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-[10px] shrink-0 mt-0.5">AI</div>
                    <div className="bg-white/[0.05] border border-white/10 rounded-2xl rounded-tl-sm px-3 py-2 text-[12px] text-white/80 space-y-2">
                      <p>The <span className="text-cyan-400 font-semibold">attention mechanism</span> lets each token "look at" every other token in the sequence.</p>
                      <div className="bg-white/5 rounded-lg p-2 font-mono text-[10px] text-green-400">
                        <div>Q = XW_Q &nbsp; K = XW_K &nbsp; V = XW_V</div>
                        <div className="text-cyan-400 mt-1">Attention(Q,K,V) = softmax(QKᵀ/√d)V</div>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {['Quiz me', 'Show diagram', 'Deeper dive'].map(a => (
                          <span key={a} className="px-2 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-[10px] text-violet-300 cursor-pointer hover:bg-violet-500/30 transition-colors">{a}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                {/* Progress bar */}
                <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.07]">
                  <div className="flex justify-between text-[10px] text-white/40 mb-1.5">
                    <span>Module 3 — Transformers</span><span>68%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '68%' }} transition={{ duration: 1.2, delay: 0.5 }} className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full" />
                  </div>
                </div>
              </motion.div>
            )}
            {activeTab === 'pdf' && (
              <motion.div key="pdf" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center text-sm">📄</div>
                  <div>
                    <div className="text-[11px] text-white/80 font-medium">deep_learning_textbook.pdf</div>
                    <div className="text-[10px] text-white/30">842 pages · indexed ✓</div>
                  </div>
                  <span className="ml-auto text-[10px] text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">Ready</span>
                </div>
                <div className="space-y-1.5">
                  {[
                    { q: "What is backpropagation?", a: "Backpropagation computes gradients by applying the chain rule backwards through the network. (p.142)" },
                    { q: "Explain dropout regularization", a: "Dropout randomly zeros activations during training, reducing overfitting. (p.217)" },
                  ].map((item, i) => (
                    <div key={i} className="bg-white/[0.03] rounded-xl p-2.5 border border-white/[0.06] space-y-1">
                      <div className="text-[11px] text-cyan-400">Q: {item.q}</div>
                      <div className="text-[11px] text-white/60">{item.a}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            {activeTab === 'road' && (
              <motion.div key="road" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                <div className="text-[11px] text-white/50 mb-2">AI-generated roadmap · ML Engineer</div>
                {[
                  { step: 1, title: 'Python & Math Foundations', status: 'done', weeks: 'Week 1–3' },
                  { step: 2, title: 'ML Algorithms & Sklearn', status: 'done', weeks: 'Week 4–6' },
                  { step: 3, title: 'Deep Learning & PyTorch', status: 'active', weeks: 'Week 7–10' },
                  { step: 4, title: 'Transformers & LLMs', status: 'upcoming', weeks: 'Week 11–14' },
                  { step: 5, title: 'MLOps & Deployment', status: 'upcoming', weeks: 'Week 15–18' },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${item.status === 'active' ? 'bg-violet-600/15 border-violet-500/40' : item.status === 'done' ? 'bg-white/[0.03] border-white/[0.05]' : 'bg-white/[0.02] border-white/[0.04] opacity-50'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${item.status === 'done' ? 'bg-green-500' : item.status === 'active' ? 'bg-violet-500' : 'bg-white/10'}`}>
                      {item.status === 'done' ? '✓' : item.step}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-white/80 font-medium truncate">{item.title}</div>
                      <div className="text-[10px] text-white/30">{item.weeks}</div>
                    </div>
                    {item.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse shrink-0" />}
                  </motion.div>
                ))}
              </motion.div>
            )}
            {activeTab === 'code' && (
              <motion.div key="code" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                <div className="bg-[#0a0a12] rounded-xl border border-white/10 p-3 font-mono text-[11px]">
                  <div className="text-white/30 mb-2 text-[10px]">// AI Mentor suggestion</div>
                  <div><span className="text-purple-400">def</span> <span className="text-yellow-400">attention</span><span className="text-white/70">(Q, K, V):</span></div>
                  <div className="pl-4 text-white/60">d_k = Q.shape[-1]</div>
                  <div className="pl-4"><span className="text-cyan-400">scores</span> = <span className="text-white/70">Q @ K.T / d_k**0.5</span></div>
                  <div className="pl-4"><span className="text-cyan-400">weights</span> = <span className="text-purple-400">softmax</span>(scores)</div>
                  <div className="pl-4 text-green-400">return weights @ V</div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 bg-green-500/10 border border-green-500/20 rounded-xl p-2.5">
                    <div className="text-[10px] text-green-400 font-medium mb-0.5">✓ Tests Passed</div>
                    <div className="text-[10px] text-white/40">4/4 test cases</div>
                  </div>
                  <div className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl p-2.5">
                    <div className="text-[10px] text-white/60 font-medium mb-0.5">Score</div>
                    <div className="text-[10px] text-violet-400">98/100 · Excellent</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom analytics bar */}
        <div className="grid grid-cols-3 border-t border-white/[0.06] divide-x divide-white/[0.06]">
          {[['⚡ Streak', '14 days'], ['📚 XP Today', '340 pts'], ['🏆 Rank', '#127']].map(([label, val]) => (
            <div key={label} className="px-3 py-2 text-center">
              <div className="text-[10px] text-white/30">{label}</div>
              <div className="text-[11px] font-semibold text-white/80">{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating cert card */}
      <motion.div initial={{ opacity: 0, x: 40, y: 10 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 1.2, duration: 0.7 }}
        className="absolute -right-4 -bottom-6 bg-gradient-to-br from-[#1a1030] to-[#0d0d1a] border border-violet-500/30 rounded-xl p-3 shadow-xl w-[160px]">
        <div className="text-[9px] text-violet-400 font-medium mb-1">🎓 Certificate Earned</div>
        <div className="text-[11px] text-white font-semibold leading-tight">Deep Learning Mastery</div>
        <div className="text-[9px] text-white/40 mt-1">Issued · EduForge AI</div>
        <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-4/5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" />
        </div>
      </motion.div>

      {/* Floating online indicator */}
      <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.4 }}
        className="absolute -left-4 top-16 bg-[#0d1a12] border border-green-500/30 rounded-xl px-3 py-2 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[11px] text-white/70">AI Tutor <span className="text-green-400">Online</span></span>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Agent Card ────────────────────────────────────────────────────────────
const agents = [
  { name: 'AI Tutor', desc: 'Explains concepts, answers questions, generates examples in real-time', icon: '🤖', color: 'from-violet-500 to-purple-600' },
  { name: 'Career Agent', desc: 'Builds your career roadmap and tracks market-fit skills', icon: '🎯', color: 'from-cyan-500 to-blue-600' },
  { name: 'Coding Mentor', desc: 'Reviews your code, fixes bugs, teaches best practices', icon: '💻', color: 'from-emerald-500 to-teal-600' },
  { name: 'Interview Coach', desc: 'Mock interviews, STAR answers, live feedback on responses', icon: '🎙️', color: 'from-orange-500 to-amber-600' },
  { name: 'Study Planner', desc: 'Adaptive schedules based on your goals and calendar', icon: '📅', color: 'from-pink-500 to-rose-600' },
  { name: 'Revision Agent', desc: 'Spaced repetition flashcards auto-generated from your notes', icon: '🔁', color: 'from-indigo-500 to-blue-700' },
  { name: 'Quiz Generator', desc: 'Instant quizzes from any topic, PDF, or lecture you upload', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
  { name: 'Learning Recommender', desc: 'Surfaces the next best resource based on your progress', icon: '🧠', color: 'from-fuchsia-500 to-violet-700' },
];

function AgentCard({ agent, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div variants={fadeUp} onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      className="relative group rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-5 cursor-pointer overflow-hidden transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]">
      {/* Gradient glow on hover */}
      <motion.div className={`absolute inset-0 bg-gradient-to-br ${agent.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`} />
      
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-xl shadow-lg`}>
          {agent.icon}
        </div>
        <span className="flex items-center gap-1 text-[10px] text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Online
        </span>
      </div>

      <h3 className="text-[15px] font-semibold text-white mb-1.5">{agent.name}</h3>
      <p className="text-[12px] text-white/50 leading-relaxed mb-4">{agent.desc}</p>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white/[0.04] rounded-lg p-2 text-center">
          <div className="text-[11px] font-bold text-white">99.9%</div>
          <div className="text-[9px] text-white/30">Accuracy</div>
        </div>
        <div className="bg-white/[0.04] rounded-lg p-2 text-center">
          <div className="text-[11px] font-bold text-cyan-400">&lt;1s</div>
          <div className="text-[9px] text-white/30">Response</div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Bento Feature Card ────────────────────────────────────────────────────
const features = [
  { title: 'AI Tutor', desc: 'Ask anything. Get step-by-step explanations, analogies, worked examples — instantly.', icon: '🤖', span: 'md:col-span-2', accent: 'violet', preview: (
    <div className="mt-3 bg-black/30 rounded-xl p-3 text-[11px] font-mono">
      <span className="text-white/30">user:</span> <span className="text-white/70">Why does gradient vanishing happen?</span>
      <br /><span className="text-violet-400">AI:</span> <span className="text-white/60">As gradients flow backward through many layers, multiplying small values shrinks them toward zero...</span>
    </div>
  )},
  { title: 'Chat with PDFs', desc: 'Upload any textbook or paper. Chat with it. Get cited answers.', icon: '📄', span: '', accent: 'cyan' },
  { title: 'Quiz Generator', desc: 'Instant MCQs, fill-in-the-blanks, and concept checks from any topic.', icon: '⚡', span: '', accent: 'amber' },
  { title: 'Career Roadmap', desc: 'Goal-aware AI builds your learning path from zero to job-ready.', icon: '🗺️', span: 'md:col-span-2', accent: 'emerald', preview: (
    <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
      {['Python', '→ ML', '→ DL', '→ LLMs', '→ MLOps', '→ Job ✓'].map((s, i) => (
        <span key={i} className={`shrink-0 px-2 py-1 rounded-lg text-[10px] font-medium border ${i === 3 ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-white/5 border-white/10 text-white/50'}`}>{s}</span>
      ))}
    </div>
  )},
  { title: 'Coding Mentor', desc: 'Write code. Get real-time review, debug assistance, and pattern suggestions.', icon: '💻', span: '', accent: 'blue' },
  { title: 'Interview Prep', desc: 'Practice FAANG-style interviews with AI interviewers that give live scoring.', icon: '🎙️', span: '', accent: 'pink' },
  { title: 'Resume Builder', desc: 'AI writes your resume from your course completions and project portfolio.', icon: '📋', span: '', accent: 'orange' },
  { title: 'Certificates', desc: 'Blockchain-verifiable credentials for every course you complete.', icon: '🎓', span: '', accent: 'fuchsia' },
  { title: 'Learning Analytics', desc: 'Depth heatmaps, weak-spot detection, and time-to-mastery forecasts.', icon: '📊', span: 'md:col-span-2', accent: 'indigo', preview: (
    <div className="mt-3 grid grid-cols-4 gap-1.5">
      {[85, 92, 67, 78, 95, 61, 88, 74].map((v, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div className="w-full bg-white/5 rounded overflow-hidden h-8 flex items-end">
            <div style={{ height: `${v}%` }} className="w-full bg-indigo-500/60 rounded" />
          </div>
          <span className="text-[8px] text-white/20">{v}%</span>
        </div>
      ))}
    </div>
  )},
  { title: 'Assignment Evaluator', desc: 'Submit any assignment. Get rubric-based feedback, grade estimate, and improvement tips.', icon: '📝', span: '', accent: 'teal' },
  { title: 'Smart Recommendations', desc: 'Surfaces the right resource at the right moment based on your entire learning history.', icon: '🧠', span: '', accent: 'rose' },
];

const accentMap = {
  violet: 'bg-violet-500/10 border-violet-500/20 text-violet-400 hover:border-violet-500/50',
  cyan: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:border-cyan-500/50',
  amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:border-amber-500/50',
  emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:border-emerald-500/50',
  blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:border-blue-500/50',
  pink: 'bg-pink-500/10 border-pink-500/20 text-pink-400 hover:border-pink-500/50',
  orange: 'bg-orange-500/10 border-orange-500/20 text-orange-400 hover:border-orange-500/50',
  fuchsia: 'bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400 hover:border-fuchsia-500/50',
  indigo: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:border-indigo-500/50',
  teal: 'bg-teal-500/10 border-teal-500/20 text-teal-400 hover:border-teal-500/50',
  rose: 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:border-rose-500/50',
};

// ─── Learning Journey ──────────────────────────────────────────────────────
const journeySteps = [
  { icon: '🎯', title: 'Set Your Goal', desc: 'Tell EduForge what you want to become — ML Engineer, Full Stack Dev, Data Scientist.' },
  { icon: '🤖', title: 'AI Builds Your Plan', desc: 'Your personal AI agent generates a week-by-week learning roadmap in seconds.' },
  { icon: '📚', title: 'Learn with AI', desc: 'Study with interactive AI tutors who explain, quiz, and adapt to your pace.' },
  { icon: '💪', title: 'Practice & Build', desc: 'Apply knowledge via coding challenges, projects, and AI-reviewed assignments.' },
  { icon: '🎓', title: 'Earn Certificates', desc: 'Complete milestones and earn verifiable certificates recognized by employers.' },
  { icon: '🚀', title: 'Land the Job', desc: 'Use your AI-built resume and interview practice to land your dream role.' },
];

// ─── Testimonials ──────────────────────────────────────────────────────────
const testimonials = [
  {
    name: 'Aryan Mehta',
    role: 'Software Engineer @ Google',
    avatar: 'AM',
    gradient: 'from-violet-500 to-fuchsia-500',
    text: "EduForge's AI Tutor explained concepts I struggled with for months — in minutes. The coding mentor caught mistakes my human instructor missed. This isn't an LMS, it's a learning OS.",
    tags: ['DSA', 'System Design', 'Got Offer'],
    stars: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'CS Final Year, IIT Bombay',
    avatar: 'PS',
    gradient: 'from-cyan-500 to-blue-500',
    text: "I used the PDF Chat to study my entire ML textbook interactively. The quiz generator helped me ace my exams. My CGPA jumped from 7.2 to 9.1 in one semester.",
    tags: ['ML', 'PDF Chat', 'CGPA 9.1'],
    stars: 5,
  },
  {
    name: 'Rahul Verma',
    role: 'Career Switcher → Data Scientist',
    avatar: 'RV',
    gradient: 'from-emerald-500 to-teal-500',
    text: "I switched from banking to data science in 6 months using EduForge's career roadmap. The AI planner kept me on track. I got 3 job offers after completing the AI track.",
    tags: ['Career Switch', '6 months', '3 Offers'],
    stars: 5,
  },
  {
    name: 'Sneha Patel',
    role: 'Product Manager, ex-Infosys',
    avatar: 'SP',
    gradient: 'from-orange-500 to-amber-500',
    text: "Even as a non-technical PM, the AI Tutor made ML concepts approachable. The interview coach helped me crack a FAANG PM role. The adaptive learning is genuinely magical.",
    tags: ['Non-Tech', 'FAANG PM', 'Interview Prep'],
    stars: 5,
  },
];

// ─── MAIN HOME COMPONENT ──────────────────────────────────────────────────
export default function Home() {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.courses);
  useEffect(() => { dispatch(fetchCourses({ published: 'true' })); }, [dispatch]);

  return (
    <div className="bg-[#060609] text-white min-h-screen overflow-x-hidden">

      {/* ── Aurora background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-fuchsia-600/8 rounded-full blur-[120px]" />
      </div>

      {/* ══════════════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div initial="hidden" animate="visible" variants={stagger(0.12)} className="space-y-8">
            {/* Badge */}
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-[13px] font-medium">
                <span className="text-base">🚀</span> AI-Powered Learning Operating System
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div variants={fadeUp} className="space-y-2">
              <h1 className="text-5xl lg:text-[64px] font-bold leading-[1.08] tracking-tight">
                Learn Faster With
              </h1>
              <h1 className="text-5xl lg:text-[64px] font-bold leading-[1.08] tracking-tight bg-gradient-to-r from-violet-400 via-cyan-400 to-fuchsia-400 bg-clip-text text-transparent" style={{ backgroundSize: '200%', animation: 'gradientShift 4s ease infinite' }}>
                AI Agents
              </h1>
              <h1 className="text-5xl lg:text-[64px] font-bold leading-[1.08] tracking-tight">
                That Think,<br />Teach &amp; Guide.
              </h1>
            </motion.div>

            {/* Sub */}
            <motion.p variants={fadeUp} className="text-lg text-white/55 leading-relaxed max-w-[520px]">
              Master any skill using AI Tutors, PDF Chat, Career Roadmaps, Coding Mentors, Interview Coaches, and expert-led courses — all in one operating system for learning.
            </motion.p>

            {/* Buttons */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Link to="/register" className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[15px] text-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 transition-all duration-300 group-hover:from-violet-500 group-hover:to-fuchsia-500" />
                <span className="relative">Start Learning Free</span>
                <span className="relative text-lg">→</span>
              </Link>
              <Link to="/courses" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[15px] text-white/80 border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/25 transition-all duration-300">
                Explore Courses
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-6 pt-2">
              {[
                { val: '50000', label: 'Students', suffix: 'K+', raw: '50K+' },
                { val: '500', label: 'Courses', suffix: '+', raw: '500+' },
                { val: '1000000', label: 'AI Conversations', suffix: 'M+', raw: '1M+' },
                { val: '95', label: 'Completion Rate', suffix: '%', raw: '95%' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-[22px] font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                    <Counter target={s.raw} suffix={s.suffix} />
                  </div>
                  <div className="text-[11px] text-white/40 mt-0.5">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Dashboard */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} className="relative lg:pl-8">
            <AIDashboardMockup />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 2 — AI AGENTS
      ══════════════════════════════════════════════════ */}
      <section className="relative py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimateWhenVisible className="text-center mb-16">
            <p className="text-violet-400 font-medium text-[13px] tracking-widest uppercase mb-4">Your AI Learning Team</p>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">8 AI Agents. One Goal.</h2>
            <p className="text-white/45 text-lg max-w-xl mx-auto">Always online. Always learning your patterns. Always ready to teach, coach, and guide you forward.</p>
          </AnimateWhenVisible>

          <motion.div ref={useRef(null)} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}
            variants={stagger(0.07)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {agents.map((agent, i) => <AgentCard key={agent.name} agent={agent} index={i} />)}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 3 — FEATURES BENTO
      ══════════════════════════════════════════════════ */}
      <section className="relative py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimateWhenVisible className="text-center mb-16">
            <p className="text-cyan-400 font-medium text-[13px] tracking-widest uppercase mb-4">Everything You Need</p>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Built for Serious Learners</h2>
            <p className="text-white/45 text-lg max-w-xl mx-auto">Every tool you need to go from curious to career-ready, powered by AI at every step.</p>
          </AnimateWhenVisible>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger(0.06)}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-auto">
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeUp}
                className={`${f.span || ''} group relative rounded-2xl border bg-white/[0.03] p-5 overflow-hidden transition-all duration-300 cursor-pointer ${accentMap[f.accent] || accentMap.violet} hover:bg-white/[0.06]`}>
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="text-[15px] font-semibold text-white mb-1.5">{f.title}</h3>
                <p className="text-[12px] text-white/50 leading-relaxed">{f.desc}</p>
                {f.preview && f.preview}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 4 — FEATURED COURSES
      ══════════════════════════════════════════════════ */}
      <section className="relative py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimateWhenVisible className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-fuchsia-400 font-medium text-[13px] tracking-widest uppercase mb-3">Course Marketplace</p>
              <h2 className="text-4xl lg:text-5xl font-bold">Expert-Led Courses</h2>
              <p className="text-white/45 text-lg mt-3">Real curricula. Real instructors. Supercharged with AI at every lesson.</p>
            </div>
            <Link to="/courses" className="shrink-0 px-5 py-2.5 rounded-xl border border-white/15 text-[13px] text-white/70 hover:bg-white/5 hover:text-white transition-all">
              View all courses →
            </Link>
          </AnimateWhenVisible>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger(0.08)}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {items.slice(0, 8).map((c) => (
              <motion.div key={c._id} variants={fadeUp} className="group">
                <CourseCard course={c} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 5 — LEARNING JOURNEY
      ══════════════════════════════════════════════════ */}
      <section className="relative py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/20 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto">
          <AnimateWhenVisible className="text-center mb-16">
            <p className="text-emerald-400 font-medium text-[13px] tracking-widest uppercase mb-4">Your Path</p>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">From Zero to Career-Ready</h2>
            <p className="text-white/45 text-lg max-w-xl mx-auto">A structured journey that AI adapts to you — your pace, your goals, your schedule.</p>
          </AnimateWhenVisible>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-[22px] top-8 bottom-8 w-px bg-gradient-to-b from-violet-500 via-cyan-500 to-emerald-500 opacity-30 hidden md:block" />

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger(0.15)} className="space-y-5">
              {journeySteps.map((step, i) => (
                <motion.div key={i} variants={fadeUp}
                  className="flex gap-5 items-start group">
                  <div className="relative shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center text-xl z-10 group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  <div className="flex-1 bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:border-white/15 transition-all duration-300 hover:bg-white/[0.05]">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-bold text-white/20 tracking-widest">{String(i + 1).padStart(2, '0')}</span>
                      <h3 className="text-[16px] font-semibold text-white">{step.title}</h3>
                    </div>
                    <p className="text-[13px] text-white/50 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 6 — STATS
      ══════════════════════════════════════════════════ */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950/30 to-cyan-950/20 backdrop-blur-xl p-12 overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-violet-500/10 blur-[80px] pointer-events-none rounded-full" />
            <AnimateWhenVisible className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold">Numbers That Matter</h2>
            </AnimateWhenVisible>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger(0.15)}
              className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { val: '50K+', label: 'Active Students', icon: '👨‍🎓' },
                { val: '500+', label: 'Expert Courses', icon: '📚' },
                { val: '1M+', label: 'AI Conversations', icon: '🤖' },
                { val: '95%', label: 'Completion Rate', icon: '🏆' },
              ].map((s) => (
                <motion.div key={s.label} variants={fadeUp} className="text-center group">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{s.icon}</div>
                  <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                    <Counter target={s.val} />
                  </div>
                  <div className="text-[13px] text-white/45">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 7 — TESTIMONIALS
      ══════════════════════════════════════════════════ */}
      <section className="relative py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimateWhenVisible className="text-center mb-16">
            <p className="text-rose-400 font-medium text-[13px] tracking-widest uppercase mb-4">Student Stories</p>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Real Results. Real People.</h2>
            <p className="text-white/45 text-lg max-w-xl mx-auto">From students to professionals — EduForge changes careers.</p>
          </AnimateWhenVisible>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger(0.12)}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={fadeUp}
                className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 hover:border-white/15 hover:bg-white/[0.05] transition-all duration-300 flex flex-col">
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array(t.stars).fill(0).map((_, i) => <span key={i} className="text-amber-400 text-sm">★</span>)}
                </div>

                <p className="text-[13px] text-white/65 leading-relaxed flex-1 mb-5">"{t.text}"</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {t.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/50">{tag}</span>
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-[11px] font-bold text-white shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-white">{t.name}</div>
                    <div className="text-[11px] text-white/40">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 8 — CTA
      ══════════════════════════════════════════════════ */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/30 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-500/15 blur-[100px] rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-cyan-500/10 blur-[80px] rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <AnimateWhenVisible className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-[13px] font-medium mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> 50,000+ learners already inside
            </div>

            <h2 className="text-5xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              Ready to Learn<br />
              <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-fuchsia-400 bg-clip-text text-transparent" style={{ backgroundSize: '200%', animation: 'gradientShift 4s ease infinite' }}>
                with AI?
              </span>
            </h2>

            <p className="text-xl text-white/50 max-w-xl mx-auto">
              Join thousands of learners who use EduForge to learn smarter, build faster, and grow their careers with AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-[16px] text-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 group-hover:from-violet-500 group-hover:to-fuchsia-500 transition-all duration-300" />
                <span className="relative">Start Learning Free</span>
                <span className="relative text-xl">→</span>
              </Link>
              <Link to="/courses" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-[16px] text-white/75 border border-white/15 bg-white/5 hover:bg-white/10 hover:text-white transition-all duration-300">
                Explore Courses
              </Link>
            </div>

            <p className="text-[12px] text-white/25">No credit card required · Free forever plan available</p>
          </AnimateWhenVisible>
        </div>
      </section>

      {/* Global gradient animation */}
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}