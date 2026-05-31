import Link from "next/link";
import { Logo } from "@/components/brand/logo";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Budgeting", href: "/#features" },
      { label: "Cash Flow", href: "/#features" },
      { label: "Goals", href: "/#features" },
      { label: "Giving", href: "/#stewardship" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Mission", href: "/#stewardship" },
      { label: "For Couples", href: "/#couples" },
      { label: "Security", href: "/#security" },
      { label: "Contact", href: "/login" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", href: "/login" },
      { label: "Stewardship Blog", href: "/login" },
      { label: "Verse of the Day", href: "/login" },
      { label: "Status", href: "/login" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-evergreen-900 text-cream-100">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo tone="inverted" />
            <p className="mt-4 text-sm leading-relaxed text-cream-100/70">
              Faithful stewardship of every dollar. Unite brings your whole
              financial life into one calm, clear place — so you can give,
              save, and live with purpose.
            </p>
            <p className="mt-6 text-xs text-cream-100/50">
              © {new Date().getFullYear()} Unite Financial LLC. All rights reserved.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-cream-50">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream-100/70 transition-colors hover:text-brand-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-cream-100/10 pt-8 text-xs text-cream-100/50 sm:flex-row sm:items-center sm:justify-between">
          <p className="italic">
            “The earth is the Lord’s, and everything in it.” — Psalm 24:1
          </p>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-cream-50">Privacy</Link>
            <Link href="/login" className="hover:text-cream-50">Terms</Link>
            <Link href="/login" className="hover:text-cream-50">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
