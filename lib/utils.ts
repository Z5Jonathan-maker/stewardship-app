import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as USD currency. */
export function formatCurrency(
  amount: number,
  opts: { compact?: boolean; signed?: boolean } = {}
) {
  const { compact = false, signed = false } = opts;
  // Round to the displayed precision before deciding the sign, so values like
  // -0.001 don't render as "−$0.00".
  const places = compact ? 1 : 2;
  const rounded =
    Math.round((amount + Number.EPSILON) * 10 ** places) / 10 ** places || 0;
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: places,
    minimumFractionDigits: compact ? 0 : 2,
  }).format(Math.abs(rounded));

  if (signed) {
    return `${rounded < 0 ? "−" : "+"}${formatted}`;
  }
  return rounded < 0 ? `−${formatted}` : formatted;
}

/** Format a 0–1 ratio as a percentage string. */
export function formatPercent(ratio: number, fractionDigits = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: fractionDigits,
  }).format(ratio);
}

/** Clamp a number between min and max. */
export function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/**
 * Format an ISO date ("YYYY-MM-DD") deterministically — parsed from the
 * string itself, with no Date/timezone/locale dependence, so server and
 * client render identical output (avoids hydration mismatches).
 */
export function formatDateShort(iso: string) {
  const [, m, d] = iso.split("-").map(Number);
  return `${MONTHS_SHORT[m - 1]} ${d}`;
}

export function formatDateLong(iso: string) {
  const [, m, d] = iso.split("-").map(Number);
  return `${MONTHS_LONG[m - 1]} ${d}`;
}

// "Today" is fixed to the demo's current date so grouping is deterministic.
const TODAY_ISO = "2026-05-31";
const YESTERDAY_ISO = "2026-05-30";

/** A relative day label for transaction grouping ("Today" / "Yesterday" / "May 30"). */
export function formatDayGroup(iso: string) {
  if (iso === TODAY_ISO) return "Today";
  if (iso === YESTERDAY_ISO) return "Yesterday";
  return formatDateLong(iso);
}

/** Group date-sorted items into consecutive day buckets, preserving order. */
export function groupByDay<T extends { date: string }>(items: T[]) {
  const groups: { label: string; date: string; items: T[] }[] = [];
  for (const item of items) {
    const last = groups[groups.length - 1];
    if (last && last.date === item.date) last.items.push(item);
    else groups.push({ label: formatDayGroup(item.date), date: item.date, items: [item] });
  }
  return groups;
}
