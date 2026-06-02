"use client";

import { useState } from "react";
import { institutionMeta } from "@/lib/institutions";
import { cn } from "@/lib/utils";

/**
 * Institution mark: a real self-hosted logo on a clean white tile when we have
 * one, otherwise a brand-colored monogram. Falls back to the monogram if the
 * image fails to load. `className` overrides size (call sites pass h-8/h-9 etc.).
 */
export function InstitutionLogo({
  institution,
  className,
}: {
  institution: string;
  className?: string;
}) {
  const { color, initials, logo } = institutionMeta(institution);
  const [errored, setErrored] = useState(false);

  if (logo && !errored) {
    return (
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white p-1.5",
          className
        )}
        aria-hidden
      >
        {/* Static, self-hosted asset — plain img keeps it simple and same-origin. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo}
          alt=""
          className="h-full w-full object-contain"
          onError={() => setErrored(true)}
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold tracking-tight text-white",
        className
      )}
      style={{ backgroundColor: color }}
      aria-hidden
    >
      {initials}
    </span>
  );
}
