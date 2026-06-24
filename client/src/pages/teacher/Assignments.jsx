import { useEffect, useState } from 'react';
import { courseApi, assignmentApi } from '../../services';

export default function TeacherAssignments() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', maxMarks: 100 });

  useEffect(() => { courseApi.myOwned().then(r => setCourses(r.data)); }, []);
  useEffect(() => { if (courseId) assignmentApi.byCourse(courseId).then(r => setAssignments(r.data)); }, [courseId]);

  const create = async () => {
    const fd = new FormData();
    Object.entries({ ...form, course: courseId }).forEach(([k, v]) => fd.append(k, v));
    const r = await assignmentApi.create(fd);
    setAssignments([...assignments, r.data]);
  };

  return (
    <div className="container page">
      <h1>Assignments</h1>
      <select className="select" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
        <option value="">Select course</option>
        {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
      </select>
      {courseId && (
        <>
          <div className="card" style={{ marginTop: 12 }}>
            <h3>New assignment</h3>
            <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <textarea className="textarea" rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ marginTop: 8 }} />
            <button className="btn btn-primary" style={{ marginTop: 8 }} onClick={create}>Create</button>
          </div>
          {assignments.map(a => (
            <div className="card" key={a._id} style={{ marginTop: 8 }}>
              <h3>{a.title}</h3><p>{a.description}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
