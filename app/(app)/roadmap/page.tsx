import type { Metadata } from "next";
import { RoadmapClient } from "@/components/app/roadmap-client";

export const metadata: Metadata = { title: "Roadmap" };
// Personalized, data-driven view (reads the live household store) — render on
// demand rather than statically prerendering the full animated client tree.
export const dynamic = "force-dynamic";

export default function RoadmapPage() {
  return <RoadmapClient />;
}
