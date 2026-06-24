import { useEffect, useState } from 'react';
import api from '../../services/api';
export default function CertificatesAdmin() {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get('/admin/stats').then(() => {}); }, []);
  return <div className="container page"><h1>Certificates</h1><p className="muted">Issued certificates appear here. Use /api/certificates/verify/:serial for verification.</p></div>;
}
