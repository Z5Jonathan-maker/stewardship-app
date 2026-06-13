import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AuthCardProps {
  title: string;
  subtitle: string;
  submitLabel: string;
  withName?: boolean;
  footer: React.ReactNode;
}

/**
 * Static auth form for the demo. The submit button drops you into the
 * dashboard — real auth wires in later without changing the layout.
 */
export function AuthCard({
  title,
  subtitle,
  submitLabel,
  withName = false,
  footer,
}: AuthCardProps) {
  return (
    <div className="w-full max-w-md">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-evergreen-900">
        {title}
      </h1>
      <p className="mt-2 text-evergreen-700">{subtitle}</p>

      <div className="mt-8 space-y-4">
        {withName && <Field label="Full name" type="text" placeholder="Jonathan Carter" />}
        <Field label="Email" type="email" placeholder="you@example.com" />
        <Field label="Password" type="password" placeholder="••••••••" />
      </div>

      <Button asChild size="lg" className="mt-6 w-full">
        <Link href="/dashboard">{submitLabel}</Link>
      </Button>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        This is a demo — no real account is created.
      </p>

      <p className="mt-6 text-center text-sm text-evergreen-700">{footer}</p>
    </div>
  );
}

function Field({
  label,
  type,
  placeholder,
}: {
  label: string;
  type: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-evergreen-800">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-input bg-card px-4 text-sm text-evergreen-900 shadow-xs outline-hidden transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
      />
    </label>
  );
}
