import { events } from "@/data/events";
import type { SiftEvent } from "@/types/event";
import type { Filters } from "@/types/quiz";

export function getRecommendedEvents(filters: Filters): SiftEvent[] {
  let filtered = [...events];

  if (filters.category) {
    filtered = filtered.filter((e) => e.category === filters.category);
  }

  if (filters.price) {
    switch (filters.price) {
      case "free":
        filtered = filtered.filter((e) => e.price === 0);
        break;
      case "under-20":
        filtered = filtered.filter((e) => e.price <= 20);
        break;
      case "under-50":
        filtered = filtered.filter((e) => e.price <= 50);
        break;
    }
  }

  if (filters.vibe) {
    const vibe = filters.vibe;
    filtered = filtered.filter((e) => e.vibes.includes(vibe));
    }

  if (filters.distance) {
    if (filters.distance === "neighborhood") {
      filtered = filtered.filter((e) => e.borough === "Manhattan");
    } else if (filters.distance === "borough") {
      filtered = filtered.filter(
        (e) => e.borough === "Manhattan" || e.borough === "Brooklyn"
      );
    }
  }

  filtered = filtered.map((e) => {
    const reasons: string[] = [];
    if (filters.category) reasons.push(`Matches your mood: ${filters.category}`);
    if (filters.vibe) reasons.push(`${filters.vibe} vibe`);
    if (e.price === 0) reasons.push("It's free");
    if (e.endingSoon) reasons.push(`Only ${e.daysLeft} days left`);
    return {
      ...e,
      matchReason: reasons.length > 0 ? reasons.join(" · ") : "Picked for you",
    };
  });

  filtered = filtered.sort(() => Math.random() - 0.5);
  return filtered.slice(0, 5);
}