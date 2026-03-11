"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  Check,
  ExternalLink,
  ImageIcon,
  MapPin,
  Share2,
} from "lucide-react";
import BottomSheet from "@/components/ui/BottomSheet";
import { useToast } from "@/components/ui/Toast";
import { useUser } from "@/context/UserContext";
import type { SiftEvent } from "@/types/event";
import SaveToListSheet from "./SaveToListSheet";
import ShareSheet from "./ShareSheet";

interface EventDetailProps {
  event: SiftEvent;
  onBack: () => void;
  onRequestSignIn?: () => void;
}

function formatEventDate(event: SiftEvent) {
  if (event.endDate && event.endDate !== event.startDate) {
    return `${event.startDate} ~ ${event.endDate}`;
  }
  return event.startDate;
}

export default function EventDetail({
  event,
  onBack,
  onRequestSignIn,
}: EventDetailProps) {
  const { showToast } = useToast();
  const {
    isLoggedIn,
    getSavedListForEvent,
    removeSavedEvent,
    toggleGoing,
    isGoing,
  } = useUser();
  const [saveSheetOpen, setSaveSheetOpen] = useState(false);
  const [shareSheetOpen, setShareSheetOpen] = useState(false);
  const [goingPromptOpen, setGoingPromptOpen] = useState(false);

  const savedList = getSavedListForEvent(event.id);
  const going = isGoing(event.id);

  const handleBookmarkClick = () => {
    if (savedList) {
      removeSavedEvent(event.id);
      showToast("Removed from list");
    } else {
      setSaveSheetOpen(true);
    }
  };

  const handleSavedToList = (listName: string) => {
    showToast(`Saved to ${listName}`);
  };

  const handleGoingClick = () => {
    if (going) {
      toggleGoing({
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.startDate,
      });
      return;
    }
    if (!isLoggedIn) {
      setGoingPromptOpen(true);
      return;
    }
    toggleGoing({
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.startDate,
    });
    showToast("Marked as going");
  };

  const handleGoingConfirm = (signIn: boolean) => {
    setGoingPromptOpen(false);
    if (signIn && onRequestSignIn) {
      onRequestSignIn();
      return;
    }
    toggleGoing({
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.startDate,
    });
    showToast("Marked as going");
  };

  return (
    <div className="animate-fade-up">
      <button onClick={onBack} className="sift-btn-ghost" style={{ marginBottom: 24 }}>
        <ArrowLeft size={16} strokeWidth={1.5} />
        Back to results
      </button>

      <div className="sift-card" style={{ position: "relative", overflow: "hidden" }}>
        {/* ── Image / placeholder ──────────────────── */}
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            style={{
              width: "100%",
              height: 260,
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: 260,
              background: "hsl(240 7% 90%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ImageIcon size={40} strokeWidth={1} style={{ color: "hsl(240 5% 72%)" }} />
          </div>
        )}

        <div
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <button
            type="button"
            aria-label={savedList ? "Remove from list" : "Save to list"}
            onClick={handleBookmarkClick}
            className="sift-btn-secondary"
            style={{
              padding: "8px 12px",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          >
            <Bookmark
              size={18}
              strokeWidth={1.5}
              fill={savedList ? "currentColor" : "none"}
            />
            {savedList ? "Saved" : "Save"}
          </button>
          <button
            type="button"
            aria-label="Share"
            onClick={() => setShareSheetOpen(true)}
            className="sift-btn-secondary"
            style={{
              padding: "8px 12px",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          >
            <Share2 size={18} strokeWidth={1.5} />
            Share
          </button>
        </div>
        <div className={`sift-card-inner ${event.endingSoon ? "sift-card-inner--ending" : ""}`}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
              paddingRight: 140,
            }}
          >
            <span className="sift-pill sift-pill-category">{event.category}</span>
            {event.endingSoon && (
              <span className="sift-pill sift-pill-ending">
                Ends in {event.daysLeft} days
              </span>
            )}
            {event.price === 0 && <span className="sift-pill sift-pill-free">Free</span>}
          </div>

          <h2
            className="sift-hero-heading"
            style={{ marginBottom: 16, fontSize: "1.5rem", lineHeight: "2rem" }}
          >
            {event.title}
          </h2>

          <p
            className="sift-text-sm"
            style={{
              color: "hsl(185 10% 18%)",
              lineHeight: 1.625,
              marginBottom: 24,
            }}
          >
            {event.description}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
              marginBottom: 32,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <MapPin
                size={18}
                strokeWidth={1.5}
                style={{ color: "hsl(214 33% 49%)", marginTop: 2, flexShrink: 0 }}
              />
              <div>
                <p className="sift-text-sm" style={{ fontWeight: 500, color: "hsl(185 10% 18%)" }}>
                  {event.location}
                </p>
                <p className="sift-text-sm" style={{ color: "hsl(237 8% 35%)" }}>
                  {event.address}, {event.borough}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <CalendarDays
                size={18}
                strokeWidth={1.5}
                style={{ color: "hsl(214 33% 49%)", marginTop: 2, flexShrink: 0 }}
              />
              <div>
                <p className="sift-text-sm" style={{ fontWeight: 500, color: "hsl(185 10% 18%)" }}>
                  {formatEventDate(event)}
                </p>
                <p className="sift-text-sm" style={{ color: "hsl(237 8% 35%)", whiteSpace: "pre-line" }}>
                  {event.time}
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
            {event.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: "0.75rem",
                  padding: "4px 8px",
                  borderRadius: 4,
                  backgroundColor: "hsl(240 7% 94%)",
                  color: "hsl(237 8% 35%)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="sift-btn-primary"
            >
              Check it out
              <ExternalLink size={16} strokeWidth={1.5} />
            </a>
            <button
              type="button"
              onClick={handleGoingClick}
              className={going ? "sift-btn-primary" : "sift-btn-secondary"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {going && <Check size={16} strokeWidth={2} />}
              {going ? "Going" : "Going"}
            </button>
            {goingPromptOpen && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: "100%",
                  marginBottom: 8,
                  padding: 12,
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  zIndex: 10,
                }}
              >
                <p
                  className="sift-text-sm"
                  style={{
                    marginBottom: 10,
                    color: "hsl(var(--foreground))",
                  }}
                >
                  Sign in to track your plans
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => handleGoingConfirm(true)}
                    className="sift-btn-primary"
                    style={{ flex: 1, padding: "0.5rem", fontSize: "0.875rem" }}
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGoingConfirm(false)}
                    className="sift-btn-ghost"
                    style={{ flex: 1, padding: "0.5rem", fontSize: "0.875rem" }}
                  >
                    Not now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomSheet
        open={saveSheetOpen}
        onClose={() => setSaveSheetOpen(false)}
        title="Save to list"
      >
        <SaveToListSheet
          eventId={event.id}
          currentListName={savedList}
          onClose={() => setSaveSheetOpen(false)}
          onSaved={handleSavedToList}
        />
      </BottomSheet>
      <BottomSheet
        open={shareSheetOpen}
        onClose={() => setShareSheetOpen(false)}
        title="Share"
      >
        <ShareSheet
          eventId={event.id}
          eventTitle={event.title}
          onClose={() => setShareSheetOpen(false)}
        />
      </BottomSheet>
    </div>
  );
}