import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";
import { useToast } from "../../components/Toast";

export default function EligibilityRules() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [drives, setDrives] = useState([]);
  const [loadingDrives, setLoadingDrives] = useState(true);
  const [shortlisting, setShortlisting] = useState(null);
  const [results, setResults] = useState({});

  useEffect(() => {
    api.get("/drives")
      .then((res) => setDrives(res.data.data || []))
      .catch(() => addToast("Failed to load drives", "error"))
      .finally(() => setLoadingDrives(false));
  }, []);

  const handleAutoShortlist = async (driveId) => {
    setShortlisting(driveId);
    try {
      const res = await api.post(`/eligibility/shortlist/${driveId}`);
      const msg = res.data?.message || "Shortlisting complete!";
      setResults((prev) => ({ ...prev, [driveId]: { type: "success", text: msg } }));
      addToast(msg, "success");
    } catch (err) {
      const msg = err.response?.data?.message || "Shortlisting failed";
      setResults((prev) => ({ ...prev, [driveId]: { type: "error", text: msg } }));
      addToast(msg, "error");
    } finally {
      setShortlisting(null);
    }
  };

  const upcomingDrives = drives.filter((d) => d.status === "UPCOMING" || d.status === "ONGOING");

  return (
    <DashboardLayout pageTitle="Eligibility & Shortlist">
      <div className="page-header animate-fade-in">
        <h1 className="page-title">Eligibility Engine 🎯</h1>
        <p className="page-subtitle">
          Auto-shortlist eligible students for placement drives based on company criteria
        </p>
      </div>

      {/* Info card */}
      <div className="card animate-fade-in delay-1 mb-lg" style={{ borderColor: "var(--accent-glow)", background: "var(--accent-subtle)" }}>
        <div className="card-header">
          <h3 className="card-title">ℹ️ How it works</h3>
        </div>
        <ul style={{ color: "var(--text-secondary)", fontSize: "0.875rem", lineHeight: 2, paddingLeft: "var(--space-md)" }}>
          <li>Select a drive and click <strong style={{ color: "var(--text-primary)" }}>Auto Shortlist</strong></li>
          <li>The engine checks each student against the company's eligibility criteria</li>
          <li>Criteria include: minimum CGPA, allowed branches, backlog policy, required skills</li>
          <li>Eligible students are automatically marked <strong style={{ color: "var(--success)" }}>SHORTLISTED</strong></li>
        </ul>
      </div>

      {loadingDrives ? (
        <div className="page-grid grid-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: 160, borderRadius: 16 }} />
          ))}
        </div>
      ) : upcomingDrives.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">🎯</div>
          <p>No active drives to shortlist. Create a drive first.</p>
        </div>
      ) : (
        <div className="page-grid grid-2">
          {upcomingDrives.map((drive, idx) => (
            <div key={drive.id} className={`card animate-fade-in delay-${Math.min(idx + 1, 6)}`}>
              <div className="card-header">
                <div>
                  <h3 className="card-title">🏢 {drive.company?.name || `Drive #${drive.id}`}</h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 2 }}>
                    Drive ID: #{drive.id} · {drive.request?.jobRole || "Role TBD"}
                  </p>
                </div>
                <span className={`badge ${drive.status === "UPCOMING" ? "badge-info" : "badge-warning"}`}>
                  {drive.status}
                </span>
              </div>

              <div className="eligibility-criteria">
                <CriteriaItem label="Job Role" value={drive.request?.jobRole || drive.company?.name || "—"} />
                <CriteriaItem label="Salary" value={drive.request?.salaryLpa ? `₹${drive.request.salaryLpa} LPA` : "—"} />
                <CriteriaItem label="Min. CGPA" value={drive.request?.minCgpa ?? "—"} />
                <CriteriaItem label="Branches" value={drive.request?.allowedBranches || "All"} />
                <CriteriaItem label="Backlog" value={drive.request?.backlogAllowed ? "Allowed" : "Not Allowed"} />
                <CriteriaItem label="Skills" value={drive.request?.requiredSkills || "Any"} />
              </div>

              {results[drive.id] && (
                <div className={`eligibility-result ${results[drive.id].type === "success" ? "eligibility-result-success" : "eligibility-result-error"}`}>
                  {results[drive.id].text}
                </div>
              )}

              <button
                className="btn btn-primary mt-md"
                style={{ width: "100%" }}
                onClick={() => handleAutoShortlist(drive.id)}
                disabled={shortlisting === drive.id}
              >
                {shortlisting === drive.id ? "Shortlisting..." : "⚡ Auto Shortlist Eligible Students"}
              </button>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .eligibility-criteria {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: var(--space-md);
          margin-bottom: var(--space-md);
        }
        .eligibility-criteria-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .eligibility-criteria-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }
        .eligibility-criteria-value {
          font-size: 0.875rem;
          color: var(--text-primary);
          font-weight: 500;
          word-break: break-word;
        }
        .eligibility-result {
          padding: 10px 14px;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          font-weight: 500;
          margin-top: var(--space-sm);
        }
        .eligibility-result-success { background: var(--success-bg); color: var(--success); }
        .eligibility-result-error { background: var(--danger-bg); color: var(--danger); }
      `}</style>
    </DashboardLayout>
  );
}

function CriteriaItem({ label, value }) {
  return (
    <div className="eligibility-criteria-item">
      <span className="eligibility-criteria-label">{label}</span>
      <span className="eligibility-criteria-value">{String(value)}</span>
    </div>
  );
}
