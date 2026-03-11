"use client";

const GUEST_KEY = "sift_guest";

export function setGuestFlag() {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(GUEST_KEY, "1");
  }
}

export function hasGuestFlag(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(GUEST_KEY) === "1";
}

interface AuthGateModalProps {
  onContinueAsGuest: () => void;
  onSignIn: () => void;
}

export default function AuthGateModal({
  onContinueAsGuest,
  onSignIn,
}: AuthGateModalProps) {
  return (
    <div
      className="sift-auth-gate"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "hsl(var(--background))",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          maxWidth: 400,
          width: "100%",
          textAlign: "center",
        }}
      >
        <h1
          className="sift-hero-heading"
          style={{ marginBottom: "1rem", fontSize: "1.75rem" }}
        >
          Welcome to Sift
        </h1>
        <p
          className="sift-text-sm"
          style={{
            color: "hsl(var(--secondary))",
            lineHeight: 1.6,
            marginBottom: "2rem",
          }}
        >
          Find events in NYC that match what you care about. Sign in to save your
          taste and get personalized recommendations.
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <button
            type="button"
            onClick={onSignIn}
            className="sift-btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
          >
            Sign in to save your taste
          </button>
          <button
            type="button"
            onClick={onContinueAsGuest}
            className="sift-btn-ghost"
            style={{
              width: "100%",
              justifyContent: "center",
              padding: "0.875rem 1rem",
            }}
          >
            Continue without signing in
          </button>
        </div>
      </div>
    </div>
  );
}
