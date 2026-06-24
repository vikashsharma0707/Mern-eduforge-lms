import { useEffect, useState } from 'react';
import { enrollmentApi, assignmentApi } from '../../services';

export default function StudentAssignments() {
  const [list, setList] = useState([]);
  useEffect(() => {
    enrollmentApi.list().then(async r => {
      const all = [];
      for (const e of r.data) {
        const a = await assignmentApi.byCourse(e.course._id);
        a.data.forEach(x => all.push({ ...x, courseTitle: e.course.title }));
      }
      setList(all);
    });
  }, []);
  const [text, setText] = useState({});
  const submit = async (id) => {
    const fd = new FormData(); fd.append('text', text[id] || '');
    await assignmentApi.submit(id, fd);
    alert('Submitted');
  };
  return (
    <div className="container page">
      <h1>Assignments</h1>
      {list.map(a => (
        <div className="card" key={a._id} style={{ marginBottom: 12 }}>
          <h3>{a.title} <small className="muted">({a.courseTitle})</small></h3>
          <p>{a.description}</p>
          <textarea className="textarea" rows={3} placeholder="Type your answer…" onChange={(e) => setText({ ...text, [a._id]: e.target.value })} />
          <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={() => submit(a._id)}>Submit</button>
        </div>
      ))}
    </div>
  );
}
