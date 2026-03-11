"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Plus, X } from "lucide-react";
import DateRangePicker from "@/components/quiz/DateRangePicker";
import type { Filters, Vibe } from "@/types/quiz";
import type { EventCategory, EventDistance, PriceRange } from "@/types/event";
import type { DateRange } from "react-day-picker";

// ── Option data ────────────────────────────────────────────────
const CATEGORIES: { value: EventCategory; label: string; emoji: string }[] = [
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

const DISTANCES: { value: EventDistance; label: string }[] = [
  { value: "neighborhood", label: "Keep it close" },
  { value: "borough", label: "I'll travel a bit" },
  { value: "anywhere", label: "Anywhere in NYC" },
];

const BUDGETS: { value: PriceRange; label: string; sub: string }[] = [
  { value: "free", label: "Free only", sub: "$0" },
  { value: "under-20", label: "Under $20", sub: "budget-friendly" },
  { value: "under-50", label: "Under $50", sub: "mid-range" },
  { value: "any", label: "Any price", sub: "no limit" },
];

const VIBES: { value: Vibe; label: string; sub: string }[] = [
  { value: "hidden_gems", label: "Hidden gems", sub: "Free & under-the-radar" },
  { value: "popular", label: "Popular spots", sub: "Ticketed & well-known" },
  { value: "surprise_me", label: "Surprise me", sub: "Anything goes" },
];

// ── Helpers ────────────────────────────────────────────────────
function formatDate(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function formatLocalDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

// ── Portal panel ───────────────────────────────────────────────
interface PortalPanelProps {
  anchorRef: React.RefObject<HTMLDivElement | null>;
  panelRef: React.RefObject<HTMLDivElement | null>;
  alignRight?: boolean;
  children: React.ReactNode;
  extraStyle?: React.CSSProperties;
}

function PortalPanel({ anchorRef, panelRef, alignRight, children, extraStyle }: PortalPanelProps) {
  const [coords, setCoords] = useState<{ top: number; left?: number; right?: number } | null>(null);

  useLayoutEffect(() => {
    if (!anchorRef.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    if (alignRight) {
      setCoords({ top: r.bottom + 6, right: window.innerWidth - r.right });
    } else {
      setCoords({ top: r.bottom + 6, left: r.left });
    }
  }, [anchorRef, alignRight]);

  if (!coords) return null;

  return createPortal(
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        top: coords.top,
        left: coords.left,
        right: coords.right,
        minWidth: 220,
        background: "hsl(var(--card))",
        border: "1px solid hsl(var(--border))",
        borderRadius: 10,
        boxShadow: "0 8px 28px rgba(0,0,0,0.13)",
        zIndex: 9999,
        padding: 6,
        ...extraStyle,
      }}
    >
      {children}
    </div>,
    document.body
  );
}

// ── Small sub-components ───────────────────────────────────────
function Chip({
  label, isOpen, active, onClick, onClear,
}: {
  label: string; isOpen: boolean; active: boolean; onClick: () => void; onClear?: () => void;
}) {
  const base: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 4,
    padding: "5px 10px", fontSize: "0.78rem", cursor: "pointer", whiteSpace: "nowrap",
    transition: "all 0.15s",
    border: `1px solid ${active ? "hsl(var(--primary))" : "hsl(var(--border))"}`,
    background: active ? "hsl(var(--primary) / 0.09)" : "hsl(var(--card))",
    color: active ? "hsl(var(--primary))" : "hsl(var(--foreground))",
    fontWeight: active ? 600 : 400,
  };
  return (
    <div style={{ display: "inline-flex", alignItems: "stretch" }}>
      <button type="button" onClick={onClick}
        style={{ ...base, borderRadius: onClear ? "6px 0 0 6px" : 6, borderRight: onClear ? "none" : base.border as string }}
      >
        {label}
        <ChevronDown size={11} strokeWidth={2}
          style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s", opacity: 0.65 }}
        />
      </button>
      {onClear && (
        <button type="button" onClick={(e) => { e.stopPropagation(); onClear(); }}
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 7px",
            border: `1px solid hsl(var(--primary))`, borderRadius: "0 6px 6px 0",
            background: "hsl(var(--primary) / 0.09)", color: "hsl(var(--primary))", cursor: "pointer",
          }}
        >
          <X size={10} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "0.68rem", color: "hsl(var(--secondary))", padding: "4px 10px 4px", fontWeight: 600, letterSpacing: "0.05em" }}>
      {children}
    </p>
  );
}

function OptionRow({ label, sub, emoji, selected, multi, onClick }: {
  label: string; sub?: string; emoji?: string; selected: boolean; multi?: boolean; onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 10, width: "100%",
        padding: "7px 10px", borderRadius: 6, border: "none",
        background: selected ? "hsl(var(--primary) / 0.08)" : "transparent",
        fontSize: "0.83rem", cursor: "pointer", textAlign: "left",
      }}
    >
      <div style={{
        width: 16, height: 16, borderRadius: multi ? 4 : 8, flexShrink: 0,
        border: `1.5px solid ${selected ? "hsl(var(--primary))" : "hsl(var(--border))"}`,
        background: selected ? "hsl(var(--primary))" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s",
      }}>
        {selected && <Check size={9} color="white" strokeWidth={3} />}
      </div>
      {emoji && <span style={{ fontSize: "1rem", lineHeight: 1 }}>{emoji}</span>}
      <div>
        <div style={{ fontWeight: selected ? 500 : 400, color: selected ? "hsl(var(--primary))" : "hsl(var(--foreground))" }}>
          {label}
        </div>
        {sub && <div style={{ fontSize: "0.72rem", color: "hsl(var(--secondary))", marginTop: 1 }}>{sub}</div>}
      </div>
    </button>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "hsl(var(--border))", margin: "6px 4px" }} />;
}

// ── Main component ─────────────────────────────────────────────
type OpenFilter = "categories" | "date" | "distance" | "more" | null;

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export default function ResultsFilterBar({ filters, onChange }: Props) {
  const [open, setOpen] = useState<OpenFilter>(null);
  const [pendingRange, setPendingRange] = useState<DateRange | undefined>(
    filters.dateFrom && filters.dateTo
      ? { from: new Date(filters.dateFrom + "T00:00:00"), to: new Date(filters.dateTo + "T00:00:00") }
      : undefined
  );

  // Refs for anchor positioning
  const catRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const distRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  // Ref for the open portal panel (for click-outside)
  const panelRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!barRef.current?.contains(t) && !panelRef.current?.contains(t)) {
        setOpen(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggle = (f: OpenFilter) => setOpen((prev) => (prev === f ? null : f));
  const patch = (updates: Partial<Filters>, keepOpen = false) => {
    onChange({ ...filters, ...updates });
    if (!keepOpen) setOpen(null);
  };

  // Labels
  const cats = filters.categories ?? [];
  const categoryLabel =
    cats.length === 0 ? "Category"
    : cats.length === 1 ? (CATEGORIES.find((c) => c.value === cats[0])?.label ?? cats[0])
    : `${cats.length} selected`;

  const dateLabel =
    filters.dateFrom && filters.dateTo
      ? filters.dateFrom === filters.dateTo
        ? formatDate(filters.dateFrom)
        : `${formatDate(filters.dateFrom)} – ${formatDate(filters.dateTo)}`
      : "Any date";

  const distLabel = DISTANCES.find((d) => d.value === filters.distance)?.label ?? "Any distance";
  const moreCount = (filters.price ? 1 : 0) + (filters.vibe ? 1 : 0);

  const applyPreset = (key: string) => {
    const today = new Date();
    let from = new Date(today), to = new Date(today);
    if (key === "weekend") {
      const dow = today.getDay();
      const daysToSat = (6 - dow) || 7;
      from.setDate(today.getDate() + daysToSat);
      to = new Date(from); to.setDate(from.getDate() + 1);
    } else if (key === "week") {
      to.setDate(today.getDate() + 6);
    } else if (key === "month") {
      to.setDate(today.getDate() + 29);
    }
    setPendingRange({ from, to });
    patch({ dateFrom: formatLocalDate(from), dateTo: formatLocalDate(to) });
  };

  return (
    <div ref={barRef} style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>

      {/* ── Category ─────────────────────────────── */}
      <div ref={catRef} style={{ display: "inline-block" }}>
        <Chip
          label={categoryLabel} isOpen={open === "categories"} active={cats.length > 0}
          onClick={() => toggle("categories")}
          onClear={cats.length > 0 ? () => patch({ categories: undefined }) : undefined}
        />
        {open === "categories" && (
          <PortalPanel anchorRef={catRef} panelRef={panelRef}>
            <SectionLabel>SELECT ALL THAT APPLY</SectionLabel>
            {CATEGORIES.map((c) => (
              <OptionRow key={c.value} label={c.label} emoji={c.emoji}
                selected={cats.includes(c.value)} multi
                onClick={() => {
                  const next = cats.includes(c.value) ? cats.filter((x) => x !== c.value) : [...cats, c.value];
                  patch({ categories: next.length > 0 ? next : undefined }, true);
                }}
              />
            ))}
          </PortalPanel>
        )}
      </div>

      {/* ── Date ─────────────────────────────────── */}
      <div ref={dateRef} style={{ display: "inline-block" }}>
        <Chip
          label={dateLabel} isOpen={open === "date"} active={!!(filters.dateFrom && filters.dateTo)}
          onClick={() => toggle("date")}
          onClear={filters.dateFrom ? () => { patch({ dateFrom: undefined, dateTo: undefined }); setPendingRange(undefined); } : undefined}
        />
        {open === "date" && (
          <PortalPanel anchorRef={dateRef} panelRef={panelRef} extraStyle={{ minWidth: 310, padding: 12 }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
              {[{ label: "Today", key: "today" }, { label: "This weekend", key: "weekend" },
                { label: "Next 7 days", key: "week" }, { label: "This month", key: "month" }].map(({ label, key }) => (
                <button key={key} type="button" onClick={() => applyPreset(key)}
                  style={{
                    fontSize: "0.75rem", padding: "4px 10px", borderRadius: 20,
                    border: "1px solid hsl(var(--border))", background: "hsl(var(--muted))",
                    color: "hsl(var(--foreground))", cursor: "pointer",
                  }}
                >{label}</button>
              ))}
            </div>
            <DateRangePicker
              value={pendingRange}
              onChange={(range) => {
                setPendingRange(range);
                if (range?.from && range?.to) {
                  patch({ dateFrom: formatLocalDate(range.from), dateTo: formatLocalDate(range.to) }, true);
                }
              }}
            />
          </PortalPanel>
        )}
      </div>

      {/* ── Distance ─────────────────────────────── */}
      <div ref={distRef} style={{ display: "inline-block" }}>
        <Chip
          label={distLabel} isOpen={open === "distance"} active={!!filters.distance}
          onClick={() => toggle("distance")}
          onClear={filters.distance ? () => patch({ distance: undefined }) : undefined}
        />
        {open === "distance" && (
          <PortalPanel anchorRef={distRef} panelRef={panelRef}>
            {DISTANCES.map((d) => (
              <OptionRow key={d.value} label={d.label} selected={filters.distance === d.value}
                onClick={() => patch({ distance: d.value })}
              />
            ))}
          </PortalPanel>
        )}
      </div>

      {/* ── More ─────────────────────────────────── */}
      <div ref={moreRef} style={{ display: "inline-block" }}>
        <button type="button" onClick={() => toggle("more")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "5px 11px", borderRadius: 6, fontSize: "0.78rem", cursor: "pointer",
            border: `1px solid ${moreCount > 0 ? "hsl(var(--primary))" : "hsl(var(--border))"}`,
            background: moreCount > 0 ? "hsl(var(--primary) / 0.09)" : "hsl(var(--card))",
            color: moreCount > 0 ? "hsl(var(--primary))" : "hsl(var(--secondary))",
            fontWeight: moreCount > 0 ? 600 : 400,
          }}
        >
          <Plus size={12} strokeWidth={2.5} />
          {moreCount > 0 ? `More (${moreCount})` : "More"}
        </button>
        {open === "more" && (
          <PortalPanel anchorRef={moreRef} panelRef={panelRef} alignRight extraStyle={{ minWidth: 260 }}>
            <SectionLabel>BUDGET</SectionLabel>
            {BUDGETS.map((b) => (
              <OptionRow key={b.value} label={b.label} sub={b.sub} selected={filters.price === b.value}
                onClick={() => patch({ price: filters.price === b.value ? undefined : b.value }, true)}
              />
            ))}
            <Divider />
            <SectionLabel>VIBE</SectionLabel>
            {VIBES.map((v) => (
              <OptionRow key={v.value} label={v.label} sub={v.sub} selected={filters.vibe === v.value}
                onClick={() => patch({ vibe: filters.vibe === v.value ? undefined : v.value }, true)}
              />
            ))}
          </PortalPanel>
        )}
      </div>

    </div>
  );
}
