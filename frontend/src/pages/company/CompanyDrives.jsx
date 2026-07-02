import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";
import StatusBadge from "../../components/StatusBadge";

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

export default function CompanyDrives() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const companyId = Number(user.id);
    api.get("/drives")
      .then((res) => {
        const allDrives = res.data?.data || [];
        const myDrives = allDrives.filter((d) => Number(d.company?.id) === companyId);
        setDrives(myDrives);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user.id]);

  return (
    <DashboardLayout pageTitle="Our Drives">
      <div className="page-header animate-fade-in">
        <h1 className="page-title">Our Drives 🚀</h1>
        <p className="page-subtitle">
          View your placement drives and applicants
        </p>
      </div>

      {loading ? (
        <div className="page-grid grid-2">
          {[1, 2].map((i) => (
            <div key={i} className="skeleton" style={{ height: 200, borderRadius: 16 }} />
          ))}
        </div>
      ) : drives.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">🚀</div>
          <p>No drives assigned to your company yet.</p>
        </div>
      ) : (
        <div className="page-grid grid-2">
          {drives.map((drive, idx) => (
            <div
              key={drive.id}
              className={`card animate-fade-in delay-${Math.min(idx + 1, 6)}`}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/company/drives/${drive.id}/applicants`)}
            >
              <div className="card-header">
                <h3 className="card-title">Drive #{drive.id}</h3>
                <StatusBadge status={drive.status} />
              </div>

              <div className="drive-details-grid">
                <DetailItem label="Role" value={drive.request?.jobRole || "—"} />
                <DetailItem label="Salary" value={drive.request?.salaryLpa ? `₹${drive.request.salaryLpa} LPA` : "—"} />
                <DetailItem label="Test Date" value={fmtDateTime(drive.testDate)} />
                <DetailItem label="Interview" value={fmtDateTime(drive.interviewDate)} />
                <DetailItem label="Venue" value={drive.venue || "—"} />
                <DetailItem label="Result Date" value={fmtDateTime(drive.resultDate, false)} />
                <DetailItem
                  label="Applicants"
                  value={drive.applications?.length ?? 0}
                />
              </div>

              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--accent)",
                  marginTop: "var(--space-md)",
                  fontWeight: 600,
                }}
              >
                Click to view applicants →
              </p>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .drive-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: var(--space-md);
        }
        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .detail-item-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }
        .detail-item-value {
          font-size: 0.9rem;
          color: var(--text-primary);
          font-weight: 500;
        }
      `}</style>
    </DashboardLayout>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="detail-item">
      <span className="detail-item-label">{label}</span>
      <span className="detail-item-value">{value}</span>
    </div>
  );
}
