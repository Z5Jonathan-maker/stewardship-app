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
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 2,
    minimumFractionDigits: compact ? 0 : 2,
  }).format(Math.abs(amount));

  if (signed) {
    return `${amount < 0 ? "−" : "+"}${formatted}`;
  }
  return amount < 0 ? `−${formatted}` : formatted;
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
