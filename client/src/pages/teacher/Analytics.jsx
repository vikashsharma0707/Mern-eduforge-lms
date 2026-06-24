import { useEffect, useState } from 'react';
import { courseApi } from '../../services';

export default function TeacherAnalytics() {
  const [courses, setCourses] = useState([]);
  useEffect(() => { courseApi.myOwned().then(r => setCourses(r.data)); }, []);
  const total = courses.reduce((s, c) => s + c.enrollmentCount, 0);
  return (
    <div className="container page">
      <h1>Analytics</h1>
      <div className="cards-row">
        <div className="card stat-card"><h4>Total students</h4><div className="num">{total}</div></div>
        <div className="card stat-card"><h4>Total courses</h4><div className="num">{courses.length}</div></div>
        <div className="card stat-card"><h4>Avg rating</h4><div className="num">{(courses.reduce((s,c)=>s+c.ratingAvg,0)/(courses.length||1)).toFixed(1)}</div></div>
      </div>
      <h2 style={{ marginTop: 20 }}>Per-course breakdown</h2>
      <table className="table">
        <thead><tr><th>Course</th><th>Students</th><th>Rating</th><th>Status</th></tr></thead>
        <tbody>{courses.map(c => (
          <tr key={c._id}><td>{c.title}</td><td>{c.enrollmentCount}</td><td>{c.ratingAvg.toFixed(1)}</td><td>{c.isPublished ? 'Live' : 'Draft'}</td></tr>
        ))}</tbody>
      </table>
    </div>
  );
}
