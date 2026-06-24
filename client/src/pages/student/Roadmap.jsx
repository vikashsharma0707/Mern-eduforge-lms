import { useState } from 'react';
import { agentApi } from '../../services';
import Loader from '../../components/Loader.jsx';

const AGENTS = [
  { key: 'studyPlanner', label: 'Study Planner', placeholder: 'I want to learn React in 4 weeks' },
  { key: 'career', label: 'Career Agent', placeholder: 'I am a B.Tech CS student, want to be ML engineer' },
  { key: 'interview', label: 'Interview Agent', placeholder: 'Frontend React JS' },
  { key: 'codingMentor', label: 'Coding Mentor', placeholder: 'paste your code here' },
  { key: 'recommender', label: 'Learning Recommender', placeholder: 'I like data, design and writing' },
  { key: 'revision', label: 'Revision Agent', placeholder: 'Linear Algebra basics' },
];

export default function Roadmap() {
  const [agent, setAgent] = useState('studyPlanner');
  const [text, setText] = useState('');
  const [out, setOut] = useState(null);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true); setOut(null);
    const arg = { studyPlanner: 'goal', career: 'profile', interview: 'topic', codingMentor: 'code', recommender: 'interests', revision: 'topic' }[agent];
    const r = await agentApi[agent](text, arg);
    setOut(r.data); setBusy(false);
  };

  return (
    <div className="container page">
      <h1>AI Agents</h1>
      <p className="muted">Agentic AI that plans → acts → observes → answers.</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {AGENTS.map((a) => (
          <button key={a.key} className={`btn ${agent === a.key ? 'btn-primary' : 'btn-ghost'}`} onClick={() => { setAgent(a.key); setOut(null); }}>
            {a.label}
          </button>
        ))}
      </div>
      <div style={{ height: 16 }} />
      <textarea className="textarea" rows={5} placeholder={AGENTS.find(a => a.key === agent).placeholder} value={text} onChange={(e) => setText(e.target.value)} />
      <div style={{ height: 12 }} />
      <button className="btn btn-primary" onClick={run} disabled={!text || busy}>{busy ? 'Running agent…' : 'Run agent'}</button>
      {busy && <Loader label="Agent thinking…" />}
      {out && (
        <div className="card" style={{ marginTop: 16, whiteSpace: 'pre-wrap' }}>
          <h3>Answer</h3>
          <div>{out.answer}</div>
          {out.transcript?.length > 0 && (
            <details style={{ marginTop: 16 }}>
              <summary className="muted">Agent trace ({out.transcript.length} steps)</summary>
              <pre style={{ overflow: 'auto', background: 'var(--surface-2)', padding: 12, borderRadius: 8 }}>
                {JSON.stringify(out.transcript, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
