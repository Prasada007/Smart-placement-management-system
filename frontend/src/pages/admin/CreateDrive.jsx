import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../components/Toast";
import DashboardLayout from "../../components/DashboardLayout";

export default function CreateDrive() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [form, setForm] = useState({
    requestId: "",
    testDateTime: "",
    interviewDateTime: "",
    resultDate: "", // Only Date, no Time!
    venue: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/requests/pending")
      .then((res) => {
        setRequests(res.data?.data || []);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "requestId") {
      const req = requests.find((r) => String(r.id) === value);
      setSelectedRequest(req || null);
    }
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        requestId: Number(form.requestId),
        adminId: Number(user.id),
        testDate: form.testDateTime || null,
        interviewDate: form.interviewDateTime || null,
        resultDate: form.resultDate ? `${form.resultDate}T00:00:00` : null, // Backend requires LocalDateTime
        venue: form.venue,
      };
      await api.post("/drives", payload);
      addToast("Drive created successfully!", "success");
      setTimeout(() => navigate("/admin/drives"), 1200);
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to create drive", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout pageTitle="Create Drive">
      <div className="page-header animate-fade-in">
        <h1 className="page-title">Create Drive ➕</h1>
        <p className="page-subtitle">Schedule a new placement drive from pending company requests</p>
      </div>

      <div className="create-drive-layout animate-fade-in delay-1">
        {/* Left Panel: Selection and Details */}
        <div className="layout-panel-left">
          <div className="card">
            <h2 className="panel-section-title">1. Select Request</h2>
            <div className="form-group mt-md">
              <label className="form-label">Placement Request *</label>
              <select
                name="requestId"
                value={form.requestId}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select a pending request</option>
                {requests.length === 0 && (
                  <option disabled>No pending placement requests</option>
                )}
                {requests.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.company?.name || "Company"} — {r.jobRole} (₹{r.salaryLpa} LPA)
                  </option>
                ))}
              </select>
            </div>

            {selectedRequest ? (
              <div className="request-details-card mt-lg animate-scale-in">
                <h3 className="details-card-title">🏢 {selectedRequest.company?.name} Details</h3>
                <div className="details-grid mt-md">
                  <div className="details-item">
                    <span className="details-label">Job Role</span>
                    <span className="details-value highlight">{selectedRequest.jobRole}</span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Salary Package</span>
                    <span className="details-value highlight">₹{selectedRequest.salaryLpa} LPA</span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Min CGPA Requirement</span>
                    <span className="details-value">{selectedRequest.minCgpa ?? "None"}</span>
                  </div>
                  <div className="details-item">
                    <span className="details-label">Backlog Allowed</span>
                    <span className={`details-value ${selectedRequest.backlogAllowed ? "text-success" : "text-danger"}`}>
                      {selectedRequest.backlogAllowed ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="details-item full-width">
                    <span className="details-label">Eligible Branches</span>
                    <span className="details-value tags">
                      {selectedRequest.allowedBranches ? (
                        selectedRequest.allowedBranches.split(",").map((b) => (
                          <span key={b} className="tag-badge">{b.trim()}</span>
                        ))
                      ) : (
                        <span className="tag-badge all">All Branches</span>
                      )}
                    </span>
                  </div>
                  <div className="details-item full-width">
                    <span className="details-label">Required Skills</span>
                    <span className="details-value">{selectedRequest.requiredSkills || "Any"}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="request-placeholder mt-lg">
                <svg className="placeholder-graphic" viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 160, height: "auto", opacity: 0.85 }}>
                  {/* Calendar Outline */}
                  <rect x="40" y="30" width="120" height="80" rx="8" fill="white" stroke="var(--border)" strokeWidth="2.5" />
                  {/* Calendar Header Accent block */}
                  <path d="M40 38C40 33.5817 43.5817 30 48 30H152C156.418 30 160 33.5817 160 38V48H40V38Z" fill="var(--accent-subtle)" stroke="var(--border)" strokeWidth="2.5" />
                  {/* Grid Lines */}
                  <line x1="60" y1="65" x2="140" y2="65" stroke="var(--border)" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="60" y1="80" x2="120" y2="80" stroke="var(--border)" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="60" y1="95" x2="95" y2="95" stroke="var(--border)" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Checked Badge circle */}
                  <circle cx="138" cy="92" r="10" fill="var(--accent)" />
                  <path d="M134 92L137 95L143 89" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Hanging rings */}
                  <rect x="65" y="20" width="8" height="15" rx="3" fill="var(--text-muted)" />
                  <rect x="127" y="20" width="8" height="15" rx="3" fill="var(--text-muted)" />
                </svg>
                <p className="mt-md" style={{ maxWidth: 320, color: "var(--text-muted)", fontSize: "0.88rem", fontWeight: 550, lineHeight: 1.5 }}>
                  Select a placement request above to view its eligibility rules & company details here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Scheduling Form */}
        <div className="layout-panel-right">
          <form onSubmit={handleSubmit} className="card">
            <h2 className="panel-section-title">2. Schedule & Logistics</h2>

            <div className="form-group mt-md">
              <label className="form-label">Authorized Placement Officer</label>
              <input
                type="text"
                className="form-input"
                value={`${user.email} (ID: #${user.id})`}
                disabled
                style={{ background: "var(--bg-surface)", color: "var(--text-secondary)", fontWeight: 500 }}
              />
            </div>

            <div className="form-group mt-md">
              <label className="form-label">Test Date & Time *</label>
              <input
                type="datetime-local"
                name="testDateTime"
                value={form.testDateTime}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group mt-md">
              <label className="form-label">Interview Date & Time *</label>
              <input
                type="datetime-local"
                name="interviewDateTime"
                value={form.interviewDateTime}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group mt-md">
              <label className="form-label">Result Date * (No time required)</label>
              <input
                type="date"
                name="resultDate"
                value={form.resultDate}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group mt-md">
              <label className="form-label">Venue *</label>
              <input
                type="text"
                name="venue"
                value={form.venue}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. Seminar Hall, Block A / Online"
                required
              />
            </div>

            <div className="mt-xl">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving || !form.requestId}
                style={{ width: "100%", padding: "12px" }}
              >
                {saving ? "Creating Drive..." : "Create Drive"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .create-drive-layout {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: var(--space-lg);
          align-items: start;
        }

        .panel-section-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          border-bottom: 2px solid var(--border);
          padding-bottom: var(--space-sm);
        }

        .request-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: var(--space-2xl) var(--space-lg);
          border: 2px dashed var(--border);
          border-radius: var(--radius-lg);
          color: var(--text-muted);
          background: var(--bg-input);
        }

        .placeholder-icon {
          font-size: 2.5rem;
          margin-bottom: var(--space-md);
          opacity: 0.5;
        }

        .request-details-card {
          background: var(--bg-input);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: var(--space-lg);
        }

        .details-card-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--accent);
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-md);
        }

        .details-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .details-item.full-width {
          grid-column: span 2;
        }

        .details-label {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .details-value {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .details-value.highlight {
          color: var(--accent);
          font-size: 1rem;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 2px;
        }

        .tag-badge {
          background: var(--accent-subtle);
          color: var(--accent);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
          border: 1px solid rgba(159, 132, 227, 0.15);
        }

        .tag-badge.all {
          background: var(--success-bg);
          color: var(--success);
          border-color: rgba(5, 150, 105, 0.15);
        }

        @media (max-width: 900px) {
          .create-drive-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}
