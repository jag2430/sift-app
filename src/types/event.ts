export type EventCategory =
  | "arts"
  | "music"
  | "comedy"
  | "food"
  | "outdoors"
  | "nightlife";

export type EventVibe = "chill" | "lively" | "adventurous" | "cultural";

export type EventDistance = "neighborhood" | "borough" | "anywhere";

export type PriceRange = "free" | "under-20" | "under-50" | "any";

export interface SiftEvent {
  id: string;
  title: string;
  category: EventCategory;
  vibes: EventVibe[];
  description: string;
  location: string;
  neighborhood: string;
  borough: "Manhattan" | "Brooklyn" | "Queens" | "Bronx" | "Staten Island";
  date: string;
  time: string;
  price: number;
  priceLabel: string;
  link: string;
  matchReason?: string;
  endingSoon?: boolean;
  daysLeft?: number;
  tags: string[];
}