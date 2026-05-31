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
  role: "user" | "assistant" | "unite";
  text: string;
}

interface AssistantReply {
  answer: string;
  verse?: { text: string; reference: string } | null;
}

/** Defensively parse the model's JSON reply; fall back to raw text. */
function parseReply(raw: string): AssistantReply {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  try {
    const parsed = JSON.parse(cleaned);
    if (parsed && typeof parsed.answer === "string") {
      return {
        answer: parsed.answer,
        verse:
          parsed.verse && parsed.verse.text && parsed.verse.reference
            ? { text: parsed.verse.text, reference: parsed.verse.reference }
            : null,
      };
    }
  } catch {
    // not JSON — treat the whole thing as the answer
  }
  return { answer: raw.trim(), verse: null };
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
  const messages = turns
    .map((t) => ({
      role: t.role === "user" ? ("user" as const) : ("assistant" as const),
      content: String(t.text ?? ""),
    }))
    .filter((m) => m.content.trim().length > 0);
  while (messages.length && messages[0].role === "assistant") messages.shift();
  if (messages.length === 0) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
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

    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return NextResponse.json({ ...parseReply(text), source: "claude" });
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      console.error(`Anthropic API error ${err.status}:`, err.message);
    } else {
      console.error("Assistant route error:", err);
    }
    return NextResponse.json({ error: "assistant_error" }, { status: 502 });
  }
}
