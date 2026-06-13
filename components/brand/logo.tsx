import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Show only the leaf mark (square), no wordmark. */
  markOnly?: boolean;
  /** Use the cream-on-dark lockup (e.g. the evergreen footer). */
  tone?: "default" | "inverted";
}

/** Canonical UniFi brand colors (sampled from the master logo raster). */
export const BRAND_NAVY = "#04265E";
export const BRAND_GREEN = "#58A888";
export const BRAND_OVERLAP = "#2F8579";
/** Wordmark-text green, darkened to ≥4.5:1 contrast on the cream canvas. */
export const BRAND_GREEN_TEXT = "#27705A";

/**
 * UniFi logo — the real artwork, cropped from the master raster
 * (public/brand/unifi-logo-master.jpg) with the cream background keyed to
 * transparency. Three assets: full lockup, cream-on-dark lockup, and the
 * square leaf mark for compact/icon contexts. Size via `className` height;
 * width follows the intrinsic aspect ratio.
 */
export function Logo({ className, markOnly = false, tone = "default" }: LogoProps) {
  if (markOnly) {
    return (
      <Image
        src="/brand/unifi-mark.png"
        alt="UniFi"
        width={174}
        height={174}
        className={cn("h-7 w-auto object-contain", className)}
      />
    );
  }
  const src =
    tone === "inverted"
      ? "/brand/unifi-logo-inverted.png"
      : "/brand/unifi-logo.png";
  return (
    <Image
      src={src}
      alt="UniFi"
      width={674}
      height={215}
      className={cn("h-7 w-auto object-contain", className)}
    />
  );
}
