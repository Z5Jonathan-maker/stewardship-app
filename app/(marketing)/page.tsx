import Link from "next/link";
import {
  Wallet,
  PieChart,
  HandHeart,
  Target,
  Sparkles,
  ShieldCheck,
  Users,
  LineChart,
  CheckCircle2,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AppMockup } from "@/components/marketing/app-mockup";
import { FeaturePreview } from "@/components/marketing/feature-preview";
import { Reveal } from "@/components/marketing/reveal";
import { InstitutionLogo } from "@/components/app/category-icon";
import { formatCurrency } from "@/lib/utils";
import { givingYtd, debtPaidYtd } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Reveal>
        <Pillars />
      </Reveal>
      <Reveal>
        <FeatureDeepDives />
      </Reveal>
      <Reveal>
        <Institutions />
      </Reveal>
      <Reveal>
        <Stewardship />
      </Reveal>
      <Reveal>
        <Couples />
      </Reveal>
      <Reveal>
        <Testimonials />
      </Reveal>
      <Reveal>
        <Security />
      </Reveal>
      <Reveal>
        <FinalCta />
      </Reveal>
    </>
  );
}

/* ------------------------------------------------------------------ Hero */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-60" aria-hidden />
      <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-gradient-to-b from-brand-50/70 to-transparent" aria-hidden />
      <div className="container relative grid gap-12 py-16 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:py-24">
        <div className="animate-fade-up">
          <Badge variant="brand" className="mb-5">
            <Sparkles className="h-3 w-3" /> Faith-centered money, beautifully simple
          </Badge>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-evergreen-900 text-balance sm:text-5xl lg:text-6xl">
            The faithful way to manage your money.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-evergreen-700 text-pretty">
            Unite brings every account, budget, and goal into one calm, clear
            place — so you can give generously, save with purpose, and steward
            well what you&apos;ve been entrusted with.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/signup">Start your 30 days free</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard">See a live demo</Link>
            </Button>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-evergreen-700">
            {["No card required", "Private — never sold", "Cancel anytime"].map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-brand-500" /> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="animate-fade-up [animation-delay:120ms]">
          <AppMockup />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- TrustBar */

function TrustBar() {
  const stats = [
    { value: "1 place", label: "Your whole financial life" },
    { value: "Tithe-first", label: "Giving built into the budget" },
    { value: "$0 / ads", label: "We never sell your data" },
    { value: "100%", label: "Of it belongs to Him" },
  ];
  return (
    <section className="border-y border-border bg-cream-100">
      <div className="container grid grid-cols-2 gap-8 py-10 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-display text-3xl font-semibold text-evergreen-900">
              {s.value}
            </p>
            <p className="mt-1 text-sm text-evergreen-700">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Pillars */

const pillars = [
  {
    icon: Wallet,
    title: "Track",
    body: "Securely connect every account — checking, cards, loans, and investments — for one true picture of your net worth.",
  },
  {
    icon: PieChart,
    title: "Budget",
    body: "Flexible or category budgets that fit your life. Tithe-first by design, with progress you can see at a glance.",
  },
  {
    icon: HandHeart,
    title: "Give",
    body: "Set giving goals, track your tithe and offerings, and watch generosity become a joyful habit, not an afterthought.",
  },
  {
    icon: Target,
    title: "Plan",
    body: "Forward-looking cash flow and goals show not just what you spent — but what you'll have left and where you're headed.",
  },
];

function Pillars() {
  return (
    <section id="features" className="container py-20 lg:py-28">
      <SectionHeading
        eyebrow="Everything in one place"
        title="Your home base for money clarity"
        subtitle="Four simple disciplines, woven together. Unite makes faithful money management feel calm instead of complicated."
      />
      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {pillars.map((p) => (
          <div
            key={p.title}
            className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white">
              <p.icon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-display text-xl font-semibold text-evergreen-900">
              {p.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-evergreen-700">
              {p.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------- FeatureDeepDives */

const deepDives = [
  {
    badge: "Budgeting",
    icon: PieChart,
    title: "A budget that puts first things first",
    body: "Start with the tithe, cover what's fixed, then give the rest a job. Flex and category modes, custom groups, and gentle nudges keep you on plan without the guilt.",
    points: ["Tithe-first templates", "Flex & category budgeting", "Rollover & alerts"],
  },
  {
    badge: "Cash Flow",
    icon: LineChart,
    title: "Know what you'll have left — before you spend it",
    body: "Most apps stop at \"here's what you spent.\" Unite projects your balance forward from upcoming income and bills, so there are no surprises at month's end.",
    points: ["Forward-looking projections", "Recurring bill detection", "Month-in-review recap"],
    reverse: true,
  },
  {
    badge: "Goals",
    icon: Target,
    title: "Save for what matters — including a missions trip",
    body: "Track an emergency fund, a debt payoff, a generosity fund, or that family trip, all at once. Visual progress makes saving feel tangible and motivating.",
    points: ["Multiple goals at once", "Auto-progress as you sync", "Debt-free milestones"],
  },
  {
    badge: "Ask Unite",
    icon: Sparkles,
    title: "Ask a question, get a faithful answer",
    body: "\"How much did we give this year?\" \"Can we afford the trip?\" The built-in assistant answers from your real numbers — clear guidance grounded in stewardship.",
    points: ["Plain-English answers", "Grounded in your data", "Private & secure"],
    reverse: true,
  },
];

function FeatureDeepDives() {
  return (
    <section className="bg-cream-100 py-20 lg:py-28">
      <div className="container space-y-20 lg:space-y-28">
        {deepDives.map((d) => (
          <div
            key={d.badge}
            className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
          >
            <div className={d.reverse ? "lg:order-2" : ""}>
              <Badge variant="brand">
                <d.icon className="h-3 w-3" /> {d.badge}
              </Badge>
              <h3 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-evergreen-900 text-balance">
                {d.title}
              </h3>
              <p className="mt-4 text-lg leading-relaxed text-evergreen-700 text-pretty">
                {d.body}
              </p>
              <ul className="mt-6 space-y-3">
                {d.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-3 text-evergreen-800">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-500" />
                    <span className="font-medium">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={d.reverse ? "lg:order-1" : ""}>
              <FeaturePreview badge={d.badge} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


/* ----------------------------------------------------------- Stewardship */

function Stewardship() {
  return (
    <section id="stewardship" className="relative overflow-hidden bg-evergreen-900 py-20 text-cream-50 lg:py-28">
      <div className="absolute inset-0 bg-grid opacity-[0.07]" aria-hidden />
      <div className="container relative max-w-3xl text-center">
        <Quote className="mx-auto h-10 w-10 text-brand-400" />
        <blockquote className="mt-6 font-display text-2xl font-medium leading-relaxed tracking-tight text-balance sm:text-3xl">
          “Each of you should use whatever gift you have received to serve
          others, as faithful stewards of God&apos;s grace in its various
          forms.”
        </blockquote>
        <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-brand-300">
          1 Peter 4:10
        </p>
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-cream-100/80 text-pretty">
          Money is a tool, not a master. Unite is built on a simple conviction:
          everything we have is a gift to be managed well. That&apos;s why
          giving comes first, debt has a finish line, and every feature is
          designed to bring peace — not pressure — to your financial life.
        </p>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Couples */

function Couples() {
  return (
    <section id="couples" className="container py-20 lg:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <Badge variant="brand">
            <Users className="h-3 w-3" /> Built for households
          </Badge>
          <h3 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-evergreen-900 text-balance">
            Manage money together, on the same page
          </h3>
          <p className="mt-4 text-lg leading-relaxed text-evergreen-700 text-pretty">
            Invite your spouse at no extra cost. Shared budgets, shared goals,
            shared clarity — so money becomes a place of unity instead of
            tension. Two people, one plan.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {["Shared dashboard", "Private notes", "Joint goals", "Real-time sync"].map((t) => (
              <span key={t} className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-evergreen-800">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-gradient-to-br from-brand-50 to-cream-50 p-8 shadow-soft">
          <div className="flex -space-x-3">
            {["J", "G"].map((i) => (
              <div key={i} className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-card bg-evergreen-700 font-display text-lg font-semibold text-cream-50">
                {i}
              </div>
            ))}
          </div>
          <p className="mt-5 font-display text-xl font-semibold text-evergreen-900">
            Jonathan &amp; Grace
          </p>
          <p className="text-sm text-evergreen-700">Stewarding together since 2024</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <MiniStat label="Given this year" value={formatCurrency(givingYtd, { compact: true })} />
            <MiniStat label="Debt paid off" value={formatCurrency(debtPaidYtd, { compact: true })} />
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="font-display text-xl font-semibold text-evergreen-900">{value}</p>
      <p className="text-xs text-evergreen-700">{label}</p>
    </div>
  );
}

/* ---------------------------------------------------------- Institutions */

const INSTITUTIONS = [
  "Chase",
  "Bank of America",
  "Wells Fargo",
  "Fidelity",
  "Vanguard",
  "Schwab",
  "Ally",
  "Capital One",
  "Citi",
  "American Express",
  "SoFi",
  "Rocket",
];

function Institutions() {
  return (
    <section className="border-y border-border bg-card">
      <div className="container py-14 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
          Connects securely to your accounts
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-evergreen-900 sm:text-3xl">
          Works with 13,000+ banks and brokerages
        </h2>
        <div className="mx-auto mt-9 flex max-w-4xl flex-wrap items-center justify-center gap-3">
          {INSTITUTIONS.map((name) => (
            <div
              key={name}
              className="flex items-center gap-2.5 rounded-xl border border-border bg-cream-50 px-4 py-2.5"
            >
              <InstitutionLogo institution={name} className="h-8 w-8 rounded-lg text-[10px]" />
              <span className="text-sm font-medium text-evergreen-800">{name}</span>
            </div>
          ))}
        </div>
        <p className="mt-7 text-sm text-evergreen-700">
          Read-only, bank-level encryption. Unite can never move your money.
        </p>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- Testimonials */

const TESTIMONIALS = [
  {
    quote:
      "We finally give generously without the anxiety. Putting the tithe first changed how we see every dollar.",
    name: "Marcus & Tola A.",
    role: "Married 6 years",
  },
  {
    quote:
      "The debt-free finish line kept us going — we paid off the car almost a year early and watched our net worth climb.",
    name: "The Nguyen Family",
    role: "Two kids, one budget",
  },
  {
    quote:
      "Scripture meets our spreadsheet. It finally feels like stewardship, not just budgeting.",
    name: "Hannah R.",
    role: "Small-group leader",
  },
];

function Testimonials() {
  return (
    <section className="container py-20 lg:py-28">
      <SectionHeading
        eyebrow="Loved by households"
        title="Peace, generosity, and progress"
        subtitle="Real change looks like calmer money conversations and a fuller giving record."
      />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft">
            <Quote className="h-7 w-7 text-brand-400" />
            <p className="mt-4 flex-1 text-evergreen-800 leading-relaxed text-pretty">
              {t.quote}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-evergreen-700 text-sm font-semibold text-cream-50">
                {t.name[0]}
              </div>
              <div>
                <p className="text-sm font-semibold text-evergreen-900">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Security */

function Security() {
  const items = [
    { icon: ShieldCheck, title: "Encryption by design", body: "Your data will be encrypted in transit and at rest, and guarded like it's our own." },
    { icon: CheckCircle2, title: "Read-only by design", body: "We'll connect through trusted aggregators like Plaid — Unite is built so it can never move your money." },
    { icon: Users, title: "You stay in control", body: "Disconnect any account and delete your data whenever you choose. No lock-in, ever." },
  ];
  return (
    <section id="security" className="bg-cream-100 py-20 lg:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="Our security commitments"
          title="Built to be worthy of your trust"
          subtitle="Stewardship means protecting what's entrusted to us — including your data. Here's how we're designing Unite to earn that trust."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map((i) => (
            <div key={i.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <i.icon className="h-7 w-7 text-brand-500" />
              <h3 className="mt-4 font-display text-lg font-semibold text-evergreen-900">
                {i.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-evergreen-700">{i.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- FinalCta */

function FinalCta() {
  return (
    <section className="container py-20 lg:py-28">
      <div className="relative overflow-hidden rounded-3xl bg-evergreen-800 px-8 py-16 text-center shadow-lift sm:px-16">
        <div className="absolute inset-0 bg-grid opacity-[0.08]" aria-hidden />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-cream-50 text-balance sm:text-4xl">
            Start stewarding well today
          </h2>
          <p className="mt-4 text-lg text-cream-100/80 text-pretty">
            Join households finding peace, generosity, and progress with their
            money. Your first 30 days are on us.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/signup">Start free</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-cream-100/30 bg-transparent text-cream-50 hover:bg-cream-50/10">
              <Link href="/dashboard">Explore the demo</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- shared */

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-evergreen-900 text-balance sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-lg leading-relaxed text-evergreen-700 text-pretty">
        {subtitle}
      </p>
    </div>
  );
}
