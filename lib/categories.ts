import type { LucideIcon } from "lucide-react";
import {
  ShoppingCart,
  Utensils,
  Coffee,
  Fuel,
  Car,
  ShoppingBag,
  Tv,
  Zap,
  Smartphone,
  Home,
  Wallet,
  TrendingUp,
  PiggyBank,
  HeartPulse,
  HandHeart,
  Church,
  Plane,
  Tag,
} from "lucide-react";

/**
 * The category color + icon system. Every spending/income/giving category
 * maps to a brand-controlled color and icon, so the whole product can be
 * parsed by color at a glance (chips, charts, budget bars, transaction rows).
 * Matched by keyword so it covers both transaction categories and the
 * differently-named budget categories.
 */
interface Rule {
  test: RegExp;
  color: string;
  Icon: LucideIcon;
}

const RULES: Rule[] = [
  { test: /tithe/, color: "#b35074", Icon: Church },
  { test: /generos|charit|giving|gift|missions|offering|donat/, color: "#cc6b52", Icon: HandHeart },
  { test: /groc/, color: "#3f9257", Icon: ShoppingCart },
  { test: /dining|restaurant|food/, color: "#cf8a2f", Icon: Utensils },
  { test: /coffee/, color: "#9c6b3f", Icon: Coffee },
  { test: /gas|fuel/, color: "#cb6a3c", Icon: Fuel },
  { test: /transport|auto|\bcar\b|ride/, color: "#c25f33", Icon: Car },
  { test: /vacation|travel|\btrip\b|holiday|missions/, color: "#2f93a3", Icon: Plane },
  { test: /shop/, color: "#bd5894", Icon: ShoppingBag },
  { test: /subscription|netflix|stream|entertain/, color: "#7a5fc4", Icon: Tv },
  { test: /util/, color: "#2f93a3", Icon: Zap },
  { test: /phone|internet/, color: "#3a82bd", Icon: Smartphone },
  { test: /hous|rent|mortgage/, color: "#5360c2", Icon: Home },
  { test: /paycheck|income|take-home|salary|payroll/, color: "#2f8f63", Icon: Wallet },
  { test: /invest|401|ira|retire|brokerage/, color: "#2a9285", Icon: TrendingUp },
  { test: /emergency|saving|fund|reserve/, color: "#3b63f0", Icon: PiggyBank },
  { test: /health|medical|fitness|gym|insurance/, color: "#c45563", Icon: HeartPulse },
];

const DEFAULT_COLOR = "#6b7a72";

export function categoryMeta(name: string): { color: string; Icon: LucideIcon } {
  const lower = name.toLowerCase();
  const rule = RULES.find((r) => r.test.test(lower));
  return { color: rule?.color ?? DEFAULT_COLOR, Icon: rule?.Icon ?? Tag };
}

// ---- hex helpers ----------------------------------------------------------

function parse(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}
function toHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, "0"))
      .join("")
  );
}

/** Mix a color toward white — returns a light pastel tint (solid, no alpha). */
export function tint(hex: string, t = 0.16) {
  const [r, g, b] = parse(hex);
  const mix = (c: number) => c * t + 255 * (1 - t);
  return toHex(mix(r), mix(g), mix(b));
}

/** Darken a color toward black — used for readable text on a light tint. */
export function shade(hex: string, amt = 0.42) {
  const [r, g, b] = parse(hex);
  return toHex(r * (1 - amt), g * (1 - amt), b * (1 - amt));
}
