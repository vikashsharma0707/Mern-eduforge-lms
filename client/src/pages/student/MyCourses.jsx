import { useEffect, useState } from 'react';
import { enrollmentApi } from '../../services';
import { Link } from 'react-router-dom';
import Empty from '../../components/Empty.jsx';

export default function MyCourses() {
  const [items, setItems] = useState([]);
  useEffect(() => { enrollmentApi.list().then(r => setItems(r.data)); }, []);
  return (
    <div className="container page">
      <h1>My Courses</h1>
      {items.length === 0 && <Empty title="No enrollments yet" text="Browse the catalog to find your first course." />}
      <div className="course-grid">
        {items.map(e => (
          <Link to={`/learn/${e.course?.slug}`} key={e._id} className="course-card">
            <div className="course-body">
              <h3>{e.course?.title}</h3>
              <p className="muted">{e.progress}% complete</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
