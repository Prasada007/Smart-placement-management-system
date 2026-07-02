import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";
import StatusBadge from "../../components/StatusBadge";
import { useToast } from "../../components/Toast";

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

export default function UpcomingDrives() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [drives, setDrives] = useState([]);
  const [applying, setApplying] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appliedIds, setAppliedIds] = useState(new Set());

  useEffect(() => {
    const loadData = async () => {
      try {
        const [drivesRes, appsRes] = await Promise.all([
          api.get("/drives/upcoming"),
          api.get(`/applications/student/${user.id}`),
        ]);
        setDrives(drivesRes.data.data || []);
        const applied = new Set((appsRes.data.data || []).map((a) => a.drive?.id));
        setAppliedIds(applied);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user.id]);

  const applyToDrive = async (driveId) => {
    setApplying(driveId);
    try {
      await api.post(`/applications/apply?studentId=${user.id}&driveId=${driveId}`);
      setAppliedIds((prev) => new Set([...prev, driveId]));
      addToast("Applied successfully! 🎉", "success");
    } catch (err) {
      addToast(err.response?.data?.message || "Already applied or not eligible", "error");
    } finally {
      setApplying(null);
    }
  };

  return (
    <DashboardLayout pageTitle="Upcoming Drives">
      <div className="page-header animate-fade-in">
        <h1 className="page-title">Upcoming Drives 🚀</h1>
        <p className="page-subtitle">Browse and apply to placement drives</p>
      </div>

      {loading ? (
        <div className="page-grid grid-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: 200, borderRadius: 16 }} />
          ))}
        </div>
      ) : drives.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">🏖️</div>
          <p>No upcoming drives at the moment. Check back later!</p>
        </div>
      ) : (
        <div className="page-grid grid-2">
          {drives.map((drive, idx) => (
            <div key={drive.id} className={`card animate-fade-in delay-${Math.min(idx + 1, 6)}`}>
              <div className="card-header">
                <h3 className="card-title">
                  🏢 {drive.company?.name || "Company"}
                </h3>
                <StatusBadge status={drive.status} />
              </div>

              <div className="drive-details">
                <DriveDetail label="Role" value={drive.request?.jobRole || "—"} />
                <DriveDetail label="Salary" value={drive.request?.salaryLpa ? `₹${drive.request.salaryLpa} LPA` : "—"} />
                <DriveDetail label="📝 Test Date" value={fmtDateTime(drive.testDate)} />
                <DriveDetail label="🎤 Interview" value={fmtDateTime(drive.interviewDate)} />
                <DriveDetail label="Venue" value={drive.venue || "—"} />
                <DriveDetail label="📊 Result Date" value={fmtDateTime(drive.resultDate, false)} />
              </div>

              <button
                className={`btn mt-md ${appliedIds.has(drive.id) ? "btn-secondary" : "btn-primary"}`}
                style={{ width: "100%" }}
                onClick={() => applyToDrive(drive.id)}
                disabled={applying === drive.id || appliedIds.has(drive.id)}
              >
                {applying === drive.id ? "Applying..." : appliedIds.has(drive.id) ? "✓ Applied" : "Apply Now"}
              </button>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .drive-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: var(--space-md);
        }
        .drive-detail {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .drive-detail-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }
        .drive-detail-value {
          font-size: 0.9rem;
          color: var(--text-primary);
          font-weight: 500;
        }
      `}</style>
    </DashboardLayout>
  );
}

function DriveDetail({ label, value }) {
  return (
    <div className="drive-detail">
      <span className="drive-detail-label">{label}</span>
      <span className="drive-detail-value">{value}</span>
    </div>
  );
}
