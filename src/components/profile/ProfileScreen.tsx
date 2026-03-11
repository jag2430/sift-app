"use client";

import { ArrowLeft, User } from "lucide-react";
import CalendarSection from "./CalendarSection";
import SavedListsSection from "./SavedListsSection";
import { useUser } from "@/context/UserContext";

const VIBE_LABELS: Record<string, string> = {
  hidden_gems: "Show me the hidden gems",
  popular_spots: "I like popular spots",
  surprise_me: "Surprise me",
};

const BUDGET_LABELS: Record<string, string> = {
  free: "Free only",
  under_20: "Under $20",
  under_50: "Under $50",
  no_limit: "No limit",
};

const INTEREST_LABELS: Record<string, string> = {
  live_music: "Live music & concerts",
  art_exhibitions: "Art exhibitions & galleries",
  popups: "Pop-ups & sample sales",
  outdoor: "Outdoor activities",
  fitness: "Fitness & run clubs",
  comedy: "Comedy & shows",
  food: "Food events & tastings",
  nightlife: "Nightlife & bars",
  theater: "Theater & performances",
  workshops: "Workshops & classes",
};

interface ProfileScreenProps {
  onEditPreferences: () => void;
  onSignIn: () => void;
  onBackToDiscover?: () => void;
}

export default function ProfileScreen({
  onEditPreferences,
  onSignIn,
  onBackToDiscover,
}: ProfileScreenProps) {
  const {
    isLoggedIn,
    userEmail,
    userDisplayName,
    userProfile,
    savedEvents,
    goingEvents,
    createdAt,
  } = useUser();

  const displayLabel = userDisplayName || userEmail || "Guest";
  const avatarLetter =
    isLoggedIn && (userDisplayName || userEmail)
      ? (userDisplayName || userEmail)[0].toUpperCase()
      : null;

  return (
    <div
      style={{
        padding: "1rem 1.5rem 2rem",
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
      {onBackToDiscover && (
        <button
          type="button"
          onClick={onBackToDiscover}
          className="sift-btn-ghost"
          style={{ marginBottom: 16 }}
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Back to Discover
        </button>
      )}
      <header style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 9999,
              background: isLoggedIn
                ? "hsl(var(--primary))"
                : "transparent",
              border: isLoggedIn ? "none" : "2px solid hsl(var(--border))",
              color: isLoggedIn ? "white" : "hsl(var(--secondary))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.25rem",
              fontWeight: 600,
            }}
          >
            {avatarLetter ? (
              avatarLetter
            ) : (
              <User size={24} strokeWidth={1.5} />
            )}
          </div>
          <div>
            <p
              className="sift-text-sm"
              style={{
                fontWeight: 600,
                color: "hsl(var(--foreground))",
                marginBottom: 4,
              }}
            >
              {displayLabel}
            </p>
            <button
              type="button"
              onClick={onEditPreferences}
              className="sift-btn-ghost"
              style={{ padding: 0, fontSize: "0.875rem" }}
            >
              Edit preferences
            </button>
          </div>
        </div>
        {!isLoggedIn && (
          <button
            type="button"
            onClick={onSignIn}
            className="sift-btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
          >
            Sign in to save your taste
          </button>
        )}
      </header>

      <CalendarSection goingEvents={goingEvents} savedEvents={savedEvents} />

      <SavedListsSection onRequestSignIn={onSignIn} />

      {userProfile && (
        <section style={{ marginBottom: 32 }}>
          <h3 className="sift-h3" style={{ marginBottom: 16 }}>
            My Preferences
          </h3>
          <div
            className="sift-card"
            style={{
              padding: "1rem 1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {userProfile.interests.length > 0 && (
              <div>
                <span className="sift-text-xs" style={{ color: "hsl(var(--secondary))" }}>
                  Interests:
                </span>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                    marginTop: 6,
                  }}
                >
                  {userProfile.interests.map((i) => (
                    <span
                      key={i}
                      className="sift-filter-pill"
                    >
                      {INTEREST_LABELS[i] ?? i}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {userProfile.neighborhood && (
              <p className="sift-text-sm">
                <span style={{ color: "hsl(var(--secondary))" }}>Neighborhood: </span>
                {userProfile.neighborhood}, {userProfile.borough}
              </p>
            )}
            {userProfile.travelRange && (
              <p className="sift-text-sm">
                <span style={{ color: "hsl(var(--secondary))" }}>Travel range: </span>
                {userProfile.travelRange}
              </p>
            )}
            {userProfile.vibe && (
              <p className="sift-text-sm">
                <span style={{ color: "hsl(var(--secondary))" }}>Vibe: </span>
                {VIBE_LABELS[userProfile.vibe] ?? userProfile.vibe}
              </p>
            )}
            {userProfile.budget && (
              <p className="sift-text-sm">
                <span style={{ color: "hsl(var(--secondary))" }}>Budget: </span>
                {BUDGET_LABELS[userProfile.budget] ?? userProfile.budget}
              </p>
            )}
            {(userProfile.freeDays?.length > 0 || userProfile.freeTime?.length > 0) && (
              <p className="sift-text-sm">
                <span style={{ color: "hsl(var(--secondary))" }}>Availability: </span>
                {userProfile.freeDays?.join(", ")} · {userProfile.freeTime?.join(", ")}
              </p>
            )}
            <button
              type="button"
              onClick={onEditPreferences}
              className="sift-btn-ghost"
              style={{ alignSelf: "flex-start" }}
            >
              Edit
            </button>
          </div>
        </section>
      )}

      <section style={{ marginBottom: 24 }}>
        <h3 className="sift-h3" style={{ marginBottom: 8 }}>
          Quick Stats
        </h3>
        <p className="sift-text-sm" style={{ color: "hsl(var(--secondary))" }}>
          {savedEvents.length} events saved · {goingEvents.length} events going
          {createdAt && (
            <> · Member since {new Date(createdAt).toLocaleDateString("en-US")}</>
          )}
        </p>
      </section>
    </div>
  );
}
