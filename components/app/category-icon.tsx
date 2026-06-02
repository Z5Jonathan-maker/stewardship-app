import { categoryMeta, tint, shade } from "@/lib/categories";
import { cn } from "@/lib/utils";

// InstitutionLogo now shows real self-hosted marks with a monogram fallback;
// it lives in its own client component. Re-exported so existing imports
// (`@/components/app/category-icon`) keep working.
export { InstitutionLogo } from "@/components/app/institution-logo";

/** A category in a colored, rounded token — the core visual unit for spending. */
export function CategoryIcon({
  category,
  className,
  iconClassName,
}: {
  category: string;
  className?: string;
  iconClassName?: string;
}) {
  const { color, Icon } = categoryMeta(category);
  return (
    <span
      className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", className)}
      style={{ backgroundColor: tint(color) }}
      aria-hidden
    >
      <Icon className={cn("h-5 w-5", iconClassName)} style={{ color }} />
    </span>
  );
}

/** A colored category label chip (tinted bg + dark, readable category color). */
export function CategoryChip({
  category,
  className,
}: {
  category: string;
  className?: string;
}) {
  const { color } = categoryMeta(category);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        className
      )}
      style={{ backgroundColor: tint(color), color: shade(color) }}
    >
      {category}
    </span>
  );
}
