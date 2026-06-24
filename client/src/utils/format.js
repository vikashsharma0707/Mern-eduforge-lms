// ../../utils/format.js
export const fileUrl = (p) => {
  if (!p) return '';

  let base = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // Change 5000 to your backend port

  base = base.replace(/\/api$/, '').replace(/\/$/, '');

  const path = p.startsWith('/') ? p : `/${p}`;

  const fullUrl = base + path;
  console.log("fileUrl generated:", fullUrl);   // ← For debugging
  return fullUrl;
};
export const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
export const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
