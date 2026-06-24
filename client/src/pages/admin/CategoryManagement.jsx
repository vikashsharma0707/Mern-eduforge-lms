// import { useEffect, useState } from 'react';
// import { categoryApi } from '../../services';
// export default function CategoryManagement() {
//   const [items, setItems] = useState([]);
//   const [name, setName] = useState('');
//   const refresh = () => categoryApi.list().then(r => setItems(r.data));
//   useEffect(refresh, []);
//   const add = async () => { await categoryApi.create({ name }); setName(''); refresh(); };
//   const remove = async (id) => { await categoryApi.remove(id); refresh(); };
//   return (
//     <div className="container page">
//       <h1>Categories</h1>
//       <div style={{ display: 'flex', gap: 8 }}>
//         <input className="input" placeholder="New category" value={name} onChange={(e) => setName(e.target.value)} />
//         <button className="btn btn-primary" onClick={add}>Add</button>
//       </div>
//       <div style={{ height: 16 }} />
//       {items.map(c => (
//         <div className="card" key={c._id} style={{ marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
//           <span>{c.name}</span>
//           <button className="btn btn-danger" onClick={() => remove(c._id)}>Delete</button>
//         </div>
//       ))}
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { categoryApi } from '../../services';
import { toast } from 'react-toastify';   // Recommended for better UX

export default function CategoryManagement() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch categories
  const refresh = async () => {
    try {
      setLoading(true);
      const res = await categoryApi.list();
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const add = async () => {
    if (!name.trim()) return toast.warning('Category name cannot be empty');

    try {
      await categoryApi.create({ name: name.trim() });
      setName('');
      toast.success('Category added successfully');
      refresh();
    } catch (err) {
      console.error(err);
      toast.error('Failed to add category');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await categoryApi.remove(id);
      toast.success('Category deleted');
      refresh();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete category');
    }
  };

  return (
    <div className="container page">
      <h1>Categories</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <input
          className="input"
          placeholder="New category"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && add()}
        />
        <button className="btn btn-primary" onClick={add} disabled={loading}>
          Add
        </button>
      </div>

      {loading && <p>Loading categories...</p>}

      {items.length === 0 && !loading && (
        <p className="muted">No categories found.</p>
      )}

      {items.map((c) => (
        <div
          className="card"
          key={c._id}
          style={{
            marginBottom: 8,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px'
          }}
        >
          <span>{c.name}</span>
          <button
            className="btn btn-danger"
            onClick={() => remove(c._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}