import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, role, id } = res.data.data;

      login(token, role, id, email);

      if (role === "STUDENT") navigate("/student/dashboard");
      else if (role === "ADMIN") navigate("/admin/dashboard");
      else if (role === "COMPANY") navigate("/company/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background decoration */}
      <div className="login-bg-glow login-bg-glow-1" />
      <div className="login-bg-glow login-bg-glow-2" />

      <div className="login-container animate-fade-in">
        {/* Logo / Brand */}
        <div className="login-brand">
          <img
            src="/HariVo_Full.png"
            alt="HireVo — Smart Placement Management"
            style={{
              width: "320px",
              maxWidth: "90%",
              objectFit: "contain",
              marginBottom: "var(--space-lg)",
              filter: "drop-shadow(0 8px 24px rgba(124, 93, 212, 0.25))"
            }}
          />
        </div>

        {/* Login Card */}
        <div className="login-card animate-fade-in delay-2">
          <h2 className="login-card-title">Welcome back</h2>
          <p className="login-card-desc">
            Sign in to access your placement portal
          </p>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">
                Email Address
              </label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">✉️</span>
                <input
                  id="login-email"
                  type="email"
                  className="form-input login-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">
                Password
              </label>
              <div className="login-input-wrapper">
                <span className="login-input-icon">🔒</span>
                <input
                  id="login-password"
                  type="password"
                  className="form-input login-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="login-error animate-scale-in">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary login-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="login-spinner" />
              ) : null}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="login-footer">
            <p>
              All roles (Student, Admin, Company) use this single login.
              <br />
              Your role is detected automatically.
            </p>
            <p style={{ marginTop: "var(--space-sm)" }}>
              New here? <Link to="/register" style={{ color: "var(--accent)", fontWeight: 500 }}>Create an account</Link>
            </p>
          </div>
        </div>

        <p className="login-copyright">
          © 2026 HireVo — Smart Placement Management
        </p>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #ede9fe 0%, #dbeafe 100%);
          position: relative;
          overflow: hidden;
          padding: var(--space-lg);
        }

        /* Diagonal Vite-logo pattern for login background */
        .login-page::before {
          content: "";
          position: absolute;
          top: -60%;
          left: -60%;
          width: 220%;
          height: 220%;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 110'%3E%3Cpath d='M5 18L95 18L52 98Z' fill='%239f84e3'/%3E%3Cpath d='M47 18L95 18L52 55Z' fill='%2393c5fd'/%3E%3C/svg%3E");
          background-size: 90px 90px;
          background-repeat: repeat;
          opacity: 0.07;
          transform: rotate(-28deg);
          pointer-events: none;
          z-index: 0;
        }

        /* Animated gradient blobs in background */
        .login-bg-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.35;
          pointer-events: none;
          animation: floatGlow 8s ease-in-out infinite alternate;
        }
        .login-bg-glow-1 {
          width: 500px;
          height: 500px;
          background: var(--accent);
          top: -150px;
          right: -100px;
        }
        .login-bg-glow-2 {
          width: 400px;
          height: 400px;
          background: #34d399;
          bottom: -120px;
          left: -80px;
          animation-delay: 4s;
        }

        @keyframes floatGlow {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, -20px) scale(1.1); }
        }

        .login-container {
          width: 100%;
          max-width: 420px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 1;
        }

        /* Brand area */
        .login-brand {
          text-align: center;
          margin-bottom: var(--space-xl);
        }

        .login-logo {
          width: 72px;
          height: 72px;
          border-radius: var(--radius-xl);
          background: rgba(255,255,255,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto var(--space-md);
          box-shadow: 0 8px 32px var(--accent-glow);
          animation: pulse-logo 3s ease-in-out infinite;
          padding: 8px;
        }

        @keyframes pulse-logo {
          0%, 100% { box-shadow: 0 8px 32px var(--accent-glow); }
          50% { box-shadow: 0 8px 48px var(--accent-glow), 0 0 64px var(--accent-glow); }
        }

        .login-logo-icon {
          font-size: 2rem;
        }

        .login-title {
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          background: linear-gradient(135deg, var(--text-primary), var(--accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 4px;
        }

        .login-subtitle {
          color: var(--text-muted);
          font-size: 0.88rem;
          font-weight: 400;
        }

        /* Card */
        .login-card {
          width: 100%;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: var(--space-xl) var(--space-lg);
          backdrop-filter: blur(24px);
          box-shadow: var(--shadow-lg);
        }

        .login-card-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .login-card-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: var(--space-lg);
        }

        /* Form */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .login-input-wrapper {
          position: relative;
        }

        .login-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.95rem;
          pointer-events: none;
          opacity: 0.6;
        }

        .login-input {
          padding-left: 42px !important;
        }

        .login-btn {
          width: 100%;
          padding: 12px 20px;
          font-size: 0.95rem;
          font-weight: 600;
          margin-top: var(--space-sm);
          position: relative;
          gap: var(--space-sm);
        }

        .login-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Error message */
        .login-error {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: 10px 14px;
          border-radius: var(--radius-md);
          background: var(--danger-bg);
          color: var(--danger);
          font-size: 0.85rem;
          font-weight: 500;
        }

        /* Footer */
        .login-footer {
          margin-top: var(--space-lg);
          padding-top: var(--space-md);
          border-top: 1px solid var(--border);
          text-align: center;
        }

        .login-footer p {
          font-size: 0.78rem;
          color: var(--text-muted);
          line-height: 1.6;
        }

        .login-copyright {
          margin-top: var(--space-lg);
          font-size: 0.75rem;
          color: var(--text-muted);
          opacity: 0.5;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: var(--space-lg) var(--space-md);
          }
          .login-title {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
}