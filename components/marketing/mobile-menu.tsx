"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose } from "@/components/ui/drawer";

interface MobileMenuProps {
  links: { label: string; href: string }[];
}

/** Marketing-site hamburger menu (shown < md), built on the accessible Drawer. */
export function MobileMenu({ links }: MobileMenuProps) {
  return (
    <div className="md:hidden">
      <Drawer
        side="left"
        title="Menu"
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

        <nav aria-label="Primary" className="flex flex-1 flex-col gap-1 px-3 py-4">
          {links.map((link) => (
            <DrawerClose asChild key={link.label}>
              <Link
                href={link.href}
                className="rounded-xl px-3 py-3 text-sm font-medium text-evergreen-800 hover:bg-cream-200"
              >
                {link.label}
              </Link>
            </DrawerClose>
          ))}
        </nav>

        <div className="space-y-2 border-t border-border p-4">
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild className="w-full">
            <Link href="/signup">Start free</Link>
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
