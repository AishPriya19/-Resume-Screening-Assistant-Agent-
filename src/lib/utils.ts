import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Rating } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ratingClass(rating: string | Rating | undefined): string {
  switch (rating) {
    case "Meets":
      return "badge-meets";
    case "Partially Meets":
      return "badge-partial";
    case "Does Not Meet":
      return "badge-miss";
    default:
      return "badge-miss";
  }
}

export function ratingDotColour(rating: string | Rating | undefined): string {
  switch (rating) {
    case "Meets":
      return "#10B981";
    case "Partially Meets":
      return "#F59E0B";
    case "Does Not Meet":
      return "#EF4444";
    default:
      return "#94a3b8";
  }
}

export function initials(name: string): string {
  return (name || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
