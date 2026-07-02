import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import DashboardLayout from "../../components/DashboardLayout";
import StatCard from "../../components/StatCard";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard")
      .then((res) => setStats(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardLayout pageTitle="Admin Dashboard">
        <div className="page-header">
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Loading stats...</p>
        </div>
        <div className="page-grid grid-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: 110, borderRadius: 16 }} />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Admin Dashboard">
      <div className="page-header animate-fade-in">
        <h1 className="page-title">Admin Dashboard 🛡️</h1>
        <p className="page-subtitle">System overview and placement analytics</p>
      </div>

      <div className="page-grid grid-4 mb-lg">
        <StatCard
          icon="🎓"
          label="Total Students"
          value={stats?.totalStudents ?? 0}
          color="info"
          delay={1}
        />
        <StatCard
          icon="🏢"
          label="Companies"
          value={stats?.totalCompanies ?? 0}
          color="accent"
          delay={2}
        />
        <StatCard
          icon="🚀"
          label="Total Drives"
          value={stats?.totalDrives ?? 0}
          color="warning"
          delay={3}
        />
        <StatCard
          icon="✅"
          label="Placed Students"
          value={stats?.studentsPlaced ?? 0}
          color="success"
          delay={4}
        />
      </div>

      {/* Second row of stats */}
      <div className="page-grid grid-3 mb-lg">
        <StatCard
          icon="📋"
          label="Total Applications"
          value={stats?.totalApplications ?? 0}
          color="info"
          delay={5}
        />
        <StatCard
          icon="📅"
          label="Upcoming Drives"
          value={stats?.upcomingDrives ?? 0}
          color="warning"
          delay={6}
        />
        <StatCard
          icon="💰"
          label="Highest Package"
          value={stats?.highestPackageLpa ? `₹${stats.highestPackageLpa} LPA` : "—"}
          color="success"
          delay={7}
        />
      </div>

      {/* Additional stats if available */}
      {stats && typeof stats === "object" && (
        <div className="card animate-fade-in delay-5">
          <div className="card-header">
            <h3 className="card-title">📈 Quick Stats</h3>
          </div>
          <div className="stats-detail-grid">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} className="stats-detail-item">
                <span className="stats-detail-label">
                  {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                </span>
                <span className="stats-detail-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card animate-fade-in delay-6 mt-lg">
        <div className="card-header">
          <h3 className="card-title">⚡ Quick Actions</h3>
        </div>
        <div className="quick-actions-grid">
          <QuickAction href="/admin/create-drive" icon="➕" label="Create Drive" desc="Schedule a new placement drive" color="var(--accent)" />
          <QuickAction href="/admin/eligibility" icon="🎯" label="Auto Shortlist" desc="Run eligibility engine on active drives" color="var(--success)" />
          <QuickAction href="/admin/companies" icon="🏢" label="Approve Companies" desc="Review pending company registrations" color="var(--warning)" />
          <QuickAction href="/admin/students" icon="🎓" label="View Students" desc="Browse all registered students" color="var(--info)" />
        </div>
      </div>

      <style>{`
        .stats-detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 16px;
        }
        .stats-detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 12px;
          background: var(--bg-input);
          border-radius: var(--radius-md);
        }
        .stats-detail-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-weight: 600;
        }
        .stats-detail-value {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: var(--space-md);
        }
        .quick-action-card {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: var(--space-md);
          background: var(--bg-input);
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          cursor: pointer;
          text-decoration: none;
          transition: all var(--transition-base);
        }
        .quick-action-card:hover {
          background: var(--bg-card-hover);
          border-color: var(--border-hover);
          transform: translateY(-2px);
        }
        .quick-action-icon {
          font-size: 1.5rem;
          margin-bottom: 2px;
        }
        .quick-action-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .quick-action-desc {
          font-size: 0.78rem;
          color: var(--text-muted);
          line-height: 1.4;
        }
      `}</style>
    </DashboardLayout>
  );
}

function QuickAction({ href, icon, label, desc, color }) {
  return (
    <Link to={href} className="quick-action-card">
      <span className="quick-action-icon" style={{ color }}>{icon}</span>
      <span className="quick-action-label">{label}</span>
      <span className="quick-action-desc">{desc}</span>
    </Link>
  );
}

