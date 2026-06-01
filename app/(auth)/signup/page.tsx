import Link from "next/link";
import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { authConfigured } from "@/components/auth/auth-provider";

export const metadata: Metadata = { title: "Start free" };

export default async function SignupPage() {
  if (authConfigured()) {
    const { SignUp } = await import("@clerk/nextjs");
    return (
      <SignUp
        signInUrl="/login"
        forceRedirectUrl="/dashboard"
        appearance={{
          variables: { colorPrimary: "#3b63f0" },
          elements: { card: "shadow-none border-none bg-transparent" },
        }}
      />
    );
  }

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
