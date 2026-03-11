"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { events } from "@/data/events";

interface SavedListsSectionProps {
  onRequestSignIn?: () => void;
}

export default function SavedListsSection({
  onRequestSignIn,
}: SavedListsSectionProps) {
  const {
    savedEvents,
    removeSavedEvent,
    customLists,
    addCustomList,
    getAllListNames,
  } = useUser();
  const [expandedList, setExpandedList] = useState<string | null>(null);
  const [newListName, setNewListName] = useState("");
  const [showNewListInput, setShowNewListInput] = useState(false);

  const listNames = getAllListNames();

  const eventsByList = listNames.map((listName) => ({
    listName,
    items: savedEvents.filter((s) => s.listName === listName),
  }));

  const handleCreateList = () => {
    const trimmed = newListName.trim();
    if (!trimmed) return;
    addCustomList(trimmed);
    setNewListName("");
    setShowNewListInput(false);
  };

  return (
    <section style={{ marginBottom: 32 }}>
      <h3 className="sift-h3" style={{ marginBottom: 16 }}>
        Saved Lists
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {eventsByList.map(({ listName, items }) => (
          <div
            key={listName}
            className="sift-card"
            style={{ padding: "1rem 1.25rem" }}
          >
            <button
              type="button"
              onClick={() =>
                setExpandedList(expandedList === listName ? null : listName)
              }
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span style={{ fontWeight: 600, color: "hsl(var(--foreground))" }}>
                {listName}
              </span>
              <span className="sift-text-sm" style={{ color: "hsl(var(--secondary))" }}>
                {items.length} {items.length === 1 ? "event" : "events"}
              </span>
            </button>
            {expandedList === listName && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid hsl(var(--border))" }}>
                {items.length === 0 ? (
                  <p className="sift-text-sm" style={{ color: "hsl(var(--secondary))" }}>
                    No events saved yet
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {items.map((s) => {
                      const ev = events.find((e) => e.id === s.eventId);
                      if (!ev) return null;
                      return (
                        <div
                          key={s.eventId}
                          style={{
                            padding: 10,
                            background: "hsl(var(--muted))",
                            borderRadius: "var(--radius)",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: 8,
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 500, fontSize: "0.875rem" }}>
                              {ev.title}
                            </div>
                            <div className="sift-text-xs" style={{ color: "hsl(var(--secondary))", marginTop: 2 }}>
                              {ev.startDate} · {ev.location}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSavedEvent(s.eventId)}
                            className="sift-btn-ghost"
                            style={{ flexShrink: 0, fontSize: "0.75rem" }}
                          >
                            Unsave
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {showNewListInput ? (
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="List name"
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              borderRadius: "var(--radius)",
              border: "1px solid hsl(var(--border))",
              fontSize: 16,
            }}
          />
          <button
            type="button"
            onClick={handleCreateList}
            className="sift-btn-primary"
            disabled={!newListName.trim()}
          >
            Add
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowNewListInput(true)}
          className="sift-btn-ghost"
          style={{ marginTop: 12 }}
        >
          Create new list
        </button>
      )}
    </section>
  );
}
