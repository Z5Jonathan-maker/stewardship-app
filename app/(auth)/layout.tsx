import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Form side */}
      <div className="flex flex-col bg-cream-50 px-6 py-8">
        <header>
          <Link href="/" aria-label="UniFi home">
            <Logo />
          </Link>
        </header>
        <main className="flex flex-1 items-center justify-center py-12">
          {children}
        </main>
      </div>

      {/* Brand side */}
      <aside className="relative hidden overflow-hidden bg-evergreen-900 lg:block">
        <div className="absolute inset-0 bg-grid opacity-[0.08]" aria-hidden />
        <div className="relative flex h-full flex-col justify-center px-16 text-cream-50">
          <blockquote className="font-display text-3xl font-medium leading-relaxed tracking-tight text-balance">
            “Whoever can be trusted with very little can also be trusted with
            much.”
          </blockquote>
          <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-brand-300">
            Luke 16:10
          </p>
          <p className="mt-8 max-w-md text-cream-100/80">
            UniFi is your home base for faithful money management — budgeting,
            giving, goals, and cash flow, all in one calm place.
          </p>
        </div>
      </aside>
    </div>
  );
}
