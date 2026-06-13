"use client";

import { cn } from "@/lib/utils";

/**
 * Monarch-style segmented control: plain text tabs, active one in the leaf
 * green — no pills, no underlines (see docs/design/monarch-study.md).
 */
export function SegmentedTabs({
  tabs,
  active,
  onChange,
  className,
}: {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn("flex items-center gap-5 border-b border-border pb-2", className)}
    >
      {tabs.map((t) => (
        <button
          key={t}
          role="tab"
          aria-selected={t === active}
          onClick={() => onChange(t)}
          className={cn(
            "text-sm font-medium transition-colors",
            t === active
              ? "text-leaf-deep"
              : "text-muted-foreground hover:text-evergreen-900"
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
