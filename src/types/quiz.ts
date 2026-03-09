import type {
  EventCategory,
  EventDistance,
  EventVibe,
  PriceRange,
} from "@/types/event";

export type Step =
  | "welcome"
  | "category"
  | "vibe"
  | "price"
  | "distance"
  | "results";

export interface Filters {
  category?: EventCategory;
  vibe?: EventVibe;
  price?: PriceRange;
  distance?: EventDistance;
}