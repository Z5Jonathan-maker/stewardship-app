import { formatCurrency } from "@/lib/utils";
import { categoryMeta } from "@/lib/categories";
import { CategoryIcon } from "@/components/app/category-icon";

const GRIDLINES = [0.25, 0.5, 0.75, 1];

/** Grouped income/expense bar chart (pure SVG/CSS, no deps). */
export function CashFlowBars({
  data,
  height = 200,
}: {
  data: { month: string; income: number; expenses: number }[];
  height?: number;
}) {
  const max = Math.max(...data.map((d) => Math.max(d.income, d.expenses))) * 1.15 || 1;
  return (
    <div>
      <div className="relative" style={{ height }}>
        {/* gridlines */}
        <div className="pointer-events-none absolute inset-0">
          {GRIDLINES.map((g) => (
            <div
              key={g}
              className="absolute inset-x-0 border-t border-dashed border-border/60"
              style={{ bottom: `${g * 100}%` }}
            />
          ))}
        </div>
        {/* baseline */}
        <div className="absolute inset-x-0 bottom-0 border-t border-border" />
        {/* bars */}
        <div className="absolute inset-0 flex items-end gap-2 sm:gap-3">
          {data.map((d) => (
            <div
              key={d.month}
              className="group flex h-full flex-1 items-end justify-center gap-1 sm:gap-1.5"
            >
              <div
                className="w-2.5 rounded-t-md bg-evergreen-500/90 transition-all duration-200 group-hover:bg-evergreen-500"
                style={{ height: `${(d.income / max) * 100}%` }}
                title={`${d.month} income · ${formatCurrency(d.income)}`}
              />
              <div
                className="w-2.5 rounded-t-md bg-brand-400/90 transition-all duration-200 group-hover:bg-brand-500"
                style={{ height: `${(d.expenses / max) * 100}%` }}
                title={`${d.month} expenses · ${formatCurrency(d.expenses)}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* month labels, aligned under each group */}
      <div className="mt-2.5 flex gap-2 sm:gap-3">
        {data.map((d) => (
          <span key={d.month} className="flex-1 text-center text-xs text-muted-foreground">
            {d.month}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-5 text-xs text-evergreen-700">
        <Legend className="bg-evergreen-500" label="Income" />
        <Legend className="bg-brand-400" label="Expenses" />
      </div>
    </div>
  );
}

/** Smooth area/line sparkline for trends, with an endpoint marker (pure SVG). */
export function TrendLine({
  data,
  height = 120,
}: {
  data: { month: string; value: number }[];
  height?: number;
}) {
  const width = 100; // viewBox units; scales responsively
  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);

  const points = data.map((d, i) => {
    const x = i * stepX;
    const y = height - ((d.value - min) / range) * (height - 16) - 8;
    return { x, y };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;
  const end = points[points.length - 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="h-full w-full overflow-visible"
      role="img"
      aria-label="Trend over time"
    >
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.22" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* faint baseline */}
      <line
        x1="0"
        y1={height - 0.5}
        x2={width}
        y2={height - 0.5}
        stroke="hsl(var(--border))"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      <path d={areaPath} fill="url(#trendFill)" />
      <path
        d={linePath}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {/* endpoint marker */}
      <circle cx={end.x} cy={end.y} r="3.5" fill="hsl(var(--primary))" vectorEffect="non-scaling-stroke" />
      <circle cx={end.x} cy={end.y} r="6" fill="hsl(var(--primary))" fillOpacity="0.18" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Horizontal spending breakdown, color-coded by category. */
export function BreakdownBars({
  items,
}: {
  items: { name: string; amount: number }[];
}) {
  const total = items.reduce((s, i) => s + i.amount, 0) || 1;
  return (
    <div className="space-y-3.5">
      {items.slice(0, 6).map((item) => {
        const pct = item.amount / total;
        const { color } = categoryMeta(item.name);
        return (
          <div key={item.name} className="flex items-center gap-3">
            <CategoryIcon category={item.name} className="h-8 w-8 rounded-lg" iconClassName="h-4 w-4" />
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="truncate text-evergreen-800">{item.name}</span>
                <span className="font-medium tabular-nums text-evergreen-900">
                  {formatCurrency(item.amount)}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct * 100}%`, backgroundColor: color }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 rounded-sm ${className}`} />
      {label}
    </span>
  );
}
