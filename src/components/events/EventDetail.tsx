import { ArrowLeft, Clock, ExternalLink, MapPin } from "lucide-react";
import type { SiftEvent } from "@/types/event";

interface EventDetailProps {
  event: SiftEvent;
  onBack: () => void;
}

export default function EventDetail({ event, onBack }: EventDetailProps) {
  return (
    <div className="animate-fade-up">
      <button onClick={onBack} className="sift-btn-ghost" style={{ marginBottom: 24 }}>
        <ArrowLeft size={16} strokeWidth={1.5} />
        Back to results
      </button>

      <div className="sift-card">
        <div className={`sift-card-inner ${event.endingSoon ? "sift-card-inner--ending" : ""}`}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 8,
              marginBottom: 16,
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
                  {event.neighborhood}, {event.borough}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <Clock
                size={18}
                strokeWidth={1.5}
                style={{ color: "hsl(214 33% 49%)", marginTop: 2, flexShrink: 0 }}
              />
              <div>
                <p className="sift-text-sm" style={{ fontWeight: 500, color: "hsl(185 10% 18%)" }}>
                  {event.date}
                </p>
                <p className="sift-text-sm" style={{ color: "hsl(237 8% 35%)" }}>
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

          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            className="sift-btn-primary"
          >
            Check it out
            <ExternalLink size={16} strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </div>
  );
}