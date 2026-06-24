import { useEffect, useState } from 'react';
import { paymentApi } from '../../services';
export default function PaymentsAdmin() {
  const [items, setItems] = useState([]);
  useEffect(() => { paymentApi.history().then(r => setItems(r.data)); }, []);
  return (
    <div className="container page">
      <h1>Payments</h1>
      <table className="table">
        <thead><tr><th>Order ID</th><th>Course</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>{items.map(p => (
          <tr key={p._id}><td>{p.razorpayOrderId}</td><td>{p.course?.title}</td><td>₹{p.amount}</td><td>{p.status}</td><td>{new Date(p.createdAt).toLocaleDateString()}</td></tr>
        ))}</tbody>
      </table>
    </div>
  );
}
