import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div className="container page" style={{ textAlign: 'center', padding: '80px 20px' }}>
      <h1 style={{ fontSize: 64, margin: 0 }}>404</h1>
      <p className="muted">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary">Go home</Link>
    </div>
  );
}
