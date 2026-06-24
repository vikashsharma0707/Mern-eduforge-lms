import { useEffect, useState } from 'react';
import { enrollmentApi } from '../../services';
export default function EnrollmentsAdmin() {
  const [items, setItems] = useState([]);
  useEffect(() => { enrollmentApi.list().then(r => setItems(r.data)); }, []);
  return (
    <div className="container page">
      <h1>Enrollments</h1>
      <table className="table">
        <thead><tr><th>Student</th><th>Course</th><th>Progress</th><th>Date</th></tr></thead>
        <tbody>{items.map(e => (
          <tr key={e._id}><td>{e.student?.name}</td><td>{e.course?.title}</td><td>{e.progress}%</td><td>{new Date(e.createdAt).toLocaleDateString()}</td></tr>
        ))}</tbody>
      </table>
    </div>
  );
}
