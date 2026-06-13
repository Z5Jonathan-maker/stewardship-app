"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Plus, Search, ShieldCheck, Loader2, Check } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { InstitutionLogo } from "@/components/app/category-icon";
import { useHousehold } from "@/components/app/household-store";
import type { Account, AccountType } from "@/lib/mock-data";

// Loaded only when a Plaid link token exists, so react-plaid-link's hosted
// script never loads on the keyless demo path.
const PlaidLinkButton = dynamic(
  () => import("./plaid-link-button").then((m) => m.PlaidLinkButton),
  { ssr: false }
);

const INSTITUTIONS = [
  "Chase",
  "Bank of America",
  "Wells Fargo",
  "Fidelity",
  "Vanguard",
  "Schwab",
  "Ally",
  "Capital One",
  "Citi",
  "American Express",
  "SoFi",
  "Rocket",
];

// Representative accounts the mock flow "connects" per institution, so the
// keyless demo still does something real (accounts appear + persist).
function mockAccountsFor(name: string): Account[] {
  const rid = Math.random().toString(36).slice(2, 8);
  const mk = (n: string, type: AccountType, balance: number, mask: string): Account => ({
    id: `mock_${rid}_${mask}`,
    name: n,
    institution: name,
    type,
    mask,
    balance,
  });
  const brokerages = ["Fidelity", "Vanguard", "Schwab"];
  if (brokerages.includes(name)) return [mk(`${name} Brokerage`, "investment", 18450.32, "7781")];
  if (name === "Capital One") return [mk("Quicksilver Card", "credit", -742.19, "4410")];
  if (name === "American Express") return [mk("Amex Platinum", "credit", -1280.5, "2007")];
  return [
    mk(`${name} Checking`, "checking", 3120.44, "1190"),
    mk(`${name} Savings`, "savings", 9875.0, "5520"),
  ];
}

export function ConnectAccountButton({
  label = "Add account",
  variant = "outline",
  className,
}: {
  label?: string;
  variant?: ButtonProps["variant"];
  className?: string;
}) {
  const { addAccounts } = useHousehold();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connected, setConnected] = useState<{ label: string; count: number } | null>(null);
  const [linkToken, setLinkToken] = useState<string | null>(null);

  // Probe for Plaid when the dialog opens; 503 (no keys) keeps us on the mock.
  useEffect(() => {
    if (!open || linkToken) return;
    let cancelled = false;
    fetch("/api/plaid/create-link-token", { method: "POST" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d?.link_token) setLinkToken(d.link_token);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [open, linkToken]);

  const filtered = INSTITUTIONS.filter((i) =>
    i.toLowerCase().includes(query.toLowerCase())
  );

  function connectMock(name: string) {
    setConnecting(name);
    setTimeout(() => {
      const accts = mockAccountsFor(name);
      addAccounts(accts);
      setConnecting(null);
      setConnected({ label: name, count: accts.length });
    }, 1000);
  }

  function onPlaidAccounts(accounts: Account[]) {
    addAccounts(accounts);
    setConnected({ label: "Your bank", count: accounts.length });
  }

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setQuery("");
      setConnecting(null);
      setConnected(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant={variant} size="sm" className={className}>
          <Plus className="h-4 w-4" /> {label}
        </Button>
      </DialogTrigger>
      <DialogContent
        title="Connect an account"
        description="Securely link a bank or brokerage."
      >
        {connected ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-evergreen-50 text-evergreen-600">
              <Check className="h-6 w-6" />
            </div>
            <p className="mt-3 font-display text-lg font-semibold text-evergreen-900">
              {connected.label} connected
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {connected.count} {connected.count === 1 ? "account" : "accounts"} added — view them on the Accounts page.
            </p>
            <Button className="mt-5" onClick={() => onOpenChange(false)}>Done</Button>
          </div>
        ) : (
          <>
            {linkToken && (
              <div className="mb-3">
                <PlaidLinkButton token={linkToken} onAccounts={onPlaidAccounts} />
                <div className="my-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="h-px flex-1 bg-border" />
                  or pick an institution
                  <span className="h-px flex-1 bg-border" />
                </div>
              </div>
            )}
            <div className="relative mb-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search institutions"
                placeholder="Search 13,000+ institutions"
                className="h-11 w-full rounded-xl border border-input bg-card pl-10 pr-4 text-sm text-evergreen-900 shadow-xs outline-hidden transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
              />
            </div>
            <div className="max-h-72 space-y-1 overflow-y-auto">
              {filtered.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => connectMock(name)}
                  disabled={!!connecting}
                  className="flex w-full items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-muted disabled:opacity-60"
                >
                  <InstitutionLogo institution={name} className="h-9 w-9 rounded-lg text-[10px]" />
                  <span className="flex-1 text-left text-sm font-medium text-evergreen-900">
                    {name}
                  </span>
                  {connecting === name ? (
                    <Loader2 className="h-4 w-4 animate-spin text-brand-500" />
                  ) : (
                    <span className="text-xs font-medium text-brand-600">Connect</span>
                  )}
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                  No institution matches “{query}”.
                </p>
              )}
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-brand-500" />
              Read-only, bank-level encryption. UniFi can never move your money.
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
