"use client";

import { useCallback, useState } from "react";
import { ArrowLeft, RotateCcw, Sparkles } from "lucide-react";

import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import ProgressBar from "@/components/layout/ProgressBar";
import OptionCard from "@/components/quiz/OptionCard";
import EventCard from "@/components/events/EventCard";
import EventDetail from "@/components/events/EventDetail";

import { getRecommendedEvents } from "@/lib/eventRecommendations";
import type {
  EventCategory,
  EventDistance,
  EventVibe,
  PriceRange,
  SiftEvent,
} from "@/types/event";
import type { Filters, Step } from "@/types/quiz";

// ── Options ─────────────────────────────────────────────────
const categories: { value: EventCategory; label: string; emoji: string }[] = [
  { value: "arts", label: "Arts & Culture", emoji: "🎨" },
  { value: "music", label: "Live Music", emoji: "🎵" },
  { value: "comedy", label: "Comedy", emoji: "😂" },
  { value: "food", label: "Food & Drink", emoji: "🍷" },
  { value: "outdoors", label: "Outdoors", emoji: "🌿" },
  { value: "nightlife", label: "Nightlife", emoji: "🌙" },
];

const vibes: { value: EventVibe; label: string; desc: string }[] = [
  { value: "chill", label: "Chill", desc: "Low-key and relaxed" },
  { value: "lively", label: "Lively", desc: "High energy, social" },
  { value: "adventurous", label: "Adventurous", desc: "Try something new" },
  { value: "cultural", label: "Cultural", desc: "Learn or explore" },
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

export default function Home() {
  const [step, setStep] = useState<Step>("welcome");
  const [filters, setFilters] = useState<Filters>({});
  const [results, setResults] = useState<SiftEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<SiftEvent | null>(null);

  const reset = useCallback(() => { setStep("welcome"); setFilters({}); setResults([]); setSelectedEvent(null); }, []);
  const goToResults = useCallback((f: Filters) => { setResults(getRecommendedEvents(f)); setStep("results"); }, []);
  const handleBack = useCallback(() => {
    const flow: Step[] = ["welcome", "category", "vibe", "price", "distance", "results"];
    const idx = flow.indexOf(step);
    if (idx > 0) setStep(flow[idx - 1]);
  }, [step]);

  // ── WELCOME — matches landing page hero: min-h-screen, centered, pt-32 pb-24, max-w-[720px] ──
  if (step === "welcome") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Nav onReset={reset} />
        {/* matches: flex min-h-screen items-center justify-center px-6 pt-32 pb-24 */}
        <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "8rem 1.5rem 6rem" }}>
          {/* matches: mx-auto max-w-[720px] text-center */}
          <div style={{ maxWidth: 720, width: "100%", textAlign: "center" }}>
            <h1 className="sift-hero-heading animate-fade-up">
              What do you want to do<br />
              <em style={{ fontStyle: "italic", color: "hsl(214 33% 49%)" }}>this weekend?</em>
            </h1>
            {/* matches: mt-8 text-lg leading-relaxed text-foreground/90 md:text-xl */}
            <p className="sift-hero-sub animate-fade-up-delay-1" style={{ marginTop: "2rem" }}>
              You don&rsquo;t need more options. You need the right 3–5, matched to what you actually care about.
            </p>
            {/* matches: mt-4 text-sm leading-relaxed text-secondary md:text-base */}
            <p className="sift-hero-detail animate-fade-up-delay-2" style={{ marginTop: "1rem" }}>
              Tell us what you&rsquo;re into, when you&rsquo;re free, and how far you&rsquo;ll go. We&rsquo;ll tell you what&rsquo;s worth your time.
            </p>
            {/* matches: mt-10 */}
            <div className="animate-fade-up-delay-3" style={{ marginTop: "2.5rem" }}>
              <button onClick={() => setStep("category")} className="sift-btn-primary">
                Show me what&rsquo;s happening &rarr;
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── QUIZ STEPS — px-6 py-24, max-w-[720px] centered ──────
  if (step === "category" || step === "vibe" || step === "price" || step === "distance") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Nav onReset={reset} showButton />
        <ProgressBar step={step} />
        {/* matches section pattern: px-6 py-24 */}
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
                    <OptionCard key={c.value} selected={filters.category === c.value} onClick={() => { setFilters((f) => ({ ...f, category: c.value })); setTimeout(() => setStep("vibe"), 200); }}>
                      <span style={{ fontSize: "1.5rem", display: "block", marginBottom: 4 }}>{c.emoji}</span>
                      <span style={{ fontWeight: 500, color: "hsl(185 10% 18%)" }}>{c.label}</span>
                    </OptionCard>
                  ))}
                </div>
              </div>
            )}

            {step === "vibe" && (
              <div className="animate-fade-up">
                <h2 className="sift-section-heading" style={{ marginBottom: 8 }}>What kind of vibe?</h2>
                <p className="sift-text-sm" style={{ color: "hsl(237 8% 35%)", marginBottom: 32, lineHeight: 1.625 }}>This helps us narrow it down.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {vibes.map((v) => (
                    <OptionCard key={v.value} selected={filters.vibe === v.value} onClick={() => { setFilters((f) => ({ ...f, vibe: v.value })); setTimeout(() => setStep("price"), 200); }}>
                      <span style={{ fontWeight: 500, color: "hsl(185 10% 18%)" }}>{v.label}</span>
                      <span className="sift-text-sm" style={{ color: "hsl(237 8% 35%)", marginLeft: 8 }}> — {v.desc}</span>
                    </OptionCard>
                  ))}
                </div>
              </div>
            )}

            {step === "price" && (
              <div className="animate-fade-up">
                <h2 className="sift-section-heading" style={{ marginBottom: 8 }}>What&rsquo;s your budget?</h2>
                <p className="sift-text-sm" style={{ color: "hsl(237 8% 35%)", marginBottom: 32, lineHeight: 1.625 }}>Per person, roughly.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {prices.map((p) => (
                    <OptionCard key={p.value} selected={filters.price === p.value} onClick={() => { setFilters((f) => ({ ...f, price: p.value })); setTimeout(() => setStep("distance"), 200); }}>
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
                    <OptionCard key={d.value} selected={filters.distance === d.value} onClick={() => { const f = { ...filters, distance: d.value }; setFilters(f); setTimeout(() => goToResults(f), 200); }}>
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
      </div>
    );
  }

  // ── RESULTS ───────────────────────────────────────────────
  if (step === "results") {
    if (selectedEvent) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <Nav onReset={reset} showButton />
          <main style={{ flex: 1, padding: "6rem 1.5rem 4rem" }}>
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
              <EventDetail event={selectedEvent} onBack={() => setSelectedEvent(null)} />
            </div>
          </main>
          <Footer />
        </div>
      );
    }

    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Nav onReset={reset} showButton />
        <main style={{ flex: 1, padding: "6rem 1.5rem 4rem" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div className="animate-fade-up" style={{ marginBottom: 32 }}>
              <h2 className="sift-section-heading" style={{ marginBottom: 8 }}>
                {results.length > 0 ? "Here\u2019s what we found" : "Hmm, nothing matched"}
              </h2>
              <p className="sift-text-sm" style={{ color: "hsl(237 8% 35%)", lineHeight: 1.625 }}>
                {results.length > 0 ? `${results.length} things worth your time this weekend.` : "Try broadening your filters \u2014 or just explore everything."}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
                {filters.category && <span className="sift-filter-pill">{categories.find((c) => c.value === filters.category)?.label}</span>}
                {filters.vibe && <span className="sift-filter-pill">{vibes.find((v) => v.value === filters.vibe)?.label}</span>}
                {filters.price && <span className="sift-filter-pill">{prices.find((p) => p.value === filters.price)?.label}</span>}
                {filters.distance && <span className="sift-filter-pill">{distances.find((d) => d.value === filters.distance)?.label}</span>}
              </div>
            </div>

            {results.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {results.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} onClick={() => setSelectedEvent(event)} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "3rem 0" }}>
                <p className="sift-text-sm" style={{ color: "hsl(237 8% 35%)" }}>No events matched all your filters.</p>
              </div>
            )}

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 40, justifyContent: "center" }}>
              <button onClick={reset} className="sift-btn-primary">
                <RotateCcw size={16} strokeWidth={1.5} />Start over
              </button>
              <button onClick={() => setResults(getRecommendedEvents(filters))} className="sift-btn-secondary">
                <Sparkles size={16} strokeWidth={1.5} />Surprise me again
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return null;
}