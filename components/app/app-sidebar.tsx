"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { appNav } from "@/components/app/nav-items";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-cream-50 lg:flex">
      <div className="flex h-16 items-center px-6">
        <Link href="/dashboard" aria-label="Unite home">
          <Logo />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {appNav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-50 font-semibold text-brand-700"
                  : "text-evergreen-700 hover:bg-cream-200 hover:text-evergreen-900"
              )}
            >
              <item.icon className="h-[18px] w-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-xl border border-border bg-card p-4">
        <p className="text-xs font-semibold text-evergreen-900">Free trial</p>
        <p className="mt-1 text-xs text-muted-foreground">
          22 days left. Upgrade to keep stewarding well.
        </p>
        <Link
          href="/pricing"
          className="mt-3 inline-block text-xs font-semibold text-brand-600 hover:underline"
        >
          See plans →
        </Link>
      </div>
    </aside>
  );
}
