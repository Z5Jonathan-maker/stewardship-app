"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Search, CornerDownLeft } from "lucide-react";
import { appNav } from "@/components/app/nav-items";
import { CategoryIcon, InstitutionLogo } from "@/components/app/category-icon";
import { transactions, accounts, goals } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

interface Result {
  id: string;
  label: string;
  sub?: string;
  href: string;
  node: React.ReactNode; // leading visual
}

function buildGroups(query: string): { label: string; items: Result[] }[] {
  const q = query.trim().toLowerCase();
  const match = (s: string) => s.toLowerCase().includes(q);

  const pages = appNav
    .filter((n) => !q || match(n.label))
    .map<Result>((n) => ({
      id: `page-${n.href}`,
      label: n.label,
      href: n.href,
      node: (
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-evergreen-700">
          <n.icon className="h-[18px] w-[18px]" />
        </span>
      ),
    }));

  const txns = q
    ? transactions
        .filter((t) => match(t.merchant) || match(t.category))
        .slice(0, 5)
        .map<Result>((t) => ({
          id: `txn-${t.id}`,
          label: t.merchant,
          sub: `${t.category} · ${formatCurrency(t.amount, { signed: true })}`,
          href: "/transactions",
          node: <CategoryIcon category={t.category} className="h-9 w-9 rounded-lg" iconClassName="h-4 w-4" />,
        }))
    : [];

  const accts = q
    ? accounts
        .filter((a) => match(a.name) || match(a.institution))
        .slice(0, 5)
        .map<Result>((a) => ({
          id: `acct-${a.id}`,
          label: a.name,
          sub: `${a.institution} · ${formatCurrency(a.balance)}`,
          href: "/accounts",
          node: <InstitutionLogo institution={a.institution} className="h-9 w-9 rounded-lg text-[10px]" />,
        }))
    : [];

  const gls = q
    ? goals
        .filter((g) => match(g.name))
        .slice(0, 4)
        .map<Result>((g) => ({
          id: `goal-${g.id}`,
          label: g.name,
          sub: `${formatCurrency(g.saved)} of ${formatCurrency(g.target)}`,
          href: "/goals",
          node: <CategoryIcon category={g.name} className="h-9 w-9 rounded-lg" iconClassName="h-4 w-4" />,
        }))
    : [];

  return [
    { label: q ? "Pages" : "Jump to", items: pages },
    { label: "Transactions", items: txns },
    { label: "Accounts", items: accts },
    { label: "Goals", items: gls },
  ].filter((g) => g.items.length > 0);
}

export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const groups = useMemo(() => buildGroups(query), [query]);
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  useEffect(() => setActive(0), [query]);
  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  // ⌘K / Ctrl-K to open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const select = useCallback(
    (r: Result | undefined) => {
      if (!r) return;
      setOpen(false);
      router.push(r.href);
    },
    [router]
  );

  function onInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      select(flat[active]);
    }
  }

  let flatIndex = -1;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="flex h-10 w-full max-w-md items-center gap-2.5 rounded-full border border-border bg-card px-4 text-sm text-muted-foreground transition hover:border-brand-300"
        >
          <Search className="h-4 w-4" />
          <span>Search transactions, accounts, goals…</span>
          <kbd className="ml-auto hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground md:inline">
            ⌘K
          </kbd>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-evergreen-900/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-[12vh] z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-card shadow-lift focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95"
        >
          <Dialog.Title className="sr-only">Search</Dialog.Title>
          <div className="flex items-center gap-3 border-b border-border px-4">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKeyDown}
              aria-label="Search"
              placeholder="Search transactions, accounts, goals…"
              className="h-12 w-full bg-transparent text-sm text-evergreen-900 outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
            {flat.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                No results for “{query}”.
              </p>
            ) : (
              groups.map((g) => (
                <div key={g.label} className="mb-1">
                  <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {g.label}
                  </p>
                  {g.items.map((r) => {
                    flatIndex += 1;
                    const idx = flatIndex;
                    const isActive = idx === active;
                    return (
                      <button
                        key={r.id}
                        onClick={() => select(r)}
                        onMouseMove={() => setActive(idx)}
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors ${
                          isActive ? "bg-brand-50" : "hover:bg-muted"
                        }`}
                      >
                        {r.node}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-evergreen-900">
                            {r.label}
                          </span>
                          {r.sub && (
                            <span className="block truncate text-xs text-muted-foreground">
                              {r.sub}
                            </span>
                          )}
                        </span>
                        {isActive && (
                          <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-brand-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
