"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import OptionCard from "@/components/quiz/OptionCard";
import { useUser } from "@/context/UserContext";
import type { UserProfile } from "@/types/user";
import { setOnboardingDoneFlag } from "@/lib/sessionFlags";
import {
  BOROUGHS,
  BOROUGHS_NEIGHBORHOODS,
  TRAVEL_RANGES,
} from "@/data/locations";

const INTEREST_OPTIONS: { value: string; label: string }[] = [
  { value: "live_music", label: "Live music & concerts" },
  { value: "art_exhibitions", label: "Art exhibitions & galleries" },
  { value: "popups", label: "Pop-ups & sample sales" },
  { value: "outdoor", label: "Outdoor activities & day trips" },
  { value: "fitness", label: "Fitness classes & run clubs" },
  { value: "comedy", label: "Comedy & shows" },
  { value: "food", label: "Food events & tastings" },
  { value: "nightlife", label: "Nightlife & bars" },
  { value: "theater", label: "Theater & performances" },
  { value: "workshops", label: "Workshops & classes" },
];

const VIBE_OPTIONS: { value: string; label: string }[] = [
  { value: "hidden_gems", label: "Show me the hidden gems" },
  { value: "popular_spots", label: "I like popular spots" },
  { value: "surprise_me", label: "Surprise me" },
];

const BUDGET_OPTIONS: { value: string; label: string }[] = [
  { value: "free", label: "Free only" },
  { value: "under_20", label: "Under $20" },
  { value: "under_50", label: "Under $50" },
  { value: "no_limit", label: "No limit" },
];

const DAYS = [
  { value: "mon", label: "Mon" },
  { value: "tue", label: "Tue" },
  { value: "wed", label: "Wed" },
  { value: "thu", label: "Thu" },
  { value: "fri", label: "Fri" },
  { value: "sat", label: "Sat" },
  { value: "sun", label: "Sun" },
];

const TIMES = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
  { value: "late_night", label: "Late night" },
];

interface OnboardingFlowProps {
  onComplete: () => void;
  onBack?: () => void;
}

export default function OnboardingFlow({ onComplete, onBack }: OnboardingFlowProps) {
  const { setUserProfile, userProfile } = useUser();
  const [step, setStep] = useState(1);
  const [initializedFromStoredProfile, setInitializedFromStoredProfile] =
    useState(false);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    interests: [],
    borough: "",
    neighborhood: "",
    travelRange: "",
    vibe: "",
    budget: "",
    freeDays: [],
    freeTime: [],
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (initializedFromStoredProfile) return;
    if (!userProfile) return;
    setProfile({
      interests: userProfile.interests ?? [],
      borough: userProfile.borough ?? "",
      neighborhood: userProfile.neighborhood ?? "",
      travelRange: userProfile.travelRange ?? "",
      vibe: userProfile.vibe ?? "",
      budget: userProfile.budget ?? "",
      freeDays: userProfile.freeDays ?? [],
      freeTime: userProfile.freeTime ?? [],
    });
    setInitializedFromStoredProfile(true);
  }, [userProfile, initializedFromStoredProfile]);

  const neighborhoods =
    profile.borough ? BOROUGHS_NEIGHBORHOODS[profile.borough] ?? [] : [];

  const toggleInterest = useCallback((value: string) => {
    setProfile((p) => {
      const next = p.interests ?? [];
      const has = next.includes(value);
      return {
        ...p,
        interests: has ? next.filter((x) => x !== value) : [...next, value],
      };
    });
  }, []);

  const toggleDay = useCallback((value: string) => {
    setProfile((p) => {
      const next = p.freeDays ?? [];
      const has = next.includes(value);
      return {
        ...p,
        freeDays: has ? next.filter((x) => x !== value) : [...next, value],
      };
    });
  }, []);

  const toggleTime = useCallback((value: string) => {
    setProfile((p) => {
      const next = p.freeTime ?? [];
      const has = next.includes(value);
      return {
        ...p,
        freeTime: has ? next.filter((x) => x !== value) : [...next, value],
      };
    });
  }, []);

  const handleFinish = useCallback(() => {
    const full: UserProfile = {
      interests: profile.interests ?? [],
      borough: profile.borough ?? "",
      neighborhood: profile.neighborhood ?? "",
      travelRange: profile.travelRange ?? "",
      vibe: profile.vibe ?? "",
      budget: profile.budget ?? "",
      freeDays: profile.freeDays ?? [],
      freeTime: profile.freeTime ?? [],
    };
    setUserProfile(full);
    setOnboardingDoneFlag();
    setShowConfirmation(true);
  }, [profile, setUserProfile]);

  const handleConfirmationDone = useCallback(() => {
    onComplete();
  }, [onComplete]);

  if (showConfirmation) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1.5rem",
          background: "hsl(var(--background))",
        }}
      >
        <h2
          className="sift-section-heading"
          style={{ marginBottom: 12, textAlign: "center" }}
        >
          You&rsquo;re all set.
        </h2>
        <p
          className="sift-text-sm"
          style={{
            color: "hsl(var(--secondary))",
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          Let&rsquo;s find something good.
        </p>
        <button
          type="button"
          onClick={handleConfirmationDone}
          className="sift-btn-primary"
        >
          Discover events
        </button>
      </div>
    );
  }

  const progressPct = (step / 4) * 100;

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
        className="sift-progress"
        style={{ flexShrink: 0 }}
      >
        <div
          className="sift-progress-fill"
          style={{ width: `${progressPct}%` }}
        />
      </div>
      <div style={{ padding: "1rem 1.5rem", flexShrink: 0 }}>
        <button
          type="button"
          onClick={() =>
            step === 1
              ? (onBack ? onBack() : onComplete())
              : setStep((s) => Math.max(1, s - 1))
          }
          className="sift-btn-ghost"
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Back
        </button>
      </div>
      <main
        style={{
          flex: 1,
          padding: "0 1.5rem 2rem",
          overflowY: "auto",
        }}
      >
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          {/* Step 1: Interests */}
          {step === 1 && (
            <div className="animate-fade-up">
              <h2
                className="sift-section-heading"
                style={{ marginBottom: 8 }}
              >
                What are you into?
              </h2>
              <p
                className="sift-text-sm"
                style={{
                  color: "hsl(var(--secondary))",
                  marginBottom: 24,
                  lineHeight: 1.6,
                }}
              >
                Select at least 2. Tap to toggle.
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                {INTEREST_OPTIONS.map((opt) => {
                  const selected = (profile.interests ?? []).includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleInterest(opt.value)}
                      className={selected ? "sift-option sift-option--selected" : "sift-option"}
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: 9999,
                        border:
                          selected
                            ? "2px solid hsl(var(--primary))"
                            : "1px solid hsl(var(--border))",
                        background: selected
                          ? "hsl(var(--primary) / 0.1)"
                          : "hsl(var(--card))",
                        color: "hsl(var(--foreground))",
                        fontSize: "0.875rem",
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
              <div style={{ marginTop: 32 }}>
                <button
                  type="button"
                  className="sift-btn-primary"
                  disabled={(profile.interests ?? []).length < 2}
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    opacity: (profile.interests ?? []).length < 2 ? 0.5 : 1,
                    cursor:
                      (profile.interests ?? []).length < 2
                        ? "not-allowed"
                        : "pointer",
                  }}
                  onClick={() => setStep(2)}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="animate-fade-up">
              <h2
                className="sift-section-heading"
                style={{ marginBottom: 8 }}
              >
                Where in NYC are you?
              </h2>
              <p
                className="sift-text-sm"
                style={{
                  color: "hsl(var(--secondary))",
                  marginBottom: 20,
                  lineHeight: 1.6,
                }}
              >
                Borough
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  marginBottom: 24,
                }}
              >
                {BOROUGHS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() =>
                      setProfile((p) => ({
                        ...p,
                        borough: b,
                        neighborhood: "",
                      }))
                    }
                    className={
                      profile.borough === b
                        ? "sift-option sift-option--selected"
                        : "sift-option"
                    }
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "var(--radius)",
                    }}
                  >
                    {b}
                  </button>
                ))}
              </div>
              {profile.borough && (
                <>
                  <p
                    className="sift-text-sm"
                    style={{
                      color: "hsl(var(--secondary))",
                      marginBottom: 12,
                      lineHeight: 1.6,
                    }}
                  >
                    Neighborhood
                  </p>
                  <select
                    value={profile.neighborhood}
                    onChange={(e) =>
                      setProfile((p) => ({
                        ...p,
                        neighborhood: e.target.value,
                      }))
                    }
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      borderRadius: "var(--radius)",
                      border: "1px solid hsl(var(--border))",
                      fontSize: 16,
                      marginBottom: 24,
                    }}
                  >
                    <option value="">Select neighborhood</option>
                    {neighborhoods.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </>
              )}
              <p
                className="sift-text-sm"
                style={{
                  color: "hsl(var(--secondary))",
                  marginBottom: 12,
                  lineHeight: 1.6,
                }}
              >
                How far will you travel?
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  marginBottom: 24,
                }}
              >
                {TRAVEL_RANGES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() =>
                      setProfile((p) => ({ ...p, travelRange: r.value }))
                    }
                    className={
                      profile.travelRange === r.value
                        ? "sift-option sift-option--selected"
                        : "sift-option"
                    }
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "var(--radius)",
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="sift-btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => setStep(3)}
              >
                Next
              </button>
            </div>
          )}

          {/* Step 3: Vibe + Budget */}
          {step === 3 && (
            <div className="animate-fade-up">
              <h2
                className="sift-section-heading"
                style={{ marginBottom: 8 }}
              >
                What&rsquo;s your vibe?
              </h2>
              <p
                className="sift-text-sm"
                style={{
                  color: "hsl(var(--secondary))",
                  marginBottom: 20,
                  lineHeight: 1.6,
                }}
              >
                Pick the one that fits best.
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  marginBottom: 24,
                }}
              >
                {VIBE_OPTIONS.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    selected={profile.vibe === opt.value}
                    onClick={() =>
                      setProfile((p) => ({ ...p, vibe: opt.value }))
                    }
                  >
                    <span
                      style={{
                        fontWeight: 500,
                        color: "hsl(var(--foreground))",
                      }}
                    >
                      {opt.label}
                    </span>
                  </OptionCard>
                ))}
              </div>
              <p
                className="sift-text-sm"
                style={{
                  color: "hsl(var(--secondary))",
                  marginBottom: 12,
                  lineHeight: 1.6,
                }}
              >
                Budget preference
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  marginBottom: 24,
                }}
              >
                {BUDGET_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setProfile((p) => ({ ...p, budget: opt.value }))
                    }
                    className={
                      profile.budget === opt.value
                        ? "sift-option sift-option--selected"
                        : "sift-option"
                    }
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "var(--radius)",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="sift-btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => setStep(4)}
              >
                Next
              </button>
            </div>
          )}

          {/* Step 4: Your week */}
          {step === 4 && (
            <div className="animate-fade-up">
              <h2
                className="sift-section-heading"
                style={{ marginBottom: 8 }}
              >
                Your week
              </h2>
              <p
                className="sift-text-sm"
                style={{
                  color: "hsl(var(--secondary))",
                  marginBottom: 20,
                  lineHeight: 1.6,
                }}
              >
                Which days are you typically free?
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  marginBottom: 24,
                }}
              >
                {DAYS.map((d) => {
                  const selected = (profile.freeDays ?? []).includes(d.value);
                  return (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => toggleDay(d.value)}
                      className={selected ? "sift-option sift-option--selected" : "sift-option"}
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: 9999,
                        border:
                          selected
                            ? "2px solid hsl(var(--primary))"
                            : "1px solid hsl(var(--border))",
                        background: selected
                          ? "hsl(var(--primary) / 0.1)"
                          : "hsl(var(--card))",
                        fontSize: "0.875rem",
                      }}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
              <p
                className="sift-text-sm"
                style={{
                  color: "hsl(var(--secondary))",
                  marginBottom: 12,
                  lineHeight: 1.6,
                }}
              >
                Time preference
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  marginBottom: 24,
                }}
              >
                {TIMES.map((t) => {
                  const selected = (profile.freeTime ?? []).includes(t.value);
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => toggleTime(t.value)}
                      className={selected ? "sift-option sift-option--selected" : "sift-option"}
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: 9999,
                        border:
                          selected
                            ? "2px solid hsl(var(--primary))"
                            : "1px solid hsl(var(--border))",
                        background: selected
                          ? "hsl(var(--primary) / 0.1)"
                          : "hsl(var(--card))",
                        fontSize: "0.875rem",
                      }}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                className="sift-btn-primary"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={handleFinish}
              >
                Finish
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
