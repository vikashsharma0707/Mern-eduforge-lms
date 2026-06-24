import { useEffect, useState } from 'react';
import { certificateApi, enrollmentApi } from '../../services';

export default function Certificates() {
  const [certs, setCerts] = useState([]);
  const [enrolls, setEnrolls] = useState([]);
  useEffect(() => {
    certificateApi.my().then(r => setCerts(r.data));
    enrollmentApi.list().then(r => setEnrolls(r.data));
  }, []);
  const issue = async (cid) => {
    const r = await certificateApi.issue(cid);
    setCerts([...certs, r.data]);
  };
  return (
    <div className="container page">
      <h1>Certificates</h1>
      <h3>Eligible (100% complete)</h3>
      {enrolls.filter(e => e.progress === 100 && !certs.find(c => c.course?._id === e.course._id)).map(e => (
        <div className="card" key={e._id} style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
          <span>{e.course.title}</span>
          <button className="btn btn-primary" onClick={() => issue(e.course._id)}>Issue certificate</button>
        </div>
      ))}
      <h3 style={{ marginTop: 28 }}>Issued</h3>
      {certs.map(c => (
        <div className="card" key={c._id} style={{ marginBottom: 8 }}>
          <h3>{c.course?.title}</h3>
          <p className="muted">Serial: {c.serial}</p>
        </div>
      ))}
    </div>
  );
}
