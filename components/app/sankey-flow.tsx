import { budget, monthlyIncome } from "@/lib/mock-data";
import { formatCurrency, formatPercent, cn } from "@/lib/utils";

/**
 * Monarch-style Sankey cash-flow diagram (see docs/design/monarch-study.md).
 * Pure SVG, server-rendered: Income → budget groups → categories, ribbon
 * widths proportional to actual dollars this month.
 */

const GROUP_ORDER = ["Giving", "Savings", "Fixed", "Flexible"] as const;

const GROUP_HUES: Record<string, { ribbon: string; node: string }> = {
  Giving: { ribbon: "#EAD9A8", node: "#D9B84A" },
  Savings: { ribbon: "#BFE3D0", node: "#58A888" },
  Fixed: { ribbon: "#BCD2F2", node: "#5F84C8" },
  Flexible: { ribbon: "#F2C6BC", node: "#D98B74" },
};

const W = 1000;
const H = 640;
const NODE_W = 10;
const GAP = 14;
const COL_X = [0, 380, 690];
const LABEL_W = 300; // room to the right of the last column for labels

interface Node {
  label: string;
  emoji?: string;
  amount: number;
  y0: number;
  y1: number;
  hue: { ribbon: string; node: string };
}

function stack(
  items: { label: string; emoji?: string; amount: number; hue: Node["hue"] }[],
  total: number,
  drawH: number
): Node[] {
  const gaps = GAP * (items.length - 1);
  let y = (H - drawH) / 2;
  return items.map((it) => {
    const h = Math.max(6, (it.amount / total) * (drawH - gaps));
    const node = { ...it, y0: y, y1: y + h };
    y += h + GAP;
    return node;
  });
}

function ribbon(x0: number, sy0: number, sy1: number, x1: number, ty0: number, ty1: number) {
  const mx = (x0 + x1) / 2;
  return [
    `M ${x0} ${sy0}`,
    `C ${mx} ${sy0} ${mx} ${ty0} ${x1} ${ty0}`,
    `L ${x1} ${ty1}`,
    `C ${mx} ${ty1} ${mx} ${sy1} ${x0} ${sy1}`,
    "Z",
  ].join(" ");
}

export function SankeyFlow({ className }: { className?: string }) {
  const cats = budget.filter((b) => b.group !== "Income" && b.actual > 0);
  const total = monthlyIncome;

  const groups = GROUP_ORDER.map((g) => ({
    label: g,
    amount: cats.filter((c) => c.group === g).reduce((s, c) => s + c.actual, 0),
    hue: GROUP_HUES[g],
  })).filter((g) => g.amount > 0);

  const catItems = GROUP_ORDER.flatMap((g) =>
    cats
      .filter((c) => c.group === g)
      .sort((a, b) => b.actual - a.actual)
      .map((c) => ({ label: c.name, emoji: c.emoji, amount: c.actual, hue: GROUP_HUES[g] }))
  );

  const incomeNode = stack(
    [{ label: "Income", emoji: "💵", amount: total, hue: { ribbon: "#CFE0DA", node: "#245a4a" } }],
    total,
    H * 0.86
  )[0];
  const groupNodes = stack(groups, total, H * 0.86);
  const catNodes = stack(catItems, total, H * 0.92);

  // Ribbon offsets: walk down each source node as flows leave it.
  let gOff = incomeNode.y0;
  const incomeRibbons = groupNodes.map((g) => {
    const h = ((g.amount / total) * (incomeNode.y1 - incomeNode.y0));
    const d = ribbon(COL_X[0] + NODE_W, gOff, gOff + h, COL_X[1], g.y0, g.y1);
    gOff += h;
    return { d, hue: g.hue };
  });

  const groupOffsets = new Map(groupNodes.map((g) => [g.label, g.y0]));
  const catRibbons = GROUP_ORDER.flatMap((gName) => {
    const g = groupNodes.find((n) => n.label === gName);
    if (!g) return [];
    return catNodes
      .filter((c) => cats.find((b) => b.name === c.label)?.group === gName)
      .map((c) => {
        const off = groupOffsets.get(gName)!;
        const h = ((c.amount / g.amount) * (g.y1 - g.y0));
        const d = ribbon(COL_X[1] + NODE_W, off, off + h, COL_X[2], c.y0, c.y1);
        groupOffsets.set(gName, off + h);
        return { d, hue: c.hue };
      });
  });

  return (
    <svg
      viewBox={`0 0 ${W + LABEL_W} ${H}`}
      className={cn("w-full", className)}
      role="img"
      aria-label="Where this month's income flowed, by group and category"
    >
      {[...incomeRibbons, ...catRibbons].map((r, i) => (
        <path key={i} d={r.d} fill={r.hue.ribbon} opacity={0.75} />
      ))}

      {/* Income node + label */}
      <rect x={COL_X[0]} y={incomeNode.y0} width={NODE_W} height={incomeNode.y1 - incomeNode.y0} rx={3} fill={incomeNode.hue.node} />
      <text x={COL_X[0] + NODE_W + 10} y={(incomeNode.y0 + incomeNode.y1) / 2 - 4} className="fill-evergreen-900" fontSize={15} fontWeight={600}>
        💵 Income
      </text>
      <text x={COL_X[0] + NODE_W + 10} y={(incomeNode.y0 + incomeNode.y1) / 2 + 16} className="fill-evergreen-700" fontSize={13}>
        {formatCurrency(total)} (100%)
      </text>

      {groupNodes.map((g) => (
        <g key={g.label}>
          <rect x={COL_X[1]} y={g.y0} width={NODE_W} height={g.y1 - g.y0} rx={3} fill={g.hue.node} />
          <text x={COL_X[1] + NODE_W + 10} y={(g.y0 + g.y1) / 2 + 4} className="fill-evergreen-900" fontSize={13} fontWeight={600}>
            {g.label} · {formatPercent(g.amount / total)}
          </text>
        </g>
      ))}

      {catNodes.map((c) => (
        <g key={c.label}>
          <rect x={COL_X[2]} y={c.y0} width={NODE_W} height={c.y1 - c.y0} rx={3} fill={c.hue.node} />
          <text x={COL_X[2] + NODE_W + 10} y={(c.y0 + c.y1) / 2 + 4} className="fill-evergreen-900" fontSize={12.5}>
            {c.emoji} {c.label}
            <tspan className="fill-evergreen-600"> · {formatCurrency(c.amount)} ({formatPercent(c.amount / total)})</tspan>
          </text>
        </g>
      ))}
    </svg>
  );
}
