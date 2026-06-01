import * as React from "react";
import { cn, clamp } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 0–1 ratio */
  value: number;
  indicatorClassName?: string;
  /** Explicit indicator color (overrides the default/brand fill). */
  indicatorColor?: string;
}

/** Lightweight progress bar (no Radix dependency). */
export function Progress({
  value,
  className,
  indicatorClassName,
  indicatorColor,
  ...props
}: ProgressProps) {
  const pct = clamp(value) * 100;
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-muted",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full bg-primary transition-all duration-500",
          indicatorClassName
        )}
        style={{ width: `${pct}%`, backgroundColor: indicatorColor }}
      />
    </div>
  );
}
