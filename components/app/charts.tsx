import { formatCurrency } from "@/lib/utils";

/** Grouped income/expense bar chart (pure SVG, no deps). */
export function CashFlowBars({
  data,
  height = 200,
}: {
  data: { month: string; income: number; expenses: number }[];
  height?: number;
}) {
  const max = Math.max(...data.map((d) => Math.max(d.income, d.expenses))) * 1.1;
  return (
    <div>
      <div className="flex items-end gap-3" style={{ height }}>
        {data.map((d) => (
          <div key={d.month} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex w-full flex-1 items-end justify-center gap-1.5">
              <div
                className="w-1/3 rounded-t-md bg-evergreen-500 transition-all"
                style={{ height: `${(d.income / max) * 100}%` }}
                title={`Income ${formatCurrency(d.income)}`}
              />
              <div
                className="w-1/3 rounded-t-md bg-brand-400 transition-all"
                style={{ height: `${(d.expenses / max) * 100}%` }}
                title={`Expenses ${formatCurrency(d.expenses)}`}
              />
            </div>
            <span className="text-xs text-muted-foreground">{d.month}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-5 text-xs text-evergreen-700">
        <Legend className="bg-evergreen-500" label="Income" />
        <Legend className="bg-brand-400" label="Expenses" />
      </div>
    </div>
  );
}

/** Smooth area/line sparkline for trends (pure SVG). */
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

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="h-full w-full"
      role="img"
      aria-label="Trend over time"
    >
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.22" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </linearGradient>
      </defs>
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
    </svg>
  );
}

/** Horizontal spending breakdown bars. */
export function BreakdownBars({
  items,
}: {
  items: { name: string; emoji: string; amount: number }[];
}) {
  const total = items.reduce((s, i) => s + i.amount, 0);
  return (
    <div className="space-y-3">
      {items.slice(0, 6).map((item) => {
        const pct = item.amount / total;
        return (
          <div key={item.name}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-evergreen-800">
                {item.emoji} {item.name}
              </span>
              <span className="font-medium text-evergreen-900">
                {formatCurrency(item.amount)}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-brand-500"
                style={{ width: `${pct * 100}%` }}
              />
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
