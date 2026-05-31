import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Hide the wordmark, show only the mark. */
  markOnly?: boolean;
  /** Force a single color (e.g. for footer on dark bg). */
  tone?: "default" | "inverted";
}

/**
 * Unite Financial brand mark — two strokes rising and joining at a point.
 * A nod to "two distinct lines that come together, joined in common purpose":
 * faith + finances, partners, household + community.
 */
export function Logo({ className, markOnly = false, tone = "default" }: LogoProps) {
  const wordColor =
    tone === "inverted" ? "text-cream-50" : "text-evergreen-900";
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative inline-flex h-8 w-8 items-center justify-center">
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          aria-hidden="true"
        >
          <rect width="32" height="32" rx="9" className="fill-evergreen-800" />
          {/* Two strokes converging upward */}
          <path
            d="M9 23 L16 9"
            className="stroke-cream-50"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M23 23 L16 9"
            className="stroke-brand-400"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="16" cy="9" r="2.4" className="fill-brand-400" />
        </svg>
      </span>
      {!markOnly && (
        <span
          className={cn(
            "font-display text-[1.15rem] font-semibold tracking-tight",
            wordColor
          )}
        >
          Unite
        </span>
      )}
    </span>
  );
}
