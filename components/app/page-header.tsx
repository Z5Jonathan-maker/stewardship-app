import { CalendarDays, SlidersHorizontal } from "lucide-react";

export function PageHeader({
  title,
  subtitle,
  action,
  range,
}: {
  title: string;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  /** Monarch-style date-range chip, e.g. "This month". */
  range?: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-evergreen-900">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-evergreen-700">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {range && (
          <>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-evergreen-900">
              <CalendarDays className="h-3.5 w-3.5 text-evergreen-600" />
              {range}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-evergreen-900">
              <SlidersHorizontal className="h-3.5 w-3.5 text-evergreen-600" />
              Filters
            </span>
          </>
        )}
        {action}
      </div>
    </div>
  );
}
