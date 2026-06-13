import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Hide the wordmark, show only the mark. */
  markOnly?: boolean;
  /** Force a single color (e.g. for footer on dark bg). */
  tone?: "default" | "inverted";
}

/** Canonical UniFi brand colors (sampled from the master logo raster). */
export const BRAND_NAVY = "#04265E";
export const BRAND_GREEN = "#58A888";
export const BRAND_OVERLAP = "#2F8579";

/**
 * UniFi brand mark — two leaves, navy and green, overlapping.
 * Each leaf is a square rounded on the top-left and bottom-right corners;
 * the green leaf sits up-right of the navy one and their square corners
 * meet in a teal overlap: two lives joined, growth in common purpose.
 */
function LeafMark({ className }: { className?: string }) {
  // Leaf: side 20, corner radius 12 on TL + BR, square on TR + BL.
  // Navy at (0,12), green at (12,0) in a 32×32 box → 8×8 overlap.
  const leaf = (x: number, y: number) =>
    `M ${x} ${y + 20} L ${x} ${y + 12} A 12 12 0 0 1 ${x + 12} ${y} L ${
      x + 20
    } ${y} L ${x + 20} ${y + 8} A 12 12 0 0 1 ${x + 8} ${y + 20} Z`;
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d={leaf(0, 12)} fill={BRAND_NAVY} />
      <path d={leaf(12, 0)} fill={BRAND_GREEN} />
      <path d="M 12 12 H 20 V 20 H 12 Z" fill={BRAND_OVERLAP} />
    </svg>
  );
}

export function Logo({ className, markOnly = false, tone = "default" }: LogoProps) {
  const uniColor = tone === "inverted" ? "text-cream-50" : "text-[#04265E]";
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LeafMark className="h-7 w-7" />
      {!markOnly && (
        <span
          className={cn(
            "font-display text-[1.15rem] font-semibold tracking-tight",
            uniColor
          )}
        >
          Uni
          <span className="text-[#58A888]">Fi</span>
        </span>
      )}
    </span>
  );
}
