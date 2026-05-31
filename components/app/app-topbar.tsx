import Link from "next/link";
import { Bell, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { MobileNav } from "@/components/app/mobile-nav";
import { CommandMenu } from "@/components/app/command-menu";
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

      <div className="hidden flex-1 sm:block">
        <CommandMenu />
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
