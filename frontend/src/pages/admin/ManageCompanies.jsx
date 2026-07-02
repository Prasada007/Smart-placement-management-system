import { useEffect, useState } from "react";
import api from "../../api/axios";
import DashboardLayout from "../../components/DashboardLayout";
import StatusBadge from "../../components/StatusBadge";
import { useToast } from "../../components/Toast";

export default function ManageCompanies() {
  const { addToast } = useToast();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    fetchCompanies(true); // show loader only on first mount
  }, []);

  const fetchCompanies = (showLoader = false) => {
    if (showLoader) setLoading(true);
    api.get("/companies")
      .then((res) => {
        const data = res.data?.data || res.data || [];
        setCompanies(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Failed to fetch companies:", err))
      .finally(() => { if (showLoader) setLoading(false); });
  };

  const handleAction = async (id, action) => {
    setActionId(id);
    try {
      await api.put(`/companies/${id}/${action}`);
      addToast(`Company ${action}d successfully!`, "success");
      fetchCompanies(); // silent refresh — no loader flash
    } catch (err) {
      addToast(err.response?.data?.message || "Action failed", "error");
    } finally {
      setActionId(null);
    }
  };

  return (
    <DashboardLayout pageTitle="Companies">
      <div className="page-header animate-fade-in">
        <h1 className="page-title">Manage Companies 🏢</h1>
        <p className="page-subtitle">
          Review, approve, or reject company registrations
        </p>
      </div>

      {loading ? (
        <div className="page-grid grid-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 220, borderRadius: 16 }} />
          ))}
        </div>
      ) : companies.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">🏢</div>
          <p>No companies registered yet.</p>
        </div>
      ) : (
        <div className="page-grid grid-3">
          {companies.map((company, idx) => (
            <div
              key={company.id}
              className={`card animate-fade-in delay-${Math.min(idx + 1, 6)}`}
            >
              <div className="card-header">
                <h3 className="card-title">{company.name}</h3>
                <StatusBadge status={company.status} />
              </div>

              <div className="company-info">
                <InfoRow label="Email" value={company.email} />
                <InfoRow label="Status" value={company.status} />
              </div>

              {company.status === "PENDING" && (
                <div className="flex gap-sm mt-md">
                  <button
                    className="btn btn-success btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => handleAction(company.id, "approve")}
                    disabled={actionId === company.id}
                  >
                    ✓ Approve
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => handleAction(company.id, "reject")}
                    disabled={actionId === company.id}
                  >
                    ✗ Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <style>{`
        .company-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: var(--space-md);
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 0;
          border-bottom: 1px solid var(--border);
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .info-row-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .info-row-value {
          font-size: 0.88rem;
          color: var(--text-primary);
          font-weight: 500;
        }
      `}</style>
    </DashboardLayout>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <span className="info-row-label">{label}</span>
      <span className="info-row-value">{value}</span>
    </div>
  );
}
