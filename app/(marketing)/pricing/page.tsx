import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, honest pricing for faithful money management.",
};

const tiers = [
  {
    name: "Free Trial",
    price: "$0",
    cadence: "for 30 days",
    description: "Experience all of Unite, no card required.",
    cta: "Start free",
    href: "/signup",
    featured: false,
    features: [
      "Connect up to 3 accounts",
      "Budgets & cash flow",
      "1 savings goal",
      "Verse of the day",
    ],
  },
  {
    name: "Steward",
    price: "$8",
    cadence: "/ month, billed yearly",
    description: "Everything a household needs to thrive.",
    cta: "Get Steward",
    href: "/signup",
    featured: true,
    features: [
      "Unlimited accounts & institutions",
      "Flex & category budgeting",
      "Forward-looking cash flow",
      "Unlimited goals & giving tracker",
      "Ask Unite assistant",
      "Invite your spouse free",
    ],
  },
  {
    name: "Generous",
    price: "$14",
    cadence: "/ month, billed yearly",
    description: "For those who steward more — and give more.",
    cta: "Get Generous",
    href: "/signup",
    featured: false,
    features: [
      "Everything in Steward",
      "Advanced giving & tax reports",
      "Multi-household & ministry view",
      "Priority support",
      "Early access to new features",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="bg-cream-50">
      <section className="container py-16 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="brand" className="mb-4">Simple & honest</Badge>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-evergreen-900 text-balance sm:text-5xl">
            Pricing that respects your budget
          </h1>
          <p className="mt-5 text-lg text-evergreen-700 text-pretty">
            One subscription for your whole household. No ads, no selling your
            data, no surprises. Cancel anytime.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-2xl border p-8 shadow-soft ${
                tier.featured
                  ? "border-brand-500 bg-card ring-1 ring-brand-500"
                  : "border-border bg-card"
              }`}
            >
              {tier.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </span>
              )}
              <h2 className="font-display text-xl font-semibold text-evergreen-900">
                {tier.name}
              </h2>
              <p className="mt-2 text-sm text-evergreen-700">{tier.description}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-display text-4xl font-semibold text-evergreen-900">
                  {tier.price}
                </span>
                <span className="text-sm text-muted-foreground">{tier.cadence}</span>
              </div>
              <Button
                asChild
                variant={tier.featured ? "primary" : "outline"}
                className="mt-6 w-full"
              >
                <Link href={tier.href}>{tier.cta}</Link>
              </Button>
              <ul className="mt-8 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-evergreen-800">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-sm text-muted-foreground">
          “Honor the Lord with your wealth, with the firstfruits of all your
          crops.” — Proverbs 3:9
        </p>
      </section>
    </div>
  );
}
