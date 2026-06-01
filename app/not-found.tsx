import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream-50 px-6 text-center">
      <Logo />
      <p className="mt-10 font-display text-6xl font-semibold text-evergreen-900">404</p>
      <h1 className="mt-3 font-display text-2xl font-semibold text-evergreen-900">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-3 max-w-md text-evergreen-700">
        The link may be broken or the page may have moved. Let&apos;s get you
        back on solid ground.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
      <p className="mt-10 text-sm italic text-muted-foreground">
        “Your word is a lamp to my feet and a light to my path.” — Psalm 119:105
      </p>
    </main>
  );
}
