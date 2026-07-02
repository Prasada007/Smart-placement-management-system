import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const BRANCHES = ["CSE", "ECE", "EEE", "ME", "CE", "IT", "IS", "CH", "BT"];

const studentInitial = {
  rollNumber: "",
  name: "",
  email: "",
  phone: "",
  branch: "CSE",
  cgpa: "",
  yearOfPassing: new Date().getFullYear() + 1,
  password: "",
  confirmPassword: "",
};

const companyInitial = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function Register() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("student"); // "student" | "company"
  const [studentForm, setStudentForm] = useState(studentInitial);
  const [companyForm, setCompanyForm] = useState(companyInitial);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleStudentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStudentForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleCompanyChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCompanyForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (studentForm.password !== studentForm.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = studentForm;
      payload.cgpa = parseFloat(payload.cgpa);
      payload.yearOfPassing = parseInt(payload.yearOfPassing);
      await api.post("/students/register", payload);
      setMessage({ type: "success", text: "Registration successful! Please login." });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Registration failed." });
    } finally {
      setLoading(false);
    }
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (companyForm.password !== companyForm.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }
    setLoading(true);
    try {
      await api.post("/companies/register", {
        name: companyForm.name,
        email: companyForm.email,
        password: companyForm.password,
      });
      setMessage({ type: "success", text: "Company registered! Please wait for admin approval, then login to set your requirements." });
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Registration failed." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-bg-glow register-bg-glow-1" />
      <div className="register-bg-glow register-bg-glow-2" />

      <div className="register-container animate-fade-in">
        {/* Brand */}
        <div className="register-brand">
          <img
            src="/HariVo_Full.png"
            alt="HireVo — Smart Placement Management"
            style={{
              width: "280px",
              maxWidth: "90%",
              objectFit: "contain",
              marginBottom: "var(--space-md)",
              filter: "drop-shadow(0 8px 24px rgba(124, 93, 212, 0.25))"
            }}
          />
          <p className="register-subtitle">Create your account</p>
        </div>

        {/* Tab Switcher */}
        <div className="register-tabs">
          <button
            className={`register-tab ${tab === "student" ? "active" : ""}`}
            onClick={() => { setTab("student"); setMessage(null); }}
          >
            👤 Student
          </button>
          <button
            className={`register-tab ${tab === "company" ? "active" : ""}`}
            onClick={() => { setTab("company"); setMessage(null); }}
          >
            🏢 Company
          </button>
        </div>

        {/* Card */}
        <div className="register-card animate-scale-in">
          {tab === "student" ? (
            <h2 className="register-card-title">Student Registration</h2>
          ) : (
            <h2 className="register-card-title">Company Registration</h2>
          )}

          {message && (
            <div className={`register-msg ${message.type === "success" ? "register-msg-success" : "register-msg-error"}`}>
              {message.type === "success" ? "✓" : "⚠"} {message.text}
            </div>
          )}

          {tab === "student" ? (
            <form onSubmit={handleStudentSubmit} className="register-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" name="name" value={studentForm.name} onChange={handleStudentChange} placeholder="Your full name" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Roll Number *</label>
                  <input className="form-input" name="rollNumber" value={studentForm.rollNumber} onChange={handleStudentChange} placeholder="e.g. CS21B001" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input className="form-input" type="email" name="email" value={studentForm.email} onChange={handleStudentChange} placeholder="student@college.edu" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone *</label>
                  <input className="form-input" type="tel" name="phone" value={studentForm.phone} onChange={handleStudentChange} placeholder="10-digit phone" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Branch *</label>
                  <select className="form-select" name="branch" value={studentForm.branch} onChange={handleStudentChange}>
                    {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">CGPA *</label>
                  <input className="form-input" type="number" step="0.01" min="0" max="10" name="cgpa" value={studentForm.cgpa} onChange={handleStudentChange} placeholder="e.g. 8.5" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Year of Passing *</label>
                <input className="form-input" type="number" name="yearOfPassing" value={studentForm.yearOfPassing} onChange={handleStudentChange} min="2024" max="2030" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input className="form-input" type="password" name="password" value={studentForm.password} onChange={handleStudentChange} placeholder="Min. 8 characters" required minLength={6} />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password *</label>
                  <input className="form-input" type="password" name="confirmPassword" value={studentForm.confirmPassword} onChange={handleStudentChange} placeholder="Repeat password" required />
                </div>
              </div>
              <button type="submit" className="btn btn-primary register-btn" disabled={loading}>
                {loading ? "Registering..." : "Create Student Account"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleCompanySubmit} className="register-form">
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input className="form-input" name="name" value={companyForm.name} onChange={handleCompanyChange} placeholder="e.g. TechCorp Pvt Ltd" required />
              </div>
              <div className="form-group">
                <label className="form-label">Official Email *</label>
                <input className="form-input" type="email" name="email" value={companyForm.email} onChange={handleCompanyChange} placeholder="hr@company.com" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input className="form-input" type="password" name="password" value={companyForm.password} onChange={handleCompanyChange} placeholder="Min. 6 characters" required minLength={6} />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password *</label>
                  <input className="form-input" type="password" name="confirmPassword" value={companyForm.confirmPassword} onChange={handleCompanyChange} placeholder="Repeat password" required />
                </div>
              </div>
              <div className="register-info-box">
                <span>ℹ️</span>
                <span>After admin approval, login to set your job requirements (role, salary, branches, skills).</span>
              </div>
              <button type="submit" className="btn btn-primary register-btn" disabled={loading}>
                {loading ? "Submitting..." : "Register Company"}
              </button>
            </form>
          )}

          <div className="register-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>

      <style>{`
        .register-page {
          min-height: 100vh;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          background: #f8f7fc;
          background-image: 
            radial-gradient(rgba(159, 132, 227, 0.18) 1.2px, transparent 1.2px),
            radial-gradient(rgba(159, 132, 227, 0.18) 1.2px, transparent 1.2px);
          background-size: 28px 28px;
          background-position: 0 0, 14px 14px;
          position: relative;
          overflow: hidden;
          padding: var(--space-xl) var(--space-lg);
        }
        .register-bg-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.3;
          pointer-events: none;
        }
        .register-bg-glow-1 { width: 500px; height: 500px; background: var(--accent); top: -180px; right: -120px; }
        .register-bg-glow-2 { width: 400px; height: 400px; background: #34d399; bottom: -100px; left: -80px; }
        .register-container {
          width: 100%;
          max-width: 680px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        .register-brand {
          text-align: center;
          margin-bottom: var(--space-xl);
        }
        .register-logo {
          width: 64px; height: 64px;
          border-radius: var(--radius-xl);
          background: rgba(255,255,255,0.92);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto var(--space-md);
          padding: 8px;
          box-shadow: 0 8px 32px var(--accent-glow);
        }
        .register-title {
          font-size: 2rem; font-weight: 800;
          background: linear-gradient(135deg, var(--text-primary), var(--accent));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .register-subtitle { color: var(--text-muted); font-size: 0.88rem; }
        .register-tabs {
          display: flex; gap: 4px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 4px;
          margin-bottom: var(--space-lg);
          width: 100%;
          max-width: 320px;
        }
        .register-tab {
          flex: 1; padding: 10px 16px;
          border-radius: var(--radius-md);
          border: none; background: none;
          color: var(--text-secondary);
          font-size: 0.875rem; font-weight: 500;
          cursor: pointer; transition: all var(--transition-fast);
          font-family: var(--font);
        }
        .register-tab.active {
          background: var(--accent);
          color: #fff;
          box-shadow: 0 2px 8px var(--accent-glow);
        }
        .register-card {
          width: 100%;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: var(--space-xl);
          backdrop-filter: blur(24px);
          box-shadow: var(--shadow-lg);
        }
        .register-card-title {
          font-size: 1.2rem; font-weight: 700;
          color: var(--text-primary);
          margin-bottom: var(--space-lg);
        }
        .register-msg {
          padding: 10px 14px;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: var(--space-md);
          display: flex; align-items: center; gap: 8px;
        }
        .register-msg-success { background: var(--success-bg); color: var(--success); }
        .register-msg-error { background: var(--danger-bg); color: var(--danger); }
        .register-form { display: flex; flex-direction: column; gap: var(--space-md); }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md); }
        .register-checkbox-label {
          display: flex; align-items: center; gap: 10px;
          cursor: pointer; color: var(--text-secondary);
          font-size: 0.875rem;
        }
        .register-checkbox { width: 16px; height: 16px; cursor: pointer; accent-color: var(--accent); }
        .register-btn { width: 100%; padding: 12px; font-size: 0.95rem; font-weight: 600; margin-top: 4px; }
        .register-footer {
          margin-top: var(--space-lg);
          padding-top: var(--space-md);
          border-top: 1px solid var(--border);
          text-align: center;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        @media (max-width: 600px) {
          .form-row { grid-template-columns: 1fr; }
          .register-card { padding: var(--space-lg) var(--space-md); }
        }
      `}</style>
    </div>
  );
}
