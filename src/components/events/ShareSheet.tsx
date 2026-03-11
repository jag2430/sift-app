"use client";

import { useCallback } from "react";
import { useToast } from "@/components/ui/Toast";

const BASE_URL = "https://sift.app/event";

interface ShareSheetProps {
  eventId: string;
  eventTitle: string;
  onClose: () => void;
}

export default function ShareSheet({
  eventId,
  eventTitle,
  onClose,
}: ShareSheetProps) {
  const { showToast } = useToast();
  const url = `${BASE_URL}/${eventId}`;
  const text = `Check out this event on Sift: ${eventTitle} ${url}`;

  const copyLink = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast("Link copied");
      onClose();
    }
  }, [url, showToast, onClose]);

  const shareSms = useCallback(() => {
    const smsUrl = `sms:&body=${encodeURIComponent(text)}`;
    window.open(smsUrl, "_blank");
    onClose();
  }, [text, onClose]);

  const shareWhatsApp = useCallback(() => {
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
    onClose();
  }, [text, onClose]);

  const shareNative = useCallback(async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: eventTitle,
          text,
          url,
        });
        showToast("Shared");
        onClose();
      } catch {
        copyLink();
      }
    } else {
      copyLink();
    }
  }, [eventTitle, text, url, showToast, onClose, copyLink]);

  return (
    <div>
      <p
        className="sift-text-sm"
        style={{
          color: "hsl(var(--secondary))",
          marginBottom: 16,
          lineHeight: 1.5,
        }}
      >
        Share this event
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <button
          type="button"
          onClick={copyLink}
          className="sift-option"
          style={{ textAlign: "left", padding: "0.75rem 1rem" }}
        >
          Copy link
        </button>
        <button
          type="button"
          className="sift-option"
          style={{
            textAlign: "left",
            padding: "0.75rem 1rem",
            color: "hsl(var(--secondary))",
          }}
          disabled
        >
          Share to Instagram Stories — Coming soon
        </button>
        <button
          type="button"
          onClick={shareSms}
          className="sift-option"
          style={{ textAlign: "left", padding: "0.75rem 1rem" }}
        >
          Share via iMessage
        </button>
        <button
          type="button"
          onClick={shareWhatsApp}
          className="sift-option"
          style={{ textAlign: "left", padding: "0.75rem 1rem" }}
        >
          Share via WhatsApp
        </button>
        <button
          type="button"
          onClick={shareNative}
          className="sift-option"
          style={{ textAlign: "left", padding: "0.75rem 1rem" }}
        >
          More…
        </button>
      </div>
    </div>
  );
}
