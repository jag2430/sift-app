"use client";

import { Compass, User } from "lucide-react";

type Tab = "discover" | "profile";

interface AppTabsProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function AppTabs({ activeTab, onTabChange }: AppTabsProps) {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        background: "hsl(var(--card))",
        borderTop: "1px solid hsl(var(--border))",
        display: "flex",
        justifyContent: "space-around",
        padding: "0.5rem 0 max(0.5rem, env(safe-area-inset-bottom))",
      }}
    >
      <button
        type="button"
        onClick={() => onTabChange("discover")}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          padding: "8px 20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color:
            activeTab === "discover"
              ? "hsl(var(--primary))"
              : "hsl(var(--secondary))",
          fontWeight: activeTab === "discover" ? 600 : 400,
          fontSize: "0.75rem",
        }}
      >
        <Compass size={22} strokeWidth={1.5} />
        Discover
      </button>
      <button
        type="button"
        onClick={() => onTabChange("profile")}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          padding: "8px 20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color:
            activeTab === "profile"
              ? "hsl(var(--primary))"
              : "hsl(var(--secondary))",
          fontWeight: activeTab === "profile" ? 600 : 400,
          fontSize: "0.75rem",
        }}
      >
        <User size={22} strokeWidth={1.5} />
        Profile
      </button>
    </nav>
  );
}
