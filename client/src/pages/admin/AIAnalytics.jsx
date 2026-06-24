import { useEffect, useState } from 'react';
import { adminApi } from '../../services';
export default function AIAnalytics() {
  const [data, setData] = useState(null);
  useEffect(() => { adminApi.aiAnalytics().then(r => setData(r.data)); }, []);
  return (
    <div className="container page">
      <h1>AI Analytics</h1>
      {data && (
        <table className="table">
          <thead><tr><th>Mode</th><th>Total chats</th></tr></thead>
          <tbody>{data.byMode.map((m,i) => <tr key={i}><td>{m._id}</td><td>{m.count}</td></tr>)}</tbody>
        </table>
      )}
    </div>
  );
}
