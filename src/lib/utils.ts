import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Position } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const POS_COLORS: Record<string, string> = {
  QB: "#e74c3c",
  RB: "#2ecc71",
  WR: "#3498db",
  TE: "#e67e22",
  OT: "#9b59b6",
  OG: "#8e44ad",
  OL: "#8e44ad",
  EDGE: "#f39c12",
  DT: "#1abc9c",
  DL: "#1abc9c",
  LB: "#e91e63",
  CB: "#00bcd4",
  S: "#ff9800",
};

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function generateLeagueCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}
