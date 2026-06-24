import { NavLink } from 'react-router-dom';

export default function Sidebar({ links }) {
  return (
    <aside className="sidebar">
      {links.map((l) => (
        <NavLink key={l.to} to={l.to} end className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}>
          {l.label}
        </NavLink>
      ))}
    </aside>
  );
}
