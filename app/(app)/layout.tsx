import type { Metadata } from "next";
import { AppSidebar } from "@/components/app/app-sidebar";
import { AppTopbar } from "@/components/app/app-topbar";

// Private, data-bearing screens — keep them out of search indexes.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-cream-100">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
