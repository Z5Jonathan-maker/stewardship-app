"use client";

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Bell } from "lucide-react";
import { CategoryIcon } from "@/components/app/category-icon";

interface Note {
  id: string;
  category: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
}

const SEED: Note[] = [
  { id: "n1", category: "Shopping", title: "Over budget: Shopping", desc: "You're $125 over your $300 limit this month.", time: "2h", unread: true },
  { id: "n2", category: "Groceries", title: "Large transaction", desc: "Costco — $211.76 posted to Sapphire Card.", time: "5h", unread: true },
  { id: "n3", category: "Tithe & Offering", title: "Giving reminder", desc: "You're $186 from a full tithe this month.", time: "1d", unread: true },
  { id: "n4", category: "Paycheck", title: "Weekly summary ready", desc: "You saved $1,300 and gave 9.5% last week.", time: "2d", unread: false },
];

export function Notifications() {
  const [items, setItems] = useState<Note[]>(SEED);
  const unread = items.filter((i) => i.unread).length;

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-evergreen-700 transition-colors hover:bg-muted"
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute right-2 top-1.5 h-2 w-2 rounded-full bg-brand-500 ring-2 ring-card" />
          )}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={10}
          className="z-50 w-[min(20rem,calc(100vw-1.5rem))] rounded-2xl border border-border bg-card p-2 shadow-lift focus:outline-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in data-[state=closed]:fade-out data-[state=open]:zoom-in-95"
        >
          <div className="flex items-center justify-between px-2 py-1.5">
            <p className="text-sm font-semibold text-evergreen-900">Notifications</p>
            {unread > 0 && (
              <button
                type="button"
                onClick={() => setItems((s) => s.map((i) => ({ ...i, unread: false })))}
                className="text-xs font-medium text-brand-600 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-88 overflow-y-auto">
            {items.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => setItems((s) => s.map((i) => (i.id === n.id ? { ...i, unread: false } : i)))}
                className="flex w-full gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-muted"
              >
                <CategoryIcon category={n.category} className="h-9 w-9 rounded-lg" iconClassName="h-4 w-4" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-evergreen-900">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.desc}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-[11px] text-muted-foreground">{n.time}</span>
                  {n.unread && <span className="h-2 w-2 rounded-full bg-brand-500" />}
                </div>
              </button>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
