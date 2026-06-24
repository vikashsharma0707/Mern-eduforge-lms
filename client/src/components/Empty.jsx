export default function Empty({ title = 'Nothing here yet', text }) {
  return (
    <div className="empty">
      <h3>{title}</h3>
      {text && <p className="muted">{text}</p>}
    </div>
  );
}
