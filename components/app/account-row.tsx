import { InstitutionLogo } from "@/components/app/category-icon";
import { Sparkline } from "@/components/app/sparkline";
import { accountSeries } from "@/lib/account-series";
import { formatCurrency } from "@/lib/utils";
import type { Account, AccountType } from "@/lib/mock-data";

const typeLabel: Record<AccountType, string> = {
  checking: "Checking",
  savings: "Savings",
  credit: "Credit Card",
  investment: "Investment",
  property: "Real Estate",
  loan: "Loan",
};

export function AccountRow({
  account: a,
  highlight = false,
}: {
  account: Account;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between px-5 py-4 transition-colors hover:bg-cream-50 ${
        highlight ? "bg-brand-50/50" : ""
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <InstitutionLogo institution={a.institution} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-evergreen-900">{a.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {a.institution} · {typeLabel[a.type]} ••{a.mask}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-4 pl-3">
        <div className="hidden sm:block">
          <Sparkline
            data={accountSeries(a.id, a.balance)}
            color={a.balance < 0 ? "#9aa39c" : "#33745c"}
          />
        </div>
        <span className={`text-sm font-semibold tabular-nums ${a.balance < 0 ? "text-destructive" : "text-evergreen-900"}`}>
          {formatCurrency(a.balance)}
        </span>
      </div>
    </div>
  );
}
