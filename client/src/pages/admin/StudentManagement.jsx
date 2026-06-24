// import { useEffect, useState } from 'react';
// import { userApi } from '../../services';
// export default function StudentManagement() {
//   const [users, setUsers] = useState([]);
//   const refresh = () => userApi.list({ role: 'student' }).then(r => setUsers(r.data));
//   useEffect(refresh, []);
//   const toggle = async (id) => { await userApi.toggleActive(id); refresh(); };
//   const remove = async (id) => { if (!confirm('Delete?')) return; await userApi.remove(id); refresh(); };
//   return (
//     <div className="container page">
//       <h1>Student Management</h1>
//       <table className="table">
//         <thead><tr><th>Name</th><th>Email</th><th>Active</th><th></th></tr></thead>
//         <tbody>{users.map(u => (
//           <tr key={u._id}>
//             <td>{u.name}</td><td>{u.email}</td><td>{u.isActive ? '✓' : '—'}</td>
//             <td>
//               <button className="btn btn-ghost" onClick={() => toggle(u._id)}>Toggle</button>
//               <button className="btn btn-danger" style={{ marginLeft: 6 }} onClick={() => remove(u._id)}>Delete</button>
//             </td>
//           </tr>
//         ))}</tbody>
//       </table>
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { userApi } from '../../services';
import { toast } from 'react-toastify';

export default function StudentManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    try {
      setLoading(true);
      const res = await userApi.list({ role: 'student' });
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const toggle = async (id) => {
    try {
      await userApi.toggleActive(id);
      toast.success('Status updated');
      refresh();
    } catch (err) {
      toast.error('Failed to toggle status');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await userApi.remove(id);
      toast.success('Student deleted');
      refresh();
    } catch (err) {
      toast.error('Failed to delete student');
    }
  };

  return (
    <div className="container page">
      <h1>Student Management</h1>

      {loading && <p>Loading students...</p>}

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.isActive ? '✓' : '—'}</td>
              <td>
                <button className="btn btn-ghost" onClick={() => toggle(u._id)}>
                  Toggle
                </button>
                <button
                  className="btn btn-danger"
                  style={{ marginLeft: 6 }}
                  onClick={() => remove(u._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && !loading && <p className="muted">No students found.</p>}
    </div>
  );
}