import React, { useEffect } from "react";

const AUTO_DISMISS_MS = 6000;

function Toast({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack" aria-live="polite" role="status">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div className="toast">
      <span className="toast-icon" aria-hidden="true">🔔</span>
      <div>
        <strong>{toast.titre}</strong>
        <p>{toast.message}</p>
      </div>
      <button
        type="button"
        className="toast-close"
        onClick={() => onDismiss(toast.id)}
        aria-label="Fermer la notification"
      >
        ✕
      </button>
    </div>
  );
}

export default Toast;
