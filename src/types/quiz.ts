import type {
  EventCategory,
  EventDistance,
  PriceRange,
} from "@/types/event";

export type Step =
  | "welcome"
  | "category"
  | "date"
  | "distance"
  | "price"
  | "results";

export interface Filters {
  category?: EventCategory;
  dateFrom?: string;
  dateTo?: string;
  price?: PriceRange;
  distance?: EventDistance;
}