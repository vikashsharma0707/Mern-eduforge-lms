// import { useState } from 'react';
// import { agentApi } from '../../services';
// import Loader from '../../components/Loader.jsx';

// const AGENTS = [
//   { key: 'studyPlanner', label: 'Study Planner', placeholder: 'I want to learn React in 4 weeks' },
//   { key: 'career', label: 'Career Agent', placeholder: 'I am a B.Tech CS student, want to be ML engineer' },
//   { key: 'interview', label: 'Interview Agent', placeholder: 'Frontend React JS' },
//   { key: 'codingMentor', label: 'Coding Mentor', placeholder: 'paste your code here' },
//   { key: 'recommender', label: 'Learning Recommender', placeholder: 'I like data, design and writing' },
//   { key: 'revision', label: 'Revision Agent', placeholder: 'Linear Algebra basics' },
// ];

// export default function Roadmap() {
//   const [agent, setAgent] = useState('studyPlanner');
//   const [text, setText] = useState('');
//   const [out, setOut] = useState(null);
//   const [busy, setBusy] = useState(false);

//   const run = async () => {
//     setBusy(true); setOut(null);
//     const arg = { studyPlanner: 'goal', career: 'profile', interview: 'topic', codingMentor: 'code', recommender: 'interests', revision: 'topic' }[agent];
//     const r = await agentApi[agent](text, arg);
//     setOut(r.data); setBusy(false);
//   };

//   return (
//     <div className="container page">
//       <h1>AI Agents</h1>
//       <p className="muted">Agentic AI that plans → acts → observes → answers.</p>
//       <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
//         {AGENTS.map((a) => (
//           <button key={a.key} className={`btn ${agent === a.key ? 'btn-primary' : 'btn-ghost'}`} onClick={() => { setAgent(a.key); setOut(null); }}>
//             {a.label}
//           </button>
//         ))}
//       </div>
//       <div style={{ height: 16 }} />
//       <textarea className="textarea" rows={5} placeholder={AGENTS.find(a => a.key === agent).placeholder} value={text} onChange={(e) => setText(e.target.value)} />
//       <div style={{ height: 12 }} />
//       <button className="btn btn-primary" onClick={run} disabled={!text || busy}>{busy ? 'Running agent…' : 'Run agent'}</button>
//       {busy && <Loader label="Agent thinking…" />}
//       {out && (
//         <div className="card" style={{ marginTop: 16, whiteSpace: 'pre-wrap' }}>
//           <h3>Answer</h3>
//           <div>{out.answer}</div>
//           {out.transcript?.length > 0 && (
//             <details style={{ marginTop: 16 }}>
//               <summary className="muted">Agent trace ({out.transcript.length} steps)</summary>
//               <pre style={{ overflow: 'auto', background: 'var(--surface-2)', padding: 12, borderRadius: 8 }}>
//                 {JSON.stringify(out.transcript, null, 2)}
//               </pre>
//             </details>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }




import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Brain, Code2, Target, BookOpen, Compass, GraduationCap,
  Copy, Download, Share2, RefreshCw, Mic, Paperclip, X, ChevronDown,
  ChevronRight, CheckCircle2, Clock, Loader2, Zap, TrendingUp, Users,
  Star, History, Pin, Search, FileText, RotateCcw, Send,
} from 'lucide-react';
import { agentApi } from '../../services';

// ─── Agent Config ────────────────────────────────────────────────────────────
const AGENTS = [
  {
    key: 'studyPlanner',
    icon: BookOpen,
    label: 'Study Planner',
    desc: 'Create complete learning roadmaps',
    paramKey: 'goal',
    placeholder: 'e.g. I want to master React in 4 weeks, starting from basics...',
    gradient: 'from-blue-500 to-cyan-400',
    glow: 'rgba(59,130,246,0.3)',
    color: '#3b82f6',
  },
  {
    key: 'career',
    icon: Compass,
    label: 'Career Agent',
    desc: 'Career guidance based on your skills',
    paramKey: 'profile',
    placeholder: 'e.g. I am a B.Tech CS student, want to become an ML engineer...',
    gradient: 'from-emerald-500 to-teal-400',
    glow: 'rgba(16,185,129,0.3)',
    color: '#10b981',
  },
  {
    key: 'interview',
    icon: Target,
    label: 'Interview Coach',
    desc: 'Mock interviews and preparation',
    paramKey: 'topic',
    placeholder: 'e.g. Frontend React JS interview for a senior role at a startup...',
    gradient: 'from-orange-500 to-amber-400',
    glow: 'rgba(249,115,22,0.3)',
    color: '#f97316',
  },
  {
    key: 'codingMentor',
    icon: Code2,
    label: 'Coding Mentor',
    desc: 'Debug, explain and improve code',
    paramKey: 'code',
    placeholder: 'Paste your code here or describe the problem you want solved...',
    gradient: 'from-violet-500 to-purple-400',
    glow: 'rgba(139,92,246,0.3)',
    color: '#8b5cf6',
  },
  {
    key: 'recommender',
    icon: GraduationCap,
    label: 'Learning Recommender',
    desc: 'Suggest courses and learning paths',
    paramKey: 'interests',
    placeholder: 'e.g. I enjoy data science, design thinking and technical writing...',
    gradient: 'from-pink-500 to-rose-400',
    glow: 'rgba(236,72,153,0.3)',
    color: '#ec4899',
  },
  {
    key: 'revision',
    icon: Brain,
    label: 'Revision Agent',
    desc: 'Revision notes and quick summaries',
    paramKey: 'topic',
    placeholder: 'e.g. Linear Algebra basics – eigenvalues, matrix ops, determinants...',
    gradient: 'from-indigo-500 to-blue-400',
    glow: 'rgba(99,102,241,0.3)',
    color: '#6366f1',
  },
];

const STEP_LABELS = ['Planning', 'Thinking', 'Searching', 'Generating', 'Completed'];
const STEP_ICONS  = [Brain, Brain, Search, Sparkles, CheckCircle2];

const QUICK_TEMPLATES = [
  { icon: '🚀', text: 'Build a 30-day DSA preparation plan' },
  { icon: '💡', text: 'Review my JavaScript code for bugs' },
  { icon: '🎯', text: 'Prepare me for Google SDE interview' },
  { icon: '📊', text: 'Roadmap from fresher to data scientist' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function copyText(t) {
  navigator.clipboard.writeText(t).catch(() => {});
}

function downloadText(t, name = 'ai-response.txt') {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([t], { type: 'text/plain' }));
  a.download = name;
  a.click();
}

// Very lightweight markdown renderer (no external dep needed)
function renderMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) =>
      `<pre class="ai-code-block"><div class="ai-code-lang">${lang || 'code'}</div><code>${code.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</code></pre>`
    )
    .replace(/^### (.+)$/gm, '<h3 class="ai-h3">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="ai-h2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="ai-h1">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="ai-inline-code">$1</code>')
    .replace(/^\- (.+)$/gm, '<li class="ai-li">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ai-li ai-li-num">$1</li>')
    .replace(/\n\n/g, '</p><p class="ai-p">')
    .replace(/^(?!<[hplc])/gm, '')
    ;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AIAgents() {
  const [selectedKey, setSelectedKey] = useState('studyPlanner');
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [pinned, setPinned] = useState([]);
  const [activeStep, setActiveStep] = useState(-1);
  const [expandedSteps, setExpandedSteps] = useState({});
  const textareaRef = useRef(null);
  const responseRef = useRef(null);

  const agent = AGENTS.find((a) => a.key === selectedKey);

  const run = async () => {
    if (!text.trim() || busy) return;
    setBusy(true);
    setOut(null);
    setActiveStep(0);

    // Simulate progressive step animation while waiting
    const stepInterval = setInterval(() => {
      setActiveStep((s) => (s < 3 ? s + 1 : s));
    }, 900);

    try {
      const r = await agentApi[selectedKey]({ [agent.paramKey]: text });
      clearInterval(stepInterval);
      setActiveStep(4);
      const result = r.data;
      setOut(result);
      setHistory((h) => [{ agent: agent.label, text: text.slice(0, 60), result, ts: Date.now() }, ...h.slice(0, 9)]);
      setTimeout(() => responseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (err) {
      clearInterval(stepInterval);
      setActiveStep(-1);
      setOut({ answer: '❌ Agent run failed. Please try again.', transcript: [] });
    } finally {
      setBusy(false);
    }
  };

  const handleCopy = () => {
    if (!out?.answer) return;
    copyText(out.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePin = () => {
    if (!out?.answer) return;
    setPinned((p) => [{ agent: agent.label, answer: out.answer, ts: Date.now() }, ...p.slice(0, 4)]);
  };

  const charCount = text.length;
  const maxChars = 2000;

  return (
    <div className="min-h-screen bg-[#09090F] text-white font-['Inter',sans-serif] pb-20">

      {/* ── Global styles injected via a style tag ── */}
      <style>{`
        .ai-glass {
          background: rgba(18,24,38,0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
        }
        .ai-code-block {
          background: #0d1117;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 16px;
          overflow-x: auto;
          margin: 12px 0;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 13px;
          line-height: 1.6;
        }
        .ai-code-lang {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #7c5cff;
          margin-bottom: 8px;
          font-weight: 600;
        }
        .ai-inline-code {
          background: rgba(124,92,255,0.15);
          color: #a78bfa;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 13px;
          font-family: monospace;
        }
        .ai-h1 { font-size: 22px; font-weight: 700; margin: 20px 0 10px; color: white; }
        .ai-h2 { font-size: 18px; font-weight: 600; margin: 16px 0 8px; color: white; }
        .ai-h3 { font-size: 15px; font-weight: 600; margin: 12px 0 6px; color: #e2e8f0; }
        .ai-p  { margin: 8px 0; color: #cbd5e1; line-height: 1.7; }
        .ai-li { color: #cbd5e1; padding: 4px 0 4px 20px; position: relative; line-height: 1.6; }
        .ai-li::before { content: '▸'; position: absolute; left: 0; color: #7c5cff; }
        .ai-li-num::before { content: '→'; color: #ff2e63; }
        .gradient-text {
          background: linear-gradient(135deg, #FF2E63, #7C5CFF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .agent-card-active {
          background: rgba(18,24,38,0.9) !important;
        }
        textarea:focus { outline: none; }
        textarea::placeholder { color: rgba(255,255,255,0.25); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
      `}</style>

      {/* ════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════ */}
      <div className="relative overflow-hidden">
        {/* Background glow blobs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full opacity-20 blur-[120px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #7C5CFF 0%, transparent 70%)' }} />
        <div className="absolute top-20 right-1/4 w-[400px] h-[300px] rounded-full opacity-15 blur-[100px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #FF2E63 0%, transparent 70%)' }} />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

            {/* Left: Heading */}
            <motion.div className="flex-1 min-w-0"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-white/60 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-[#FF2E63]" />
                Multi-Agent AI Workspace
              </div>
              <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-4">
                <span className="text-white">🤖 AI Multi</span>
                <br />
                <span className="gradient-text">Agent Workspace</span>
              </h1>
              <p className="text-lg text-white/50 max-w-lg leading-relaxed">
                Use specialized AI agents that <strong className="text-white/80">think</strong>, <strong className="text-white/80">plan</strong>, <strong className="text-white/80">reason</strong> and solve real-world tasks autonomously.
              </p>
            </motion.div>

            {/* Right: Stats */}
            <motion.div className="flex flex-col gap-4 shrink-0"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              {/* Animated orb */}
              <div className="relative w-[200px] h-[200px] mx-auto mb-2">
                <motion.div className="absolute inset-0 rounded-full opacity-30 blur-2xl"
                  style={{ background: 'conic-gradient(from 0deg, #FF2E63, #7C5CFF, #FF2E63)' }}
                  animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} />
                <div className="absolute inset-6 rounded-full bg-[#121826] flex items-center justify-center border border-white/10">
                  <Brain className="w-16 h-16 text-[#7C5CFF] opacity-80" />
                </div>
                {/* Orbiting dot */}
                <motion.div className="absolute w-3 h-3 rounded-full bg-[#FF2E63]"
                  style={{ top: '50%', left: '50%', transformOrigin: '60px 0' }}
                  animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />
              </div>

              {/* Stat cards */}
              <div className="flex gap-3">
                {[
                  { icon: Brain,      val: '6',     label: 'AI Agents',    color: '#7C5CFF' },
                  { icon: Zap,        val: '1K+',   label: 'Requests',     color: '#FF2E63' },
                  { icon: TrendingUp, val: '99.9%', label: 'Success Rate', color: '#10b981' },
                ].map((s) => (
                  <motion.div key={s.label} className="ai-glass px-4 py-3 text-center min-w-[80px]"
                    whileHover={{ scale: 1.05, y: -2 }}>
                    <s.icon className="w-4 h-4 mx-auto mb-1" style={{ color: s.color }} />
                    <p className="text-lg font-bold text-white">{s.val}</p>
                    <p className="text-[10px] text-white/40 leading-tight">{s.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-8">

        {/* ════════════════════════════════════════
            QUICK TEMPLATES
        ════════════════════════════════════════ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-3">Quick templates</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_TEMPLATES.map((t) => (
              <motion.button key={t.text}
                onClick={() => setText(t.text)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white/60 border border-white/08 bg-white/[0.03] hover:bg-white/[0.07] hover:text-white transition-all"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <span>{t.icon}</span>
                <span className="truncate max-w-[200px]">{t.text}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ════════════════════════════════════════
            AGENT SELECTION CARDS
        ════════════════════════════════════════ */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-4">Select your agent</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {AGENTS.map((a, i) => {
              const isActive = selectedKey === a.key;
              const Icon = a.icon;
              return (
                <motion.button key={a.key}
                  onClick={() => { setSelectedKey(a.key); setOut(null); setActiveStep(-1); }}
                  className="relative p-4 rounded-[20px] text-left transition-all border"
                  style={{
                    background: isActive ? 'rgba(18,24,38,0.9)' : 'rgba(18,24,38,0.4)',
                    borderColor: isActive ? a.color : 'rgba(255,255,255,0.08)',
                    boxShadow: isActive ? `0 0 30px ${a.glow}` : 'none',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isActive && (
                    <motion.div className="absolute inset-0 rounded-[20px] opacity-10"
                      style={{ background: `linear-gradient(135deg, ${a.color}, transparent)` }}
                      layoutId="activeGlow" />
                  )}
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.gradient} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-[13px] font-semibold text-white leading-tight mb-1">{a.label}</p>
                  <p className="text-[11px] text-white/40 leading-tight">{a.desc}</p>
                  {isActive && (
                    <motion.div className="absolute top-3 right-3 w-2 h-2 rounded-full"
                      style={{ background: a.color }}
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }} />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.section>

        {/* ════════════════════════════════════════
            PROMPT EDITOR
        ════════════════════════════════════════ */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className="ai-glass p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${agent.gradient} flex items-center justify-center`}>
                  <agent.icon className="w-3.5 h-3.5 text-white" />
                </div>
                <label className="text-sm font-semibold text-white/80">
                  {agent.label} — Describe your goal
                </label>
              </div>
              <span className={`text-xs ${charCount > maxChars * 0.9 ? 'text-[#FF2E63]' : 'text-white/30'}`}>
                {charCount}/{maxChars}
              </span>
            </div>

            <textarea
              ref={textareaRef}
              rows={5}
              maxLength={maxChars}
              placeholder={agent.placeholder}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) run(); }}
              className="w-full bg-transparent text-white/90 text-[15px] leading-relaxed resize-none placeholder:text-white/25"
            />

            {/* Toolbar */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.06]">
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all" title="Attach file">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/5 transition-all" title="Voice input">
                  <Mic className="w-4 h-4" />
                </button>
                <button onClick={() => { setText(''); textareaRef.current?.focus(); }}
                  className="p-2 rounded-lg text-white/30 hover:text-[#FF2E63] hover:bg-[#FF2E63]/10 transition-all" title="Clear">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-white/25">Ctrl+Enter to run</p>
            </div>
          </div>

          {/* Generate Button */}
          <motion.button
            onClick={run}
            disabled={!text.trim() || busy}
            className="mt-4 w-full relative overflow-hidden rounded-[20px] px-8 py-4 text-base font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #FF2E63 0%, #7C5CFF 100%)' }}
            whileHover={{ scale: busy ? 1 : 1.01 }}
            whileTap={{ scale: busy ? 1 : 0.98 }}
          >
            {/* Shimmer */}
            {!busy && (
              <motion.div className="absolute inset-0 opacity-30"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }} />
            )}
            <span className="relative flex items-center justify-center gap-2">
              {busy
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Agent is working...</>
                : <><Sparkles className="w-4 h-4" /> Generate AI Response</>
              }
            </span>
          </motion.button>
        </motion.section>

        {/* ════════════════════════════════════════
            THINKING TIMELINE
        ════════════════════════════════════════ */}
        <AnimatePresence>
          {(busy || (out && activeStep >= 0)) && (
            <motion.section
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="ai-glass p-6"
            >
              <p className="text-xs uppercase tracking-widest text-white/30 font-semibold mb-5">
                Agent thinking process
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                {STEP_LABELS.map((label, i) => {
                  const StepIcon = STEP_ICONS[i];
                  const done  = activeStep > i;
                  const active = activeStep === i;
                  return (
                    <div key={label} className="flex sm:flex-col items-center sm:flex-1 gap-3 sm:gap-2">
                      {/* Connector line */}
                      {i > 0 && (
                        <div className="hidden sm:block h-px flex-1 -mx-1 relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                          {done && (
                            <motion.div className="absolute inset-0" style={{ background: '#7C5CFF' }}
                              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.4 }} />
                          )}
                        </div>
                      )}
                      <motion.div
                        className="flex flex-col items-center gap-1.5 text-center"
                        initial={{ opacity: 0.3 }} animate={{ opacity: done || active ? 1 : 0.3 }}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          done   ? 'border-[#10b981] bg-[#10b981]/20' :
                          active ? 'border-[#7C5CFF] bg-[#7C5CFF]/20' :
                                   'border-white/10 bg-white/5'
                        }`}>
                          {done
                            ? <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                            : active
                            ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
                                <StepIcon className="w-4 h-4 text-[#7C5CFF]" />
                              </motion.div>
                            : <StepIcon className="w-4 h-4 text-white/20" />
                          }
                        </div>
                        <p className={`text-[11px] font-medium hidden sm:block ${
                          done ? 'text-[#10b981]' : active ? 'text-white' : 'text-white/25'
                        }`}>{label}</p>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ════════════════════════════════════════
            AI RESPONSE
        ════════════════════════════════════════ */}
        <AnimatePresence>
          {out && (
            <motion.section ref={responseRef}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="ai-glass overflow-hidden"
            >
              {/* Response header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF2E63] to-[#7C5CFF] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">✨ AI Response</p>
                    <p className="text-[11px] text-white/30">{agent.label}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[
                    { Icon: copied ? CheckCircle2 : Copy, label: copied ? 'Copied!' : 'Copy', action: handleCopy, color: copied ? '#10b981' : undefined },
                    { Icon: Download, label: 'Download', action: () => downloadText(out.answer) },
                    { Icon: Pin, label: 'Pin', action: handlePin },
                    { Icon: RefreshCw, label: 'Regenerate', action: run },
                  ].map(({ Icon, label, action, color }) => (
                    <motion.button key={label} onClick={action} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all" title={label}>
                      <Icon className="w-4 h-4" style={color ? { color } : {}} />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Response body */}
              <div className="px-6 py-6">
                <div
                  className="text-[15px] leading-relaxed text-white/85"
                  dangerouslySetInnerHTML={{ __html: `<p class="ai-p">${renderMarkdown(out.answer)}</p>` }}
                />
              </div>

              {/* Agent trace timeline */}
              {out.transcript?.length > 0 && (
                <div className="px-6 pb-6">
                  <button
                    onClick={() => setExpandedSteps((e) => ({ ...e, trace: !e.trace }))}
                    className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-3"
                  >
                    {expandedSteps.trace ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    Agent trace — {out.transcript.length} steps
                  </button>
                  <AnimatePresence>
                    {expandedSteps.trace && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <div className="space-y-3 border-l-2 border-[#7C5CFF]/30 pl-4">
                          {out.transcript.map((step, i) => (
                            <motion.div key={i}
                              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="relative"
                            >
                              <div className="absolute -left-[21px] top-2 w-3 h-3 rounded-full border-2 border-[#7C5CFF] bg-[#09090F]" />
                              <div className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[10px] text-[#7C5CFF] font-bold uppercase tracking-wider">Step {i + 1}</span>
                                  {step.action && step.action !== 'FINAL' && (
                                    <span className="text-[10px] text-white/30">→ used <code className="ai-inline-code">{step.action}</code></span>
                                  )}
                                </div>
                                <p className="text-[13px] text-white/70 leading-relaxed">{step.thought}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {/* ════════════════════════════════════════
            BOTTOM WIDGETS ROW
        ════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">

          {/* Recent Prompts */}
          <motion.div className="ai-glass p-5"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <div className="flex items-center gap-2 mb-4">
              <History className="w-4 h-4 text-[#7C5CFF]" />
              <p className="text-sm font-semibold text-white">Recent prompts</p>
            </div>
            {history.length === 0 ? (
              <p className="text-sm text-white/25 text-center py-6">Your prompt history will appear here</p>
            ) : (
              <div className="space-y-2">
                {history.slice(0, 5).map((h, i) => (
                  <button key={i}
                    onClick={() => setText(h.text)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all text-left group">
                    <FileText className="w-4 h-4 text-white/30 shrink-0 group-hover:text-[#7C5CFF] transition-colors" />
                    <div className="min-w-0">
                      <p className="text-[13px] text-white/70 truncate group-hover:text-white transition-colors">{h.text}</p>
                      <p className="text-[11px] text-white/30">{h.agent}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Pinned Outputs */}
          <motion.div className="ai-glass p-5"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
            <div className="flex items-center gap-2 mb-4">
              <Pin className="w-4 h-4 text-[#FF2E63]" />
              <p className="text-sm font-semibold text-white">Pinned outputs</p>
            </div>
            {pinned.length === 0 ? (
              <p className="text-sm text-white/25 text-center py-6">Pin important AI responses to save them here</p>
            ) : (
              <div className="space-y-2">
                {pinned.map((p, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <p className="text-[11px] text-[#FF2E63] mb-1 font-medium">{p.agent}</p>
                    <p className="text-[13px] text-white/60 line-clamp-2">{p.answer?.slice(0, 120)}…</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

      </div>
    </div>
  );
}