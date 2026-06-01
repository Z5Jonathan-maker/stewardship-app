"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { formatCurrency, formatPercent } from "@/lib/utils";

type Format = "currency" | "currency-signed" | "percent";

function render(n: number, format: Format) {
  if (format === "currency-signed") return formatCurrency(n, { signed: true });
  if (format === "percent") return formatPercent(n, 1);
  return formatCurrency(n);
}

/**
 * Animates a number from 0 to its value on mount, formatting each frame.
 * `format` is a string (not a function) so it's serializable across the
 * server→client boundary. SSR-safe: initial render is the final value.
 */
export function CountUp({
  value,
  format = "currency",
  duration = 0.9,
}: {
  value: number;
  format?: Format;
  duration?: number;
}) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(0);

  useEffect(() => {
    const controls = animate(prev.current, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, duration]);

  return <>{render(display, format)}</>;
}
