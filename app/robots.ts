import type { MetadataRoute } from "next";

const BASE_URL = "https://unitefinancial.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Private app + auth screens stay out of the index.
        disallow: [
          "/dashboard",
          "/transactions",
          "/budget",
          "/cashflow",
          "/goals",
          "/giving",
          "/accounts",
          "/assistant",
          "/login",
          "/signup",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
