import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { functions } from "@/lib/inngest-functions";

export const runtime = "nodejs";

// Inngest's serve handler registers the durable functions. Harmless without
// keys — Inngest simply has nothing to call until INNGEST_* is configured.
export const { GET, POST, PUT } = serve({ client: inngest, functions });
