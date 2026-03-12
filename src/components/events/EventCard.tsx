"use client";

import { useState } from "react";
import {
  Bookmark,
  CalendarDays,
  Check,
  DollarSign,
  ImageIcon,
  MapPin,
  Share2,
  Sparkles,
  X,
} from "lucide-react";
import BottomSheet from "@/components/ui/BottomSheet";
import { useToast } from "@/components/ui/Toast";
import { useUser } from "@/context/UserContext";
import type { EventCategory, SiftEvent } from "@/types/event";
import SaveToListSheet from "./SaveToListSheet";
import ShareSheet from "./ShareSheet";

const INTEREST_TO_CATEGORY: Record<string, EventCategory> = {
  live_music: "music",
  art_exhibitions: "arts",
  theater: "theater",
  workshops: "workshops",
  fitness: "fitness",
  comedy: "comedy",
  food: "food",
  outdoor: "outdoors",
  nightlife: "nightlife",
  popups: "popups",
};

function eventMatchesInterests(
  event: SiftEvent,
  interests: string[]
): boolean {
  return interests.some(
    (i) => INTEREST_TO_CATEGORY[i] === event.category
  );
}

interface EventCardProps {
  event: SiftEvent;
  index: number;
  onClick: () => void;
  onDismiss: () => void;
  onRequestSignIn?: () => void;
}

function formatEventDate(event: SiftEvent) {
  if (event.endDate && event.endDate !== event.startDate) {
    return `${event.startDate} ~ ${event.endDate}`;
  }
  return event.startDate;
}

export default function EventCard({
  event,
  index,
  onClick,
  onDismiss,
  onRequestSignIn,
}: EventCardProps) {
  const { showToast } = useToast();
  const {
    isLoggedIn,
    userProfile,
    getSavedListForEvent,
    addSavedEvent,
    removeSavedEvent,
    toggleGoing,
    isGoing,
  } = useUser();
  const interests = userProfile?.interests ?? [];
  const matchesInterests =
    interests.length > 0 && eventMatchesInterests(event, interests);

  const animDelay = index === 0 ? 0 : index === 1 ? 60 : index === 2 ? 120 : index === 3 ? 180 : 240;

  const [isDismissing, setIsDismissing] = useState(false);
  const [saveSheetOpen, setSaveSheetOpen] = useState(false);
  const [shareSheetOpen, setShareSheetOpen] = useState(false);
  const [goingPromptOpen, setGoingPromptOpen] = useState(false);

  const savedList = getSavedListForEvent(event.id);
  const going = isGoing(event.id);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleGoingClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDismissing) return;
    setIsDismissing(true);
    window.setTimeout(() => {
      onDismiss();
    }, 320);
  };

  return (
    <div
      style={{
        perspective: "800px",
        animationDelay: `${animDelay}ms`,
        animationFillMode: "both",
        height: "100%",
      }}
      className="animate-fade-up"
    >
      <div
        style={{
          transition: "transform 0.32s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.28s ease",
          height: "100%",
          ...(isDismissing && {
            transform: "rotateY(90deg) scale(0.85)",
            opacity: 0,
            transformOrigin: "right center",
          }),
        }}
      >
        <div
          className="sift-card"
          style={{
            width: "100%",
            textAlign: "left",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {/* ── Image / placeholder ────────────────── */}
          {event.imageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title}
              style={{
                width: "100%",
                height: 160,
                objectFit: "cover",
                display: "block",
                flexShrink: 0,
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: 160,
                background: "hsl(240 7% 90%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ImageIcon size={28} strokeWidth={1} style={{ color: "hsl(240 5% 72%)" }} />
            </div>
          )}

          {/* ── Top action row ─────────────────────── */}
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <button
              type="button"
              aria-label={savedList ? "Remove from list" : "Save to list"}
              onClick={handleBookmarkClick}
              style={{
                width: 28,
                height: 28,
                borderRadius: 9999,
                border: "1px solid hsl(var(--border))",
                background: "white",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: savedList ? "hsl(var(--primary))" : "hsl(var(--foreground))",
              }}
            >
              <Bookmark
                size={13}
                strokeWidth={1.5}
                fill={savedList ? "currentColor" : "none"}
              />
            </button>
            <button
              type="button"
              aria-label="Share"
              onClick={(e) => {
                e.stopPropagation();
                setShareSheetOpen(true);
              }}
              style={{
                width: 28,
                height: 28,
                borderRadius: 9999,
                border: "1px solid hsl(var(--border))",
                background: "white",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Share2 size={13} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={handleDismiss}
              style={{
                width: 28,
                height: 28,
                borderRadius: 9999,
                border: "1px solid hsl(var(--border))",
                background: "white",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "hsl(var(--secondary))",
              }}
            >
              <X size={13} strokeWidth={2} />
            </button>
          </div>

          {/* ── Card body (clickable) ───────────────── */}
          <button
            type="button"
            onClick={onClick}
            style={{
              flex: 1,
              width: "100%",
              textAlign: "left",
              cursor: "pointer",
              background: "transparent",
              border: "none",
              padding: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              className={`sift-card-inner ${
                event.endingSoon ? "sift-card-inner--ending" : ""
              }`}
              style={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              {/* Pills */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 10,
                  paddingRight: 96,
                }}
              >
                <span className="sift-pill sift-pill-category">
                  {event.category}
                </span>
                {event.endingSoon && (
                  <span className="sift-pill sift-pill-ending">
                    Ends in {event.daysLeft}d
                  </span>
                )}
                {event.price === 0 && (
                  <span className="sift-pill sift-pill-free">Free</span>
                )}
                {matchesInterests && (
                  <span
                    className="sift-pill"
                    style={{
                      color: "hsl(var(--primary))",
                      backgroundColor: "hsl(var(--primary) / 0.12)",
                    }}
                  >
                    <Sparkles size={11} strokeWidth={1.5} style={{ display: "inline", marginRight: 3 }} />
                    For you
                  </span>
                )}
              </div>

              {/* Title */}
              <h3
                className="sift-h3"
                style={{ marginBottom: 10, fontSize: "0.95rem", lineHeight: 1.35 }}
              >
                {event.title}
              </h3>

              {/* Meta */}
              <div className="sift-meta" style={{ marginTop: "auto", marginBottom: 0, flexDirection: "column", gap: 4 }}>
                <span className="sift-meta-item">
                  <MapPin size={12} strokeWidth={1.5} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {event.location}
                  </span>
                </span>
                <span className="sift-meta-item">
                  <CalendarDays size={12} strokeWidth={1.5} />
                  {formatEventDate(event)}
                </span>
                <span className="sift-meta-item">
                  <DollarSign size={12} strokeWidth={1.5} />
                  {event.priceLabel}
                </span>
              </div>

              {event.matchReason && (
                <p className="sift-match" style={{ marginTop: 10, marginBottom: 0 }}>
                  <Sparkles size={12} strokeWidth={1.5} />
                  {event.matchReason}
                </p>
              )}
            </div>
          </button>

          {/* ── Footer actions ──────────────────────── */}
          <div
            style={{
              padding: "0 1.25rem 1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              position: "relative",
            }}
          >
            <button
              type="button"
              onClick={handleGoingClick}
              className={going ? "sift-btn-primary" : "sift-btn-secondary"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "0.45rem 1rem",
                fontSize: "0.82rem",
              }}
            >
              {going && <Check size={14} strokeWidth={2} />}
              {going ? "Going" : "Going"}
            </button>
            {goingPromptOpen && (
              <div
                style={{
                  position: "absolute",
                  bottom: "100%",
                  left: 0,
                  right: 0,
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
                  style={{ marginBottom: 10, color: "hsl(var(--foreground))" }}
                >
                  Sign in to track your plans
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => handleGoingConfirm(true)}
                    className="sift-btn-primary"
                    style={{ flex: 1, padding: "0.5rem", fontSize: "0.8rem" }}
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGoingConfirm(false)}
                    className="sift-btn-ghost"
                    style={{ flex: 1, padding: "0.5rem", fontSize: "0.8rem" }}
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