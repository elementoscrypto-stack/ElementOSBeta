export default function MetricBar({ label, value = 0 }) {
  return (
    <div className="metric">
      <div className="metric-head">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="metric-track">
        <div className="metric-fill" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}
