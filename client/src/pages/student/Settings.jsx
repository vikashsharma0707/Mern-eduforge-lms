export default function StudentSettings() {
  return (
    <div className="container page">
      <h1>Settings</h1>
      <div className="card"><h3>Notifications</h3><label><input type="checkbox" defaultChecked /> Email me about new lessons</label></div>
      <div className="card" style={{ marginTop: 12 }}><h3>Appearance</h3><p className="muted">Dark theme (default)</p></div>
    </div>
  );
}
