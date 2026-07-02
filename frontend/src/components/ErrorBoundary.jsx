import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-base)",
          textAlign: "center",
          gap: "20px",
          padding: "40px",
        }}>
          <div style={{ fontSize: "4rem" }}>⚠️</div>
          <h2 style={{ color: "var(--text-primary)", fontSize: "1.4rem", fontWeight: 700 }}>
            Something went wrong
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: 400 }}>
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.history.back();
            }}
          >
            ← Go Back
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
