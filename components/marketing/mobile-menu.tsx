"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  links: { label: string; href: string }[];
}

/** Marketing-site hamburger menu, shown below the md breakpoint. */
export function MobileMenu({ links }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-full text-evergreen-800 hover:bg-muted"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-50 bg-evergreen-900/40 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 max-w-[80%] flex-col bg-cream-50 shadow-lift transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Logo />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-full text-evergreen-800 hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-xl px-3 py-3 text-sm font-medium text-evergreen-800 hover:bg-cream-200"
            >
              {link.label}
            </Link>
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
      </div>
    </div>
  );
}
