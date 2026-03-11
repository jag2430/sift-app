"use client";

import { useCallback, useState } from "react";
import { ArrowLeft } from "lucide-react";

import AuthGateModal, {
  setGuestFlag,
} from "@/components/auth/AuthGateModal";
import SignInScreen from "@/components/auth/SignInScreen";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ProgressBar from "@/components/layout/ProgressBar";
import OptionCard from "@/components/quiz/OptionCard";
import EventCard from "@/components/events/EventCard";
import EventDetail from "@/components/events/EventDetail";
import DateRangePicker from "@/components/quiz/DateRangePicker";
import ProfileScreen from "@/components/profile/ProfileScreen";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";

import { useUser } from "@/context/UserContext";
import { getEventCandidates, getRecommendedEvents } from "@/lib/eventRecommendations";
import { hasOnboardingDoneFlag } from "@/lib/sessionFlags";
import type {
  EventCategory,
  EventDistance,
  PriceRange,
  SiftEvent,
} from "@/types/event";
import type { Filters, Step } from "@/types/quiz";
import type { DateRange } from "react-day-picker";

// ── Options ─────────────────────────────────────────────────
const categories: { value: EventCategory; label: string; emoji: string }[] = [
  { value: "arts", label: "Arts & Culture", emoji: "🎨" },
  { value: "music", label: "Live Music", emoji: "🎵" },
  { value: "outdoors", label: "Outdoors", emoji: "🌿" },
  { value: "fitness", label: "Fitness", emoji: "🏃" },
  { value: "comedy", label: "Comedy", emoji: "😂" },
  { value: "food", label: "Food & Drink", emoji: "🍷" },
  { value: "nightlife", label: "Nightlife", emoji: "🌙" },
  { value: "theater", label: "Theater", emoji: "🎭" },
  { value: "workshops", label: "Workshops", emoji: "🛠️" },
  { value: "popups", label: "Pop-ups & Sample Sales", emoji: "🛍️" },
];

const prices: { value: PriceRange; label: string }[] = [
  { value: "free", label: "Free only" },
  { value: "under-20", label: "Under $20" },
  { value: "under-50", label: "Under $50" },
  { value: "any", label: "Price doesn't matter" },
];

const distances: { value: EventDistance; label: string; desc: string }[] = [
  { value: "neighborhood", label: "Keep it close", desc: "Manhattan" },
  { value: "borough", label: "I'll travel a bit", desc: "Manhattan + Brooklyn" },
  { value: "anywhere", label: "Anywhere in NYC", desc: "All boroughs" },
];

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDatePill(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatSelectedDateRange(dateFrom?: string, dateTo?: string) {
  if (!dateFrom || !dateTo) return "";

  if (dateFrom === dateTo) {
    return formatDatePill(dateFrom);
  }

  return `${formatDatePill(dateFrom)} – ${formatDatePill(dateTo)}`;
}

type AuthView = "gate" | "signin" | "past";

export default function Home() {
  const { isLoggedIn, userEmail, userDisplayName, userProfile, setAuth } =
    useUser();
  const [authView, setAuthView] = useState<AuthView>("gate");
  const [activeTab, setActiveTab] = useState<"discover" | "profile">("discover");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [step, setStep] = useState<Step>("welcome");
  const [filters, setFilters] = useState<Filters>({});
  const [results, setResults] = useState<SiftEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<SiftEvent | null>(null);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);


  const handleContinueAsGuest = useCallback(() => {
    setGuestFlag();
    setAuthView("past");
  }, []);

  const handleSignInSuccess = useCallback(
    (email: string, displayName?: string) => {
      setAuth(true, email, displayName);
      setAuthView("past");
    },
    [setAuth]
  );

  const reset = useCallback(() => {
    setStep("welcome");
    setFilters({});
    setResults([]);
    setSelectedEvent(null);
    setSelectedRange(undefined);
    setDismissedIds([]);
  }, []);
  const goToResults = useCallback((f: Filters, excludedIds: string[] = []) => {
    setResults(getRecommendedEvents(f, excludedIds));
    setStep("results");
  }, []);
  const handleBack = useCallback(() => {
    const flow: Step[] = ["welcome", "category", "date", "distance", "price", "results"];
    const idx = flow.indexOf(step);
    if (idx > 0) setStep(flow[idx - 1]);
  }, [step]);
  const handleDismissEvent = useCallback(
    (eventId: string) => {
      const nextDismissed = [...dismissedIds, eventId];
      setDismissedIds(nextDismissed);

      setResults((prevResults) => {
        const removedIndex = prevResults.findIndex((event) => event.id === eventId);
        if (removedIndex === -1) return prevResults;

        const remainingResults = prevResults.filter((event) => event.id !== eventId);

        const currentIds = remainingResults.map((event) => event.id);
        const allExcludedIds = [...nextDismissed, ...currentIds];

        const candidates = getEventCandidates(filters, allExcludedIds);
        const replacement = candidates[0];

        if (!replacement) {
          return remainingResults;
        }

        const nextResults = [...remainingResults];
        nextResults.splice(removedIndex, 0, replacement);
        return nextResults;
      });
    },
    [dismissedIds, filters]
  );

  // ── AUTH GATE ─────────────────────────────────────────────
  if (authView === "gate") {
    return (
      <AuthGateModal
        onContinueAsGuest={handleContinueAsGuest}
        onSignIn={() => setAuthView("signin")}
      />
    );
  }
  if (authView === "signin") {
    return (
      <SignInScreen
        onSuccess={handleSignInSuccess}
        onContinueAsGuest={handleContinueAsGuest}
        onBack={() => setAuthView("gate")}
      />
    );
  }
  if (authView === "past" && isLoggedIn && !hasOnboardingDoneFlag()) {
    return (
      <OnboardingFlow
        onComplete={() => {
          /* transition handled by OnboardingFlow */
        }}
        onBack={() => setAuthView("gate")}
      />
    );
  }
  if (showOnboarding) {
    return (
      <OnboardingFlow onComplete={() => setShowOnboarding(false)} />
    );
  }

  // ── MAIN APP: Nav + Discover or Profile + Tab bar ─────────
  const showDiscoverNavButton =
    activeTab === "discover" && step === "results";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Nav
        onReset={
          activeTab === "profile" ? () => setActiveTab("discover") : reset
        }
        showButton={showDiscoverNavButton}
        onProfileClick={() => setActiveTab("profile")}
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        userDisplayName={userDisplayName}
      />
      {activeTab === "profile" ? (
        <main style={{ flex: 1 }}>
          <ProfileScreen
            onEditPreferences={() => setShowOnboarding(true)}
            onSignIn={() => setAuthView("signin")}
            onBackToDiscover={() => setActiveTab("discover")}
          />
        </main>
      ) : (
        <>
          {step === "welcome" && (
            <>
              <main
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "8rem 1.5rem 6rem",
                }}
              >
                <div
                  style={{
                    maxWidth: 720,
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <h1 className="sift-hero-heading animate-fade-up">
                    What do you want to do
                    <br />
                    <em
                      style={{
                        fontStyle: "italic",
                        color: "hsl(214 33% 49%)",
                      }}
                    >
                      this weekend?
                    </em>
                  </h1>
                  <p
                    className="sift-hero-sub animate-fade-up-delay-1"
                    style={{ marginTop: "2rem" }}
                  >
                    You don&rsquo;t need more options. You need the right 3–5,
                    matched to what you actually care about.
                  </p>
                  <p
                    className="sift-hero-detail animate-fade-up-delay-2"
                    style={{ marginTop: "1rem" }}
                  >
                    Tell us what you&rsquo;re into, when you&rsquo;re free, and
                    how far you&rsquo;ll go. We&rsquo;ll tell you what&rsquo;s
                    worth your time.
                  </p>
                  <div
                    className="animate-fade-up-delay-3"
                    style={{ marginTop: "2.5rem" }}
                  >
                    <button
                      onClick={() => setStep("category")}
                      className="sift-btn-primary"
                    >
                      Show me what&rsquo;s happening &rarr;
                    </button>
                  </div>
                </div>
              </main>
              <Footer />
            </>
          )}
          {(step === "category" ||
            step === "date" ||
            step === "price" ||
            step === "distance") && (
            <>
              <ProgressBar step={step} />
              <main style={{ flex: 1, padding: "6rem 1.5rem 4rem" }}>
          <div style={{ maxWidth: 520, width: "100%", margin: "0 auto" }}>
            <button onClick={handleBack} className="sift-btn-ghost" style={{ marginBottom: 32 }}>
              <ArrowLeft size={16} strokeWidth={1.5} />Back
            </button>

            {step === "category" && (
              <div className="animate-fade-up">
                <h2 className="sift-section-heading" style={{ marginBottom: 8 }}>What are you in the mood for?</h2>
                <p className="sift-text-sm" style={{ color: "hsl(237 8% 35%)", marginBottom: 32, lineHeight: 1.625 }}>Pick one to start.</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {categories.map((c) => (
                    <OptionCard key={c.value} selected={filters.category === c.value} onClick={() => { setFilters((f) => ({ ...f, category: c.value })); setTimeout(() => setStep("date"), 200); }}>
                      <span style={{ fontSize: "1.5rem", display: "block", marginBottom: 4 }}>{c.emoji}</span>
                      <span style={{ fontWeight: 500, color: "hsl(185 10% 18%)" }}>{c.label}</span>
                    </OptionCard>
                  ))}
                </div>
              </div>
            )}

            {step === "date" && (
              <div className="animate-fade-up">
                <h2 className="sift-section-heading" style={{ marginBottom: 8 }}>
                  When are you free?
                </h2>
                <p
                  className="sift-text-sm"
                  style={{ color: "hsl(237 8% 35%)", marginBottom: 24, lineHeight: 1.625 }}
                >
                  Pick a date range and we’ll narrow things down.
                </p>

                <DateRangePicker
                  value={selectedRange}
                  onChange={(range) => {
                    setSelectedRange(range);

                    setFilters((f) => ({
                      ...f,
                      dateFrom: range?.from ? formatLocalDate(range.from) : undefined,
                      dateTo: range?.to ? formatLocalDate(range.to) : undefined,
                    }));
                  }}
                />

                <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
                  <button
                    className="sift-btn-primary"
                    disabled={!selectedRange?.from || !selectedRange?.to}
                    onClick={() => setStep("distance")}
                    style={{
                      minWidth: 160,
                      justifyContent: "center",
                      opacity: !selectedRange?.from || !selectedRange?.to ? 0.5 : 1,
                      cursor: !selectedRange?.from || !selectedRange?.to ? "not-allowed" : "pointer",
                    }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === "price" && (
              <div className="animate-fade-up">
                <h2 className="sift-section-heading" style={{ marginBottom: 8 }}>What&rsquo;s your budget?</h2>
                <p className="sift-text-sm" style={{ color: "hsl(237 8% 35%)", marginBottom: 32, lineHeight: 1.625 }}>Per person, roughly.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {prices.map((p) => (
                    <OptionCard
                      key={p.value}
                      selected={filters.price === p.value}
                      onClick={() => {
                        const f = { ...filters, price: p.value };
                        setFilters(f);
                        setTimeout(() => goToResults(f), 200);
                      }}
                    >
                      <span style={{ fontWeight: 500, color: "hsl(185 10% 18%)" }}>{p.label}</span>
                    </OptionCard>
                  ))}
                </div>
              </div>
            )}

            {step === "distance" && (
              <div className="animate-fade-up">
                <h2 className="sift-section-heading" style={{ marginBottom: 8 }}>How far will you go?</h2>
                <p className="sift-text-sm" style={{ color: "hsl(237 8% 35%)", marginBottom: 32, lineHeight: 1.625 }}>We&rsquo;ll keep it relevant.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {distances.map((d) => (
                    <OptionCard
                      key={d.value}
                      selected={filters.distance === d.value}
                      onClick={() => {
                        setFilters((f) => ({ ...f, distance: d.value }));
                        setTimeout(() => setStep("price"), 200);
                      }}
                    >
                      <span style={{ fontWeight: 500, color: "hsl(185 10% 18%)" }}>{d.label}</span>
                      <span className="sift-text-sm" style={{ color: "hsl(237 8% 35%)", marginLeft: 8 }}> — {d.desc}</span>
                    </OptionCard>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
            </>
          )}
          {step === "results" && (
            <>
              {selectedEvent ? (
                <main style={{ flex: 1, padding: "6rem 1.5rem 4rem" }}>
                  <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <EventDetail
                      event={selectedEvent}
                      onBack={() => setSelectedEvent(null)}
                      onRequestSignIn={() => setAuthView("signin")}
                    />
                  </div>
                </main>
              ) : (
                <main style={{ flex: 1, padding: "6rem 1.5rem 4rem" }}>
                  <div style={{ maxWidth: 720, margin: "0 auto" }}>
                    <div
                      className="animate-fade-up"
                      style={{ marginBottom: 32 }}
                    >
                      {userProfile ? (
                        <p
                          className="sift-text-sm"
                          style={{
                            color: "hsl(var(--secondary))",
                            marginBottom: 12,
                            lineHeight: 1.5,
                          }}
                        >
                          Recommendations for you · {userProfile.neighborhood || "NYC"} ·{" "}
                          {(userProfile.interests ?? [])
                            .slice(0, 2)
                            .map((i) =>
                              i.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
                            )
                            .join(", ")}
                        </p>
                      ) : (
                        <p
                          className="sift-text-sm"
                          style={{
                            color: "hsl(var(--secondary))",
                            marginBottom: 12,
                            lineHeight: 1.5,
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => setAuthView("signin")}
                            className="sift-btn-ghost"
                            style={{
                              padding: 0,
                              textDecoration: "underline",
                              color: "hsl(var(--primary))",
                            }}
                          >
                            Personalize your results →
                          </button>
                        </p>
                      )}
                      <h2
                        className="sift-section-heading"
                        style={{ marginBottom: 8 }}
                      >
                        {results.length > 0
                          ? "Here\u2019s what we found"
                          : "Hmm, nothing matched"}
                      </h2>
                      <p
                        className="sift-text-sm"
                        style={{
                          color: "hsl(237 8% 35%)",
                          lineHeight: 1.625,
                        }}
                      >
                        {results.length > 0
                          ? `${results.length} things worth your time this weekend.`
                          : "Try broadening your filters \u2014 or just explore everything."}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 8,
                          marginTop: 16,
                        }}
                      >
                        {filters.category && (
                          <span className="sift-filter-pill">
                            {categories.find(
                              (c) => c.value === filters.category
                            )?.label}
                          </span>
                        )}
                        {filters.dateFrom && filters.dateTo && (
                          <span className="sift-filter-pill">
                            {formatSelectedDateRange(
                              filters.dateFrom,
                              filters.dateTo
                            )}
                          </span>
                        )}
                        {filters.distance && (
                          <span className="sift-filter-pill">
                            {distances.find(
                              (d) => d.value === filters.distance
                            )?.label}
                          </span>
                        )}
                        {filters.price && (
                          <span className="sift-filter-pill">
                            {prices.find(
                              (p) => p.value === filters.price
                            )?.label}
                          </span>
                        )}
                      </div>
                    </div>

                    {results.length > 0 ? (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 16,
                        }}
                      >
                        {results.map((event, i) => (
                          <EventCard
                            key={event.id}
                            event={event}
                            index={i}
                            onClick={() => setSelectedEvent(event)}
                            onDismiss={() =>
                              handleDismissEvent(event.id)
                            }
                            onRequestSignIn={() =>
                              setAuthView("signin")
                            }
                          />
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "3rem 0",
                        }}
                      >
                        <p
                          className="sift-text-sm"
                          style={{
                            color: "hsl(237 8% 35%)",
                          }}
                        >
                          No events matched all your filters.
                        </p>
                      </div>
                    )}
                  </div>
                </main>
              )}
              <Footer />
            </>
          )}
        </>
      )}
    </div>
  );
}