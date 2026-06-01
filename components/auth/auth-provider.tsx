import type { ReactNode } from "react";

/**
 * Conditionally wraps the app in ClerkProvider — only when Clerk is configured.
 * Without keys, it's a pass-through so the app runs on the demo auth flow
 * (same graceful-degradation pattern as the rest of the stack). ClerkProvider
 * is imported lazily so the dependency isn't pulled in when unconfigured.
 */
export function authConfigured(): boolean {
  return Boolean(
    process.env.CLERK_SECRET_KEY &&
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  );
}

export async function AuthProvider({ children }: { children: ReactNode }) {
  if (!authConfigured()) return <>{children}</>;
  const { ClerkProvider } = await import("@clerk/nextjs");
  return <ClerkProvider>{children}</ClerkProvider>;
}
