import type { Metadata } from "next";
import { AppSidebar } from "@/components/app/app-sidebar";
import { AppTopbar } from "@/components/app/app-topbar";
import { HouseholdProvider } from "@/components/app/household-store";
import { PageTransition } from "@/components/app/page-transition";
import { ThemeProvider } from "@/components/app/theme-provider";
import { ensureHousehold } from "@/lib/auth";

// Private, data-bearing screens — keep them out of search indexes.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // First-sign-in provisioning: creates the user + household once, on first
  // authenticated visit. No-op without Clerk + a database (demo flow).
  await ensureHousehold();

  return (
    <HouseholdProvider>
      <ThemeProvider>
        <div className="flex min-h-screen bg-cream-100">
          <AppSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <AppTopbar />
            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
              <PageTransition>{children}</PageTransition>
            </main>
          </div>
        </div>
      </ThemeProvider>
    </HouseholdProvider>
  );
}
