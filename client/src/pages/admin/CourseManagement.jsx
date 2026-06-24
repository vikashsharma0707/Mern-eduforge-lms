import { useEffect, useState } from 'react';
import { courseApi } from '../../services';
export default function CourseManagement() {
  const [items, setItems] = useState([]);
  useEffect(() => { courseApi.list().then(r => setItems(r.data)); }, []);
  const remove = async (id) => { if (!confirm('Delete?')) return; await courseApi.remove(id); setItems(items.filter(c => c._id !== id)); };
  return (
    <div className="container page">
      <h1>Courses</h1>
      <table className="table">
        <thead><tr><th>Title</th><th>Teacher</th><th>Students</th><th>Status</th><th></th></tr></thead>
        <tbody>{items.map(c => (
          <tr key={c._id}><td>{c.title}</td><td>{c.teacher?.name}</td><td>{c.enrollmentCount}</td><td>{c.isPublished ? 'Live' : 'Draft'}</td>
            <td><button className="btn btn-danger" onClick={() => remove(c._id)}>Delete</button></td></tr>
        ))}</tbody>
      </table>
    </div>
  );
}
