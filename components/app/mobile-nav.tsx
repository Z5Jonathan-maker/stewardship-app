"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Drawer, DrawerClose } from "@/components/ui/drawer";
import { appNav } from "@/components/app/nav-items";
import { cn } from "@/lib/utils";

/**
 * Mobile/tablet navigation (shown < lg): a hamburger that opens an
 * accessible Drawer with the same links as the desktop sidebar.
 */
export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <Drawer
        side="left"
        title="Navigation"
        trigger={
          <button
            type="button"
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-full text-evergreen-800 hover:bg-muted"
          >
            <Menu className="h-5 w-5" />
          </button>
        }
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Logo />
          <DrawerClose asChild>
            <button
              type="button"
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center rounded-full text-evergreen-800 hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>
          </DrawerClose>
        </div>

        <nav aria-label="Primary" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {appNav.map((item) => {
            const active = pathname === item.href;
            return (
              <DrawerClose asChild key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-brand-50 font-semibold text-brand-700"
                      : "text-evergreen-700 hover:bg-cream-200 hover:text-evergreen-900"
                  )}
                >
                  <item.icon className="h-[18px] w-[18px]" />
                  {item.label}
                </Link>
              </DrawerClose>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <DrawerClose asChild>
            <Link
              href="/"
              className="text-sm font-medium text-evergreen-700 hover:text-evergreen-900"
            >
              ← Back to website
            </Link>
          </DrawerClose>
        </div>
      </Drawer>
    </div>
  );
}
