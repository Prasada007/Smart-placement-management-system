import { useEffect, useState } from "react";
import api from "../../api/axios";
import DashboardLayout from "../../components/DashboardLayout";
import StatusBadge from "../../components/StatusBadge";
import { useToast } from "../../components/Toast";

const STATUS_OPTIONS = ["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"];

function fmtDateTime(dt, showTime = true) {
  if (!dt) return "TBD";
  const d = new Date(dt);
  const options = {
    day: "2-digit", month: "short", year: "numeric"
  };
  if (showTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
    options.hour12 = true;
  }
  return d.toLocaleString("en-IN", options);
}

export default function ManageDrives() {
  const { addToast } = useToast();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = () => {
    api.get("/drives")
      .then((res) => setDrives(res.data.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const updateStatus = async (id, value) => {
    setUpdatingId(id);
    try {
      await api.put(`/drives/${id}/status?value=${value}`);
      addToast(`Drive status updated to ${value}`, "success");
      fetchDrives();
    } catch (err) {
      addToast(err.response?.data?.message || "Update failed", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <DashboardLayout pageTitle="Drives">
      <div className="page-header animate-fade-in">
        <h1 className="page-title">Manage Drives 🚀</h1>
        <p className="page-subtitle">
          View and manage all placement drives ({drives.length} total)
        </p>
      </div>

      {loading ? (
        <div className="page-grid grid-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: 240, borderRadius: 16 }} />
          ))}
        </div>
      ) : drives.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">🚀</div>
          <p>No drives created yet.</p>
        </div>
      ) : (
        <div className="page-grid grid-2">
          {drives.map((drive, idx) => (
            <div
              key={drive.id}
              className={`card animate-fade-in delay-${Math.min(idx + 1, 6)}`}
            >
              <div className="card-header">
                <h3 className="card-title">
                  🏢 {drive.company?.name || "Company"}
                </h3>
                <StatusBadge status={drive.status} />
              </div>

              <div className="drive-info-grid">
                <DriveInfo label="Role" value={drive.request?.jobRole || "—"} />
                <DriveInfo
                  label="Salary"
                  value={drive.request?.salaryLpa ? `₹${drive.request.salaryLpa} LPA` : "—"}
                />
                <DriveInfo label="📝 Test" value={fmtDateTime(drive.testDate)} />
                <DriveInfo label="🎤 Interview" value={fmtDateTime(drive.interviewDate)} />
                <DriveInfo label="📊 Result" value={fmtDateTime(drive.resultDate, false)} />
                <DriveInfo label="Venue" value={drive.venue || "—"} />
                <DriveInfo
                  label="Applicants"
                  value={drive.applications?.length ?? 0}
                />
              </div>

              <div className="flex items-center gap-sm mt-md">
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    marginRight: "auto",
                  }}
                >
                  Update status:
                </span>
                {STATUS_OPTIONS.filter((s) => s !== drive.status).map((s) => (
                  <button
                    key={s}
                    className="btn btn-secondary btn-sm"
                    onClick={() => updateStatus(drive.id, s)}
                    disabled={updatingId === drive.id}
                    style={{ fontSize: "0.72rem" }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .drive-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: var(--space-md);
        }
        .drive-info-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .drive-info-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-weight: 600;
        }
        .drive-info-value {
          font-size: 0.9rem;
          color: var(--text-primary);
          font-weight: 500;
        }
      `}</style>
    </DashboardLayout>
  );
}

function DriveInfo({ label, value }) {
  return (
    <div className="drive-info-item">
      <span className="drive-info-label">{label}</span>
      <span className="drive-info-value">{value}</span>
    </div>
  );
}
