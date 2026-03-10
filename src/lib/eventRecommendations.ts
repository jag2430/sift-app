import { events } from "@/data/events";
import type { SiftEvent } from "@/types/event";
import type { Filters } from "@/types/quiz";

function rangesOverlap(
  filterStart: string,
  filterEnd: string,
  eventStart: string,
  eventEnd?: string
) {
  const userStart = new Date(filterStart);
  const userEnd = new Date(filterEnd);
  const itemStart = new Date(eventStart);
  const itemEnd = new Date(eventEnd ?? eventStart);

  return itemStart <= userEnd && itemEnd >= userStart;
}

export function getRecommendedEvents(
  filters: Filters,
  excludedIds: string[] = []
): SiftEvent[] {
  let filtered = [...events];

  if (excludedIds.length > 0) {
    filtered = filtered.filter((e) => !excludedIds.includes(e.id));
  }

  if (filters.category) {
    filtered = filtered.filter((e) => e.category === filters.category);
  }

  if (filters.dateFrom && filters.dateTo) {
    const { dateFrom, dateTo } = filters;
    filtered = filtered.filter((e) =>
        rangesOverlap(dateFrom, dateTo, e.startDate, e.endDate)
    );
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
    if (filters.dateFrom && filters.dateTo) {
      reasons.push("Available in your selected dates");
    }
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