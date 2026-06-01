// Security headers. The CSP is intentionally conservative; Next's App Router
// injects inline bootstrap scripts and next/font injects inline styles, so
// 'unsafe-inline' is required until we move to nonces. No 'unsafe-eval' in prod.
//
// Plaid Link loads its SDK from cdn.plaid.com, opens its flow in an iframe to
// *.plaid.com, and the SDK talks to production.plaid.com / *.plaid.com — so
// those origins are allowlisted for script/frame/connect. (Harmless when no
// Plaid keys are set; required the moment they are.)
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' https://cdn.plaid.com",
  "frame-src https://cdn.plaid.com https://*.plaid.com",
  "connect-src 'self' https://*.plaid.com",
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
