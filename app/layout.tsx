import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { AuthProvider } from "@/components/auth/auth-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "UniFi — Faithful stewardship of every dollar",
    template: "%s · UniFi",
  },
  description:
    "UniFi is a Christ-centered money app: budgeting, cash flow, goals, and generous giving, all in one calm, clear place. Steward what you've been given.",
  metadataBase: new URL("https://unifi.finance"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
