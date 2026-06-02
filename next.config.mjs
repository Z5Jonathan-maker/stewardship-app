// Security headers. The CSP is intentionally conservative; Next's App Router
// injects inline bootstrap scripts and next/font injects inline styles, so
// 'unsafe-inline' is required until we move to nonces. No 'unsafe-eval' in prod.
//
// Plaid Link loads its SDK from cdn.plaid.com, opens its flow in an iframe to
// *.plaid.com, and the SDK talks to production.plaid.com / *.plaid.com — so
// those origins are allowlisted for script/frame/connect. (Harmless when no
// Plaid keys are set; required the moment they are.)
//
// Clerk loads ClerkJS from its Frontend API host, talks to it over fetch,
// serves avatars from img.clerk.com, runs a web worker (blob:), and shows a
// Cloudflare Turnstile bot-check in an iframe. Without these the auth UI is
// CSP-blocked the moment Clerk keys are set. The Frontend API host is encoded
// in the publishable key, so we derive it (covering both *.clerk.accounts.dev
// dev instances and a future custom domain); the wildcard is a fallback when
// the key isn't present at build time.
function clerkFrontendApi() {
  const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!pk) return null;
  try {
    const decoded = Buffer.from(pk.replace(/^pk_(test|live)_/, ""), "base64")
      .toString("utf8")
      .replace(/\$$/, "");
    return decoded ? `https://${decoded}` : null;
  } catch {
    return null;
  }
}

const clerkApi = clerkFrontendApi();
const clerkScript = [clerkApi, "https://*.clerk.accounts.dev", "https://challenges.cloudflare.com"].filter(Boolean);
const clerkConnect = [clerkApi, "https://*.clerk.accounts.dev", "https://clerk-telemetry.com"].filter(Boolean);

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "worker-src 'self' blob:",
  "img-src 'self' data: https://img.clerk.com",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  `script-src 'self' 'unsafe-inline' https://cdn.plaid.com ${clerkScript.join(" ")}`,
  `frame-src https://cdn.plaid.com https://*.plaid.com https://challenges.cloudflare.com ${(clerkApi ? [clerkApi] : []).join(" ")}`.trim(),
  `connect-src 'self' https://*.plaid.com ${clerkConnect.join(" ")}`,
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
