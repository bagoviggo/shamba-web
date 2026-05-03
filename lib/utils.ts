import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatKES(value: number | null | undefined): string {
  if (value == null) return "—";
  return `KES ${value.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatChange(pct: number): string {
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}

export function isPositive(pct: number): boolean {
  return pct >= 0;
}

export const COMMODITY_EMOJI: Record<string, string> = {
  "Dry Maize":           "🌽",
  "Tomatoes":            "🍅",
  "Kales/Sukuma Wiki":   "🥬",
  "Red Irish Potato":    "🥔",
  "Avocado":             "🥑",
  "Beans Red Haricot":   "🫘",
  "Carrots":             "🥕",
  "Onions":              "🧅",
  "Cabbage":             "🥦",
  "Banana":              "🍌",
  "Mango":               "🥭",
  "Oranges":             "🍊",
  "Watermelon":          "🍉",
  "Pineapple":           "🍍",
  "Milk":                "🥛",
  "Eggs":                "🥚",
  "Beef":                "🥩",
  "Chicken":             "🍗",
  "Fish":                "🐟",
};

export function getEmoji(commodity: string): string {
  for (const [key, emoji] of Object.entries(COMMODITY_EMOJI)) {
    if (commodity.toLowerCase().includes(key.toLowerCase())) return emoji;
  }
  return "🌾";
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-KE", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export function slugify(str: string): string {
  return encodeURIComponent(str);
}

// Group trend data by county for recharts
export function groupTrendByCounty(
  data: { recorded_date: string; county: string; avg_retail: number | null }[]
): { date: string; [county: string]: string | number | null }[] {
  const byDate: Record<string, Record<string, number | null>> = {};
  for (const row of data) {
    if (!byDate[row.recorded_date]) byDate[row.recorded_date] = {};
    byDate[row.recorded_date][row.county] = row.avg_retail;
  }
  return Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, counties]) => ({
      date: new Date(date).toLocaleDateString("en-KE", { month: "short", day: "numeric" }),
      ...counties,
    }));
}

export const CHART_COLORS = [
  "#4A8C5C", "#E8A020", "#C4622D", "#2D5A3D",
  "#8CC63F", "#1C3A2A", "#F59E0B", "#EF4444",
];
