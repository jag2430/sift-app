"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";

interface NavProps {
  onReset: () => void;
  showButton?: boolean;
  onProfileClick?: () => void;
  isLoggedIn?: boolean;
  userEmail?: string;
  userDisplayName?: string;
}

export default function Nav({
  onReset,
  showButton = false,
  onProfileClick,
  isLoggedIn = false,
  userEmail = "",
  userDisplayName,
}: NavProps) {
  const displayLabel = userDisplayName || userEmail || "";
  const avatarLetter = displayLabel ? displayLabel[0].toUpperCase() : null;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`sift-nav ${scrolled ? "sift-nav--scrolled" : ""}`}>
      <div className="sift-nav-inner">
        <button onClick={onReset} className="sift-logo">
          Sift
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {showButton && (
            <button
              onClick={onReset}
              className="sift-btn-primary sift-btn-primary-sm"
            >
              Start Over
            </button>
          )}
          <button
            type="button"
            aria-label="Profile"
            onClick={onProfileClick}
            style={{
              width: 40,
              height: 40,
              borderRadius: 9999,
              border: "1px solid hsl(var(--border))",
              background: isLoggedIn ? "hsl(var(--primary))" : "transparent",
              color: isLoggedIn ? "white" : "hsl(var(--foreground))",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: avatarLetter ? "1.125rem" : undefined,
              fontWeight: avatarLetter ? 600 : undefined,
            }}
          >
            {avatarLetter ? avatarLetter : <User size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>
    </nav>
  );
}