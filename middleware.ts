import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

/**
 * Auth middleware with graceful degradation. When Clerk is configured, we
 * delegate to clerkMiddleware (imported lazily so the dependency isn't required
 * pre-config). When it isn't, this is a pass-through and the app uses the demo
 * auth flow — identical to how the assistant/Plaid/data layers degrade.
 */
const clerkConfigured = Boolean(
  process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
);

type ClerkMw = (
  req: NextRequest,
  evt: NextFetchEvent
) => Response | Promise<Response>;

let clerkHandler: ClerkMw | null = null;

export default async function middleware(req: NextRequest, evt: NextFetchEvent) {
  if (!clerkConfigured) return NextResponse.next();

  if (!clerkHandler) {
    const { clerkMiddleware } = await import("@clerk/nextjs/server");
    // No routes force-protected here — components decide via
    // getCurrentHouseholdId(); keeps marketing/auth pages public.
    clerkHandler = clerkMiddleware() as unknown as ClerkMw;
  }
  return clerkHandler(req, evt);
}

export const config = {
  // Run on app routes but skip static assets and Next internals.
  matcher: ["/((?!_next|.*\\..*).*)"],
};
