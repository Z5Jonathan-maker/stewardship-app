import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/page-header";
import { InstitutionLogo } from "@/components/app/category-icon";
import { formatCurrency } from "@/lib/utils";
import {
  accounts,
  assets,
  liabilities,
  totalAssets,
  totalLiabilities,
  netWorth,
  type AccountType,
} from "@/lib/mock-data";

export const metadata: Metadata = { title: "Accounts" };

const typeLabel: Record<AccountType, string> = {
  checking: "Checking",
  savings: "Savings",
  credit: "Credit Card",
  investment: "Investment",
  property: "Real Estate",
  loan: "Loan",
};

export default function AccountsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Accounts"
        subtitle={`${accounts.length} accounts connected`}
        action={
          <Button size="sm">
            <Plus className="h-4 w-4" /> Connect account
          </Button>
        }
      />

      {/* Net worth summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-evergreen-50">
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Assets</p>
            <p className="mt-1.5 font-display text-2xl font-semibold text-evergreen-700">
              {formatCurrency(totalAssets)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Liabilities</p>
            <p className="mt-1.5 font-display text-2xl font-semibold text-evergreen-900">
              {formatCurrency(totalLiabilities)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-brand-50">
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Net worth</p>
            <p className="mt-1.5 font-display text-2xl font-semibold text-evergreen-900">
              {formatCurrency(netWorth)}
            </p>
          </CardContent>
        </Card>
      </div>

      <AccountGroup title="Assets" items={assets} />
      <AccountGroup title="Liabilities" items={liabilities} />

      <div className="mt-6 rounded-2xl border border-dashed border-border bg-cream-50 p-6 text-center">
        <p className="text-sm font-medium text-evergreen-900">
          Connect another account
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Unite will securely link your accounts through Plaid. Connections are
          designed to be read-only — Unite never moves your money.
        </p>
        <Button variant="outline" size="sm" className="mt-4">
          <Plus className="h-4 w-4" /> Add via secure link
        </Button>
      </div>
    </div>
  );
}

function AccountGroup({
  title,
  items,
}: {
  title: string;
  items: typeof accounts;
}) {
  return (
    <div className="mt-6">
      <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      <Card>
        <CardContent className="divide-y divide-border p-0">
          {items.map((a) => (
            <div key={a.id} className="flex items-center justify-between px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <InstitutionLogo institution={a.institution} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-evergreen-900">{a.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {a.institution} · {typeLabel[a.type]} ••{a.mask}
                  </p>
                </div>
              </div>
              <span className={`shrink-0 pl-3 text-sm font-semibold tabular-nums ${a.balance < 0 ? "text-destructive" : "text-evergreen-900"}`}>
                {formatCurrency(a.balance)}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
