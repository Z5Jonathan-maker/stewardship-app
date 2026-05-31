"use client";

import { useState } from "react";
import { Plus, Search, ShieldCheck, Loader2, Check } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { InstitutionLogo } from "@/components/app/category-icon";

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

export function ConnectAccountButton({
  label = "Add account",
  variant = "outline",
  className,
}: {
  label?: string;
  variant?: ButtonProps["variant"];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connected, setConnected] = useState<string | null>(null);

  const filtered = INSTITUTIONS.filter((i) =>
    i.toLowerCase().includes(query.toLowerCase())
  );

  function connect(name: string) {
    setConnecting(name);
    setTimeout(() => {
      setConnecting(null);
      setConnected(name);
    }, 1100);
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
              {connected} connected
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              In the live app, your accounts sync via Plaid within seconds.
            </p>
            <Button className="mt-5" onClick={() => onOpenChange(false)}>Done</Button>
          </div>
        ) : (
          <>
            <div className="relative mb-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search institutions"
                placeholder="Search 13,000+ institutions"
                className="h-11 w-full rounded-xl border border-input bg-card pl-10 pr-4 text-sm text-evergreen-900 shadow-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
              />
            </div>
            <div className="max-h-72 space-y-1 overflow-y-auto">
              {filtered.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => connect(name)}
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
              Read-only, bank-level encryption. Unite can never move your money.
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
