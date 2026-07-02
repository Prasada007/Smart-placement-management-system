import "./StatCard.css";

export default function StatCard({ icon, label, value, trend, color = "accent", delay = 0 }) {
  const colorMap = {
    accent: "var(--accent)",
    success: "var(--success)",
    warning: "var(--warning)",
    danger: "var(--danger)",
    info: "var(--info)",
  };

  const bgMap = {
    accent: "var(--accent-subtle)",
    success: "var(--success-bg)",
    warning: "var(--warning-bg)",
    danger: "var(--danger-bg)",
    info: "var(--info-bg)",
  };

  return (
    <div
      className={`stat-card animate-fade-in delay-${delay}`}
      style={{ "--stat-color": colorMap[color], "--stat-bg": bgMap[color] }}
    >
      <div className="stat-icon-wrap">
        <span className="stat-icon">{icon}</span>
      </div>
      <div className="stat-info">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
      </div>
      {trend && (
        <span className={`stat-trend ${trend > 0 ? "up" : "down"}`}>
          {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
        </span>
      )}
    </div>
  );
}
