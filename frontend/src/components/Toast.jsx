import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3500) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type} animate-scale-in`}
            onClick={() => removeToast(toast.id)}
          >
            <span className="toast-icon">
              {toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : toast.type === "warning" ? "⚠" : "ℹ"}
            </span>
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={() => removeToast(toast.id)}>×</button>
          </div>
        ))}
      </div>
      <style>{`
        .toast-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 380px;
          pointer-events: none;
        }
        .toast {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 500;
          box-shadow: var(--shadow-lg);
          backdrop-filter: blur(12px);
          cursor: pointer;
          pointer-events: auto;
          border: 1px solid transparent;
          transition: transform 0.2s;
        }
        .toast:hover { transform: translateY(-2px); }
        .toast-success {
          background: var(--success-bg);
          color: var(--success);
          border-color: rgba(52, 211, 153, 0.2);
        }
        .toast-error {
          background: var(--danger-bg);
          color: var(--danger);
          border-color: rgba(248, 113, 113, 0.2);
        }
        .toast-warning {
          background: var(--warning-bg);
          color: var(--warning);
          border-color: rgba(251, 191, 36, 0.2);
        }
        .toast-info {
          background: var(--info-bg);
          color: var(--info);
          border-color: rgba(96, 165, 250, 0.2);
        }
        .toast-icon {
          font-size: 1rem;
          font-weight: 700;
          flex-shrink: 0;
        }
        .toast-message { flex: 1; line-height: 1.4; }
        .toast-close {
          background: none;
          border: none;
          color: currentColor;
          cursor: pointer;
          font-size: 1.1rem;
          opacity: 0.6;
          padding: 0 2px;
          flex-shrink: 0;
        }
        .toast-close:hover { opacity: 1; }
        @media (max-width: 480px) {
          .toast-container { left: 16px; right: 16px; bottom: 16px; max-width: none; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
