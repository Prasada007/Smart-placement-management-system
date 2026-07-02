import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      gap: "var(--space-lg)",
      background: "var(--bg-base)",
      padding: "var(--space-xl)",
    }}>
      <div style={{ fontSize: "6rem", lineHeight: 1 }}>🔍</div>
      <div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "var(--space-sm)", color: "var(--text-primary)" }}>
          404 — Page Not Found
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          The page you're looking for doesn't exist.
        </p>
      </div>
      <button className="btn btn-primary" onClick={() => navigate(-1)}>
        ← Go Back
      </button>
    </div>
  );
}
