"use client";

import { useMemo, useState } from "react";
import { useUser } from "@/context/UserContext";
import { events } from "@/data/events";
import type { GoingEvent, SavedEvent } from "@/types/user";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function getDaysInMonth(year: number, month: number) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days: (number | null)[] = [];
  const startPad = first.getDay();
  for (let i = 0; i < startPad; i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(d);
  return days;
}

function getEventIdsByDate(
  goingEvents: GoingEvent[],
  savedEvents: SavedEvent[]
): {
  going: Set<string>;
  saved: Set<string>;
  dateToGoing: Map<string, string[]>;
  dateToSaved: Map<string, string[]>;
} {
  const going = new Set<string>();
  const saved = new Set<string>();
  const dateToGoing = new Map<string, string[]>();
  const dateToSaved = new Map<string, string[]>();

  goingEvents.forEach((e) => {
    going.add(e.eventId);
    const list = dateToGoing.get(e.eventDate) ?? [];
    list.push(e.eventId);
    dateToGoing.set(e.eventDate, list);
  });

  savedEvents.forEach((s) => {
    saved.add(s.eventId);
    const ev = events.find((e) => e.id === s.eventId);
    if (ev) {
      const list = dateToSaved.get(ev.startDate) ?? [];
      list.push(s.eventId);
      dateToSaved.set(ev.startDate, list);
    }
  });

  return { going, saved, dateToGoing, dateToSaved };
}

interface CalendarSectionProps {
  goingEvents: GoingEvent[];
  savedEvents: SavedEvent[];
}

export default function CalendarSection({
  goingEvents,
  savedEvents,
}: CalendarSectionProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthLabel = now.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const days = useMemo(
    () => getDaysInMonth(year, month),
    [year, month]
  );
  const { dateToGoing, dateToSaved } = useMemo(
    () => getEventIdsByDate(goingEvents, savedEvents),
    [goingEvents, savedEvents]
  );

  const selectedGoing =
    selectedDate ? dateToGoing.get(selectedDate) ?? [] : [];
  const selectedSaved =
    selectedDate ? dateToSaved.get(selectedDate) ?? [] : [];
  const selectedGoingEvents = selectedGoing
    .map((id) => goingEvents.find((e) => e.eventId === id))
    .filter(Boolean) as GoingEvent[];
  const selectedSavedEvents = selectedSaved
    .map((id) => events.find((e) => e.id === id))
    .filter((e): e is NonNullable<typeof e> => e != null);

  const toDateKey = (day: number) => {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${m}-${d}`;
  };

  return (
    <section style={{ marginBottom: 32 }}>
      <h3
        className="sift-h3"
        style={{ marginBottom: 16 }}
      >
        My Calendar
      </h3>
      <p
        className="sift-text-sm"
        style={{
          color: "hsl(var(--secondary))",
          marginBottom: 12,
        }}
      >
        {monthLabel}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 4,
          marginBottom: 16,
        }}
      >
        {WEEKDAYS.map((w, i) => (
          <div
            key={i}
            className="sift-text-xs"
            style={{
              textAlign: "center",
              color: "hsl(var(--secondary))",
              fontWeight: 600,
            }}
          >
            {w}
          </div>
        ))}
        {days.map((day, i) => {
          if (day === null) {
            return <div key={`pad-${i}`} />;
          }
          const key = toDateKey(day);
          const hasGoing = (dateToGoing.get(key) ?? []).length > 0;
          const hasSaved = (dateToSaved.get(key) ?? []).length > 0;
          const isSelected = selectedDate === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedDate(isSelected ? null : key)}
              style={{
                aspectRatio: "1",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                borderRadius: "var(--radius)",
                border:
                  isSelected
                    ? "2px solid hsl(var(--primary))"
                    : "1px solid hsl(var(--border))",
                background: isSelected
                  ? "hsl(var(--primary) / 0.08)"
                  : "transparent",
                cursor: "pointer",
                fontSize: "0.875rem",
              }}
            >
              {day}
              <div style={{ display: "flex", gap: 2 }}>
                {hasGoing && (
                  <span
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: 9999,
                      background: "hsl(var(--primary))",
                    }}
                  />
                )}
                {hasSaved && (
                  <span
                    style={{
                      width: 4,
                      height: 4,
                      borderRadius: 9999,
                      background: "hsl(var(--accent))",
                    }}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
      {selectedDate && (
        <div
          style={{
            padding: 12,
            background: "hsl(var(--muted))",
            borderRadius: "var(--radius)",
          }}
        >
          <p
            className="sift-text-sm"
            style={{
              fontWeight: 600,
              marginBottom: 8,
              color: "hsl(var(--foreground))",
            }}
          >
            {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </p>
          {selectedGoingEvents.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <span
                className="sift-text-xs"
                style={{ color: "hsl(var(--secondary))" }}
              >
                Going:
              </span>
              {selectedGoingEvents.map((e) => (
                <div
                  key={e.eventId}
                  className="sift-text-sm"
                  style={{ marginTop: 4 }}
                >
                  {e.eventTitle}
                </div>
              ))}
            </div>
          )}
          {selectedSavedEvents.length > 0 && (
            <div>
              <span
                className="sift-text-xs"
                style={{ color: "hsl(var(--secondary))" }}
              >
                Saved:
              </span>
              {selectedSavedEvents.map((e) => (
                <div
                  key={e.id}
                  className="sift-text-sm"
                  style={{ marginTop: 4 }}
                >
                  {e.title}
                </div>
              ))}
            </div>
          )}
          {selectedGoingEvents.length === 0 && selectedSavedEvents.length === 0 && (
            <p className="sift-text-sm" style={{ color: "hsl(var(--secondary))" }}>
              No events this day
            </p>
          )}
        </div>
      )}
    </section>
  );
}
