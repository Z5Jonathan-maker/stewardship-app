import Link from "next/link";
import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";

export const metadata: Metadata = { title: "Start free" };

export default function SignupPage() {
  return (
    <AuthCard
      title="Start your 30 days free"
      subtitle="No card required. Steward what you've been given."
      submitLabel="Create account"
      withName
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-600 hover:underline">
            Sign in
          </Link>
        </>
      }
    />
  );
}
