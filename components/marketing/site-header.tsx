import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "@/components/marketing/mobile-menu";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Stewardship", href: "/#stewardship" },
  { label: "For Couples", href: "/#couples" },
  { label: "Pricing", href: "/pricing" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-cream-50/80 backdrop-blur-md">
      {/* Promo bar */}
      <div className="bg-evergreen-800 text-center text-xs font-medium text-cream-100">
        <div className="container py-2">
          Steward your first 30 days free — no card required.{" "}
          <Link href="/signup" className="font-semibold text-brand-300 underline-offset-2 hover:underline">
            Get started →
          </Link>
        </div>
      </div>

      <div className="container flex h-16 items-center justify-between gap-6">
        <Link href="/" aria-label="uniFi home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-evergreen-700 transition-colors hover:text-evergreen-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm" className="hidden md:inline-flex">
            <Link href="/signup">Start free</Link>
          </Button>
          <MobileMenu links={navLinks} />
        </div>
      </div>
    </header>
  );
}
