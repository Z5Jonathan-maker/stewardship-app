import Link from "next/link";
import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { authConfigured } from "@/components/auth/auth-provider";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (authConfigured()) {
    // Real Clerk sign-in, brand-styled. The (app) layout provisions the
    // household via ensureHousehold() after sign-in.
    const { SignIn } = await import("@clerk/nextjs");
    return (
      <SignIn
        signUpUrl="/signup"
        forceRedirectUrl="/dashboard"
        appearance={{
          variables: { colorPrimary: "#3b63f0" },
          elements: { card: "shadow-none border-none bg-transparent" },
        }}
      />
    );
  }

  // Demo fallback (no Clerk keys): the static form drops into the dashboard.
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to keep stewarding well."
      submitLabel="Sign in"
      footer={
        <>
          New to Unite?{" "}
          <Link href="/signup" className="font-semibold text-brand-600 hover:underline">
            Create an account
          </Link>
        </>
      }
    />
  );
}
