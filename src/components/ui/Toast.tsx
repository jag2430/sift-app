"use client";

import { createContext, useCallback, useContext, useState } from "react";

const TOAST_DURATION = 2000;

interface ToastContextValue {
  message: string | null;
  showToast: (msg: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setMessage(msg);
    window.setTimeout(() => setMessage(null), TOAST_DURATION);
  }, []);

  return (
    <ToastContext.Provider value={{ message, showToast }}>
      {children}
      {message != null && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 200,
            padding: "12px 20px",
            borderRadius: "var(--radius)",
            background: "hsl(var(--foreground))",
            color: "hsl(var(--background))",
            fontSize: "0.875rem",
            fontWeight: 500,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            maxWidth: "calc(100vw - 48px)",
            animation: "sift-toast-in 0.25s ease-out",
          }}
        >
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
