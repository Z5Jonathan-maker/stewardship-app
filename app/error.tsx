"use client";

import { useEffect } from "react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production this is where we'd report to an error service.
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream-50 px-6 text-center">
      <Logo />
      <h1 className="mt-10 font-display text-2xl font-semibold text-evergreen-900">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-evergreen-700">
        We hit an unexpected snag. Your data is safe — please try again.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button asChild variant="outline">
          <a href="/dashboard">Go to dashboard</a>
        </Button>
      </div>
    </main>
  );
}
