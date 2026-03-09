import { Clock, DollarSign, MapPin, Sparkles } from "lucide-react";
import type { SiftEvent } from "@/types/event";

interface EventCardProps {
  event: SiftEvent;
  index: number;
  onClick: () => void;
}

export default function EventCard({ event, index, onClick }: EventCardProps) {
  const delay =
    [
      "animate-fade-up",
      "animate-fade-up-delay-1",
      "animate-fade-up-delay-2",
      "animate-fade-up-delay-3",
      "animate-fade-up-delay-4",
    ][index] || "animate-fade-up-delay-4";

  return (
    <button
      onClick={onClick}
      className={`sift-card ${delay}`}
      style={{ width: "100%", textAlign: "left", cursor: "pointer" }}
    >
      <div className={`sift-card-inner ${event.endingSoon ? "sift-card-inner--ending" : ""}`}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span className="sift-pill sift-pill-category">{event.category}</span>
          {event.endingSoon && (
            <span className="sift-pill sift-pill-ending">
              Ends in {event.daysLeft} days
            </span>
          )}
          {event.price === 0 && <span className="sift-pill sift-pill-free">Free</span>}
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
            {event.date}
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
  );
}