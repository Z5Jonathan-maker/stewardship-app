import type { MetadataRoute } from "next";

const BASE_URL = "https://unifi.finance";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // Public marketing pages only.
  return [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];
}
