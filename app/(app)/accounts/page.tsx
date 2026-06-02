import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/app/page-header";
import { StatTile } from "@/components/app/stat-tile";
import { AccountRow } from "@/components/app/account-row";
import { ConnectAccountButton } from "@/components/app/forms/connect-account-button";
import { AddedAccounts } from "@/components/app/added/added-accounts";
import {
  LiveNetWorth,
  LiveAssets,
  LiveLiabilities,
  LiveAccountCount,
} from "@/components/app/live-stats";
import { getHouseholdSnapshot } from "@/lib/data/selectors";
import { getCurrentHouseholdId } from "@/lib/auth";

export const metadata: Metadata = { title: "Accounts" };
// Reads per-household data (DB or mock) at request time.
export const dynamic = "force-dynamic";

export default async function AccountsPage() {
  // Reads from Postgres when configured, else the mock household (the seam).
  const householdId = await getCurrentHouseholdId();
  const { accounts } = await getHouseholdSnapshot(householdId ?? undefined);

  const assets = accounts.filter((a) => a.balance >= 0);
  const liabilities = accounts.filter((a) => a.balance < 0);
  const totalAssets = assets.reduce((s, a) => s + a.balance, 0);
  const totalLiabilities = liabilities.reduce((s, a) => s + a.balance, 0);
  const netWorth = totalAssets + totalLiabilities;

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Accounts"
        subtitle={<LiveAccountCount base={accounts.length} />}
        action={<ConnectAccountButton label="Connect account" variant="primary" />}
      />

      {/* Net worth summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Assets" value={<LiveAssets base={totalAssets} />} accent="evergreen" valueClassName="text-evergreen-700" />
        <StatTile label="Liabilities" value={<LiveLiabilities base={totalLiabilities} />} />
        <StatTile label="Net worth" value={<LiveNetWorth base={netWorth} />} accent="brand" />
      </div>

      <div className="mt-6">
        <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Assets
        </h2>
        <Card>
          <CardContent className="divide-y divide-border p-0">
            <AddedAccounts kind="asset" />
            {assets.map((a) => (
              <AccountRow key={a.id} account={a} />
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Liabilities
        </h2>
        <Card>
          <CardContent className="divide-y divide-border p-0">
            <AddedAccounts kind="liability" />
            {liabilities.map((a) => (
              <AccountRow key={a.id} account={a} />
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-border bg-cream-50 p-6 text-center">
        <p className="text-sm font-medium text-evergreen-900">Connect another account</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Unite securely links your accounts through Plaid. Connections are
          read-only — Unite never moves your money.
        </p>
        <ConnectAccountButton label="Add via secure link" variant="outline" className="mt-4" />
      </div>
    </div>
  );
}
