import Link from "next/link";
import { Search, Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { MobileNav } from "@/components/app/mobile-nav";
import { ThemeToggle } from "@/components/app/theme-provider";
import { household } from "@/lib/mock-data";

export function AppTopbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-cream-50/80 px-4 backdrop-blur-md sm:gap-4 sm:px-6">
      {/* Mobile: hamburger + logo (the sidebar is hidden < lg) */}
      <MobileNav />
      <Link href="/dashboard" aria-label="Unite home" className="lg:hidden">
        <Logo markOnly />
      </Link>

      <div className="relative hidden flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          aria-label="Search"
          placeholder="Search transactions, accounts, goals…"
          className="h-10 w-full max-w-md rounded-full border border-border bg-card pl-10 pr-4 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
        />
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none">
        <Button asChild variant="outline" size="sm">
          <Link href="/accounts">
            <Plus className="h-4 w-4" /> Add account
          </Link>
        </Button>
        <ThemeToggle />
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-evergreen-700 text-sm font-semibold text-cream-50">
          {household.members[0][0]}
        </div>
      </div>
    </header>
  );
}
