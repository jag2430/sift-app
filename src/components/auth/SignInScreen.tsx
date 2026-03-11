"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";

interface SignInScreenProps {
  onSuccess: (email: string, displayName?: string) => void;
  onContinueAsGuest: () => void;
  onBack?: () => void;
}

export default function SignInScreen({
  onSuccess,
  onContinueAsGuest,
  onBack,
}: SignInScreenProps) {
  const [isCreateAccount, setIsCreateAccount] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    if (!trimmedEmail || !trimmedPassword) return;
    onSuccess(trimmedEmail, displayName.trim() || undefined);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "hsl(var(--background))",
      }}
    >
      <div
        style={{
          padding: "1rem 1.5rem",
          borderBottom: "1px solid hsl(var(--border))",
        }}
      >
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="sift-btn-ghost"
            style={{ marginBottom: 0 }}
          >
            <ArrowLeft size={16} strokeWidth={1.5} />
            Back
          </button>
        ) : (
          <div style={{ height: 40 }} />
        )}
      </div>
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: 400, width: "100%" }}>
          <h1
            className="sift-section-heading"
            style={{ marginBottom: 8, textAlign: "center" }}
          >
            {isCreateAccount ? "Create account" : "Sign in"}
          </h1>
          <p
            className="sift-text-sm"
            style={{
              color: "hsl(var(--secondary))",
              textAlign: "center",
              marginBottom: 24,
            }}
          >
            We&rsquo;ll use this to personalize your experience. No real auth
            for this demo.
          </p>
          <form onSubmit={handleSubmit}>
            <label
              htmlFor="signin-displayname"
              className="sift-text-sm"
              style={{
                display: "block",
                fontWeight: 500,
                marginBottom: 6,
                color: "hsl(var(--foreground))",
              }}
            >
              Username
            </label>
            <input
              id="signin-displayname"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How we'll show you on profile"
              autoComplete="username"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius)",
                border: "1px solid hsl(var(--border))",
                fontSize: 16,
                marginBottom: 16,
                boxSizing: "border-box",
              }}
            />
            <label
              htmlFor="signin-email"
              className="sift-text-sm"
              style={{
                display: "block",
                fontWeight: 500,
                marginBottom: 6,
                color: "hsl(var(--foreground))",
              }}
            >
              Email
            </label>
            <input
              id="signin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius)",
                border: "1px solid hsl(var(--border))",
                fontSize: 16,
                marginBottom: 16,
                boxSizing: "border-box",
              }}
            />
            <label
              htmlFor="signin-password"
              className="sift-text-sm"
              style={{
                display: "block",
                fontWeight: 500,
                marginBottom: 6,
                color: "hsl(var(--foreground))",
              }}
            >
              Password
            </label>
            <input
              id="signin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={isCreateAccount ? "new-password" : "current-password"}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius)",
                border: "1px solid hsl(var(--border))",
                fontSize: 16,
                marginBottom: 24,
                boxSizing: "border-box",
              }}
            />
            <button
              type="submit"
              className="sift-btn-primary"
              disabled={!email.trim() || !password.trim()}
              style={{
                width: "100%",
                justifyContent: "center",
                opacity: !email.trim() || !password.trim() ? 0.6 : 1,
                cursor:
                  !email.trim() || !password.trim() ? "not-allowed" : "pointer",
              }}
            >
              {isCreateAccount ? "Create Account" : "Sign In"}
            </button>
          </form>
          <button
            type="button"
            onClick={() => setIsCreateAccount(!isCreateAccount)}
            className="sift-btn-ghost"
            style={{
              width: "100%",
              marginTop: 12,
              justifyContent: "center",
            }}
          >
            {isCreateAccount
              ? "Already have an account? Sign in"
              : "Create an account instead"}
          </button>
          <p
            className="sift-text-sm"
            style={{
              textAlign: "center",
              marginTop: 24,
              color: "hsl(var(--secondary))",
            }}
          >
            <button
              type="button"
              onClick={onContinueAsGuest}
              className="sift-btn-ghost"
              style={{ padding: 0, textDecoration: "underline" }}
            >
              Continue as guest
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
