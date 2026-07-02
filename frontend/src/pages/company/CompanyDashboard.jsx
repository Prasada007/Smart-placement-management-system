import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";
import { useToast } from "../../components/Toast";
import DataTable from "../../components/DataTable";

const reqInitial = {
  jobRole: "",
  salaryLpa: "",
  minCgpa: "",
  allowedBranches: "",
  requiredSkills: "",
  backlogAllowed: false,
};

export default function CompanyDashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [company, setCompany] = useState(null);
  const [drives, setDrives] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReqForm, setShowReqForm] = useState(false);
  const [reqForm, setReqForm] = useState(reqInitial);
  const [saving, setSaving] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const companyId = Number(user.id);
      const [companyRes, drivesRes, reqsRes] = await Promise.all([
        api.get(`/companies/${companyId}`),
        api.get("/drives"),
        api.get(`/requests/company/${companyId}`)
      ]);
      
      setCompany(companyRes.data?.data || null);
      setRequests(reqsRes.data?.data || []);
      
      const allDrives = drivesRes.data?.data || [];
      setDrives(allDrives.filter((d) => Number(d.company?.id) === companyId));
    } catch (err) {
      console.error("Company dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user.id]);

  const handleReqChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReqForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleReqSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        jobRole: reqForm.jobRole,
        salaryLpa: parseFloat(reqForm.salaryLpa),
        minCgpa: reqForm.minCgpa ? parseFloat(reqForm.minCgpa) : null,
        allowedBranches: reqForm.allowedBranches,
        requiredSkills: reqForm.requiredSkills,
        backlogAllowed: reqForm.backlogAllowed,
      };
      await api.post(`/requests/company/${Number(user.id)}`, payload);
      setShowReqForm(false);
      setReqForm(reqInitial);
      addToast("Placement request submitted successfully!", "success");
      fetchDashboardData(); // refresh list
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to submit request", "error");
    } finally {
      setSaving(false);
    }
  };

  const totalApplicants = drives.reduce((sum, d) => sum + (d.applicationCount || 0), 0);

  if (loading) {
    return (
      <DashboardLayout pageTitle="Company Dashboard">
        <div className="page-grid grid-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 110, borderRadius: 16 }} />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  const columns = [
    { header: "Job Role", accessor: "jobRole" },
    { header: "Salary (LPA)", accessor: (r) => `₹${r.salaryLpa}` },
    { header: "Min CGPA", accessor: (r) => r.minCgpa || "None" },
    { header: "Date", accessor: (r) => new Date(r.createdAt).toLocaleDateString() },
    { 
      header: "Status", 
      accessor: (r) => <StatusBadge status={r.status} /> 
    },
  ];

  return (
    <DashboardLayout pageTitle="Company Dashboard">
      <div className="page-header animate-fade-in">
        <h1 className="page-title">Welcome, {company?.name || "Company"} 🏢</h1>
        <p className="page-subtitle">Your placement portal overview</p>
      </div>

      {/* Stat Cards */}
      <div className="page-grid grid-3 mb-lg animate-fade-in delay-1">
        <StatCard icon="🚀" label="Total Drives" value={drives.length} color="accent" delay={1} />
        <StatCard icon="👥" label="Total Applicants" value={totalApplicants} color="info" delay={2} />
        <StatCard
          icon="📋"
          label="Status"
          value={company?.status || "—"}
          color={company?.status === "APPROVED" ? "success" : "warning"}
          delay={3}
        />
      </div>

      <div className="card animate-fade-in delay-2 mb-lg">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="card-title">🏢 My Placement Requests</h3>
          <button className="btn btn-primary btn-sm" onClick={() => setShowReqForm(true)}>
            + New Request
          </button>
        </div>
        
        {requests.length > 0 ? (
          <DataTable columns={columns} data={requests} keyExtractor={(r) => r.id} />
        ) : (
          <div className="empty-state">
            <span style={{ fontSize: "2rem" }}>📝</span>
            <p>You haven't submitted any placement requests yet.</p>
            <button className="btn-link" onClick={() => setShowReqForm(true)}>
              Submit your first request
            </button>
          </div>
        )}
      </div>

      {/* New Request Modal */}
      {showReqForm && (
        <div className="modal-overlay">
          <div className="modal-content card animate-scale-in" style={{ maxWidth: '600px', width: '100%' }}>
            <div className="card-header">
              <h3 className="card-title">📝 New Job Requirement</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowReqForm(false)}>✕</button>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "var(--space-md)" }}>
              Fill in what kind of students you're looking for. The admin will review this and create a drive.
            </p>
            <form onSubmit={handleReqSubmit} className="req-form">
              <div className="req-form-grid">
                <div className="form-group">
                  <label className="form-label">Job Role *</label>
                  <input className="form-input" name="jobRole" value={reqForm.jobRole}
                    onChange={handleReqChange} placeholder="e.g. Software Engineer" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Salary Package (LPA) *</label>
                  <input className="form-input" type="number" step="0.1" name="salaryLpa"
                    value={reqForm.salaryLpa} onChange={handleReqChange} placeholder="e.g. 8.5" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Minimum CGPA</label>
                  <input className="form-input" type="number" step="0.01" min="0" max="10"
                    name="minCgpa" value={reqForm.minCgpa} onChange={handleReqChange} placeholder="e.g. 7.0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Allowed Branches</label>
                  <input className="form-input" name="allowedBranches" value={reqForm.allowedBranches}
                    onChange={handleReqChange} placeholder="e.g. CSE,ECE,IT (comma separated)" />
                </div>
                <div className="form-group">
                  <label className="form-label">Required Skills</label>
                  <input className="form-input" name="requiredSkills" value={reqForm.requiredSkills}
                    onChange={handleReqChange} placeholder="e.g. Java,React,Spring Boot" />
                </div>
                <div className="form-group" style={{ display: "flex", alignItems: "center" }}>
                  <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 0 }}>
                    <input type="checkbox" name="backlogAllowed" checked={reqForm.backlogAllowed}
                      onChange={handleReqChange} style={{ width: 16, height: 16, accentColor: "var(--accent)" }} />
                    Backlog Allowed
                  </label>
                </div>
              </div>
              <div className="flex gap-sm mt-md">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Submitting..." : "🚀 Submit Request"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowReqForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .req-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-md);
        }
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justifyContent: center;
          z-index: 1000;
          padding: 20px;
          backdrop-filter: blur(4px);
        }
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px;
          text-align: center;
          color: var(--text-muted);
        }
        @media (max-width: 600px) {
          .req-form-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </DashboardLayout>
  );
}
