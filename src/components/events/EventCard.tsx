"use client";

import { useState } from "react";
import { Clock, DollarSign, MapPin, Sparkles, X } from "lucide-react";
import type { SiftEvent } from "@/types/event";

interface EventCardProps {
  event: SiftEvent;
  index: number;
  onClick: () => void;
  onDismiss: () => void;
}

function formatEventDate(event: SiftEvent) {
  if (event.endDate && event.endDate !== event.startDate) {
    return `${event.startDate} → ${event.endDate}`;
  }
  return event.startDate;
}

export default function EventCard({
  event,
  index,
  onClick,
  onDismiss,
}: EventCardProps) {
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
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 2,
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
                  paddingRight: 40,
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
                  <Clock size={14} strokeWidth={1.5} />
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
        </div>
      </div>
    </div>
  );
}