import { HandHeart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateLong } from "@/lib/utils";
import type { Transaction } from "@/lib/mock-data";

export function GiftRow({ t }: { t: Transaction }) {
  return (
    <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <HandHeart className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-evergreen-900">{t.merchant}</p>
          <p className="text-xs text-muted-foreground">{formatDateLong(t.date)}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="brand">{t.category}</Badge>
        <span className="w-24 text-right text-sm font-semibold tabular-nums text-evergreen-900">
          {formatCurrency(t.amount)}
        </span>
      </div>
    </div>
  );
}
