"use client";

import { useEffect } from "react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function BottomSheet({
  open,
  onClose,
  title,
  children,
}: BottomSheetProps) {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Close"
        className="sift-bottom-sheet-backdrop"
        onClick={onClose}
        style={{ border: "none", cursor: "pointer" }}
      />
      <div
        className="sift-bottom-sheet-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "bottom-sheet-title" : undefined}
      >
        {title && (
          <div
            style={{
              padding: "1rem 1.5rem",
              borderBottom: "1px solid hsl(var(--border))",
              fontWeight: 600,
              fontSize: "1rem",
            }}
            id="bottom-sheet-title"
          >
            {title}
          </div>
        )}
        <div style={{ padding: "1rem 1.5rem" }}>{children}</div>
      </div>
    </>
  );
}
