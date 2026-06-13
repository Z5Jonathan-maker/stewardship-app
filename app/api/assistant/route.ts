import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import {
  buildFinancialContext,
  ASSISTANT_SYSTEM_PROMPT,
} from "@/lib/assistant-context";

// The SDK needs the Node runtime, and answers depend on request input.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatTurn {
  role: "user" | "assistant" | "unifi";
  text: string;
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  // No key configured (e.g. the public demo): tell the client to use its
  // local fallback rather than erroring.
  if (!apiKey) {
    return NextResponse.json({ error: "assistant_unavailable" }, { status: 503 });
  }

  let turns: ChatTurn[];
  try {
    const body = await request.json();
    turns = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  // Map to API roles and ensure the transcript starts with a user turn.
  // Bound the input so a client can't forward an unbounded payload to the
  // model: cap per-message length and keep only the most recent turns.
  const MAX_TURNS = 20;
  const MAX_CHARS = 4000;
  const messages = turns
    .slice(-MAX_TURNS)
    .map((t) => ({
      role: t.role === "user" ? ("user" as const) : ("assistant" as const),
      content: String(t.text ?? "").slice(0, MAX_CHARS),
    }))
    .filter((m) => m.content.trim().length > 0);
  while (messages.length && messages[0].role === "assistant") messages.shift();
  if (messages.length === 0) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const stream = client.messages.stream({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    // Stable persona first, then the (deterministic) data snapshot with a
    // cache breakpoint so repeated questions reuse the cached prefix.
    system: [
      { type: "text", text: ASSISTANT_SYSTEM_PROMPT },
      {
        type: "text",
        text: buildFinancialContext(),
        cache_control: { type: "ephemeral" },
      },
    ],
    messages,
  });

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        stream.on("text", (delta) => controller.enqueue(encoder.encode(delta)));
        await stream.finalMessage();
        controller.close();
      } catch (err) {
        if (err instanceof Anthropic.APIError) {
          console.error(`Anthropic API error ${err.status}:`, err.message);
        } else {
          console.error("Assistant stream error:", err);
        }
        // Close cleanly; the client treats an empty/short stream as a failure
        // and falls back to its local mock.
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
