"use client";

import { useState } from "react";
import {
  Bookmark,
  CalendarDays,
  Check,
  DollarSign,
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
  theater: "arts",
  workshops: "arts",
  comedy: "comedy",
  food: "food",
  outdoor: "outdoors",
  nightlife: "nightlife",
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
  const delay =
    [
      "animate-fade-up",
      "animate-fade-up-delay-1",
      "animate-fade-up-delay-2",
      "animate-fade-up-delay-3",
      "animate-fade-up-delay-4",
    ][index] || "animate-fade-up-delay-4";

  const [isDeleteHovered, setIsDeleteHovered] = useState(false);
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

  const handleDismiss = () => {
    if (isDismissing) return;
    setIsDismissing(true);
    window.setTimeout(() => {
      onDismiss();
    }, 220);
  };

  return (
    <div
      className={delay}
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "var(--radius)",
          background: "rgba(220, 38, 38, 0.10)",
          border: "1px solid rgba(220, 38, 38, 0.18)",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: 14,
          opacity: isDeleteHovered || isDismissing ? 1 : 0,
          transition: "opacity 0.2s ease",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 9999,
            background: "rgba(220, 38, 38, 0.14)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgb(185, 28, 28)",
          }}
        >
          <X size={16} strokeWidth={1.75} />
        </div>
      </div>

      <div
        style={{
          transform: isDismissing
            ? "translateX(-88px)"
            : isDeleteHovered
            ? "translateX(-10px)"
            : "translateX(0)",
          opacity: isDismissing ? 0 : 1,
          transition: "transform 0.22s ease, opacity 0.22s ease",
        }}
      >
        <div
          className="sift-card"
          style={{ width: "100%", textAlign: "left", position: "relative" }}
        >
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <button
              type="button"
              aria-label={savedList ? "Remove from list" : "Save to list"}
              onClick={handleBookmarkClick}
              style={{
                width: 32,
                height: 32,
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
                size={16}
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
                width: 32,
                height: 32,
                borderRadius: 9999,
                border: "1px solid hsl(var(--border))",
                background: "white",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Share2 size={16} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="Dismiss event"
              onMouseEnter={() => setIsDeleteHovered(true)}
              onMouseLeave={() => setIsDeleteHovered(false)}
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss();
              }}
              style={{
                width: 32,
                height: 32,
                borderRadius: 9999,
                border: "1px solid hsl(var(--border))",
                background: "white",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>

          <button
            type="button"
            onClick={onClick}
            style={{
              width: "100%",
              textAlign: "left",
              cursor: "pointer",
              background: "transparent",
              border: "none",
              padding: 0,
            }}
          >
            <div
              className={`sift-card-inner ${
                event.endingSoon ? "sift-card-inner--ending" : ""
              }`}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                  paddingRight: 112,
                }}
              >
                <span className="sift-pill sift-pill-category">
                  {event.category}
                </span>
                {event.endingSoon && (
                  <span className="sift-pill sift-pill-ending">
                    Ends in {event.daysLeft} days
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
                    Matches your interests
                  </span>
                )}
              </div>

              <h3 className="sift-h3" style={{ marginBottom: 8 }}>
                {event.title}
              </h3>

              <div className="sift-meta" style={{ marginBottom: 12 }}>
                <span className="sift-meta-item">
                  <MapPin size={14} strokeWidth={1.5} />
                  {event.location}
                </span>
                <span className="sift-meta-item">
                  <CalendarDays size={14} strokeWidth={1.5} />
                  {formatEventDate(event)}
                </span>
                <span className="sift-meta-item">
                  <DollarSign size={14} strokeWidth={1.5} />
                  {event.priceLabel}
                </span>
              </div>

              {event.matchReason && (
                <p className="sift-match">
                  <Sparkles size={14} strokeWidth={1.5} />
                  Matched because: {event.matchReason}
                </p>
              )}
            </div>
          </button>

          <div
            style={{
              padding: "0 1.5rem 1.5rem",
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
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
              }}
            >
              {going && <Check size={16} strokeWidth={2} />}
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