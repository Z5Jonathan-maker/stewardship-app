"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  BookOpen,
  Square,
  HandHeart,
  Plane,
  PieChart,
  PiggyBank,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { Markdown } from "@/components/app/markdown";
import {
  netWorth,
  totalGiving,
  givingRate,
  leftToSpend,
  monthlySpending,
  spendingByCategory,
  emergencyFund,
} from "@/lib/mock-data";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface Message {
  role: "user" | "unifi";
  text: string;
  verse?: { text: string; ref: string };
}

/**
 * Local stewardship fallback for "Ask UniFi". The page calls the Claude-backed
 * `/api/assistant` route first; this keyword-matched mock is used only when no
 * ANTHROPIC_API_KEY is configured (e.g. the public demo) or the request fails,
 * so the experience always degrades gracefully.
 */
function answer(question: string): Message {
  const q = question.toLowerCase();

  if (q.includes("give") || q.includes("giving") || q.includes("tithe")) {
    return {
      role: "unifi",
      text: `This month you've given ${formatCurrency(totalGiving)} — about ${formatPercent(givingRate, 1)} of your income. You're close to a full tithe; bumping it a little would get you there. Beautiful, faithful work.`,
      verse: { text: "Bring the whole tithe into the storehouse… and see if I will not throw open the floodgates of heaven.", ref: "Malachi 3:10" },
    };
  }
  if (q.includes("afford") || q.includes("trip") || q.includes("vacation")) {
    return {
      role: "unifi",
      text: `You currently have ${formatCurrency(leftToSpend)} left in this month's budget, and your cash flow has run a healthy surplus. A modest trip is within reach — I'd suggest funding it from your Missions Trip goal so it doesn't pull from the emergency fund.`,
    };
  }
  if (q.includes("net worth") || q.includes("worth")) {
    return {
      role: "unifi",
      text: `Your net worth is ${formatCurrency(netWorth)}, up about 4% over the last month. Steady progress — paying down the auto loan is the fastest lever to grow it further.`,
    };
  }
  if (q.includes("spend") || q.includes("spent") || q.includes("most")) {
    const top = spendingByCategory[0];
    return {
      role: "unifi",
      text: `You've spent ${formatCurrency(monthlySpending)} so far this month. Your biggest category is ${top.emoji} ${top.name} at ${formatCurrency(top.amount)}. You're under budget on groceries but a bit over on shopping — worth a glance.`,
    };
  }
  if (q.includes("save") || q.includes("emergency")) {
    const pct = formatPercent(emergencyFund.saved / emergencyFund.target, 0);
    return {
      role: "unifi",
      text: `Your emergency fund is at ${formatCurrency(emergencyFund.saved)} of a ${formatCurrency(emergencyFund.target)} goal — about ${pct}. At ${formatCurrency(emergencyFund.monthly)}/month you'll reach it next spring. Want me to suggest a way to get there sooner?`,
    };
  }
  return {
    role: "unifi",
    text: `I can help you understand your spending, giving, goals, cash flow, and net worth — all grounded in your real numbers, with stewardship in mind. Try one of the suggestions below.`,
    verse: { text: "Commit to the Lord whatever you do, and he will establish your plans.", ref: "Proverbs 16:3" },
  };
}

const suggestions: { q: string; Icon: LucideIcon }[] = [
  { q: "How much have we given this month?", Icon: HandHeart },
  { q: "Can we afford a family trip?", Icon: Plane },
  { q: "What did we spend the most on?", Icon: PieChart },
  { q: "How's our emergency fund doing?", Icon: PiggyBank },
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "unifi",
      text: "Hi Jonathan 👋 I'm UniFi, your stewardship companion. Ask me anything about your money — I'll answer from your real numbers, with wisdom and care.",
    },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  // Auto-dismiss the toast.
  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(null), 4500);
    return () => clearTimeout(id);
  }, [notice]);

  async function ask(question: string) {
    if (!question.trim() || pending) return;
    const history = [...messages, { role: "user" as const, text: question }];
    setMessages(history);
    setInput("");
    setPending(true);
    setNotice(null);

    const controller = new AbortController();
    abortRef.current = controller;
    let started = false;
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, text: m.text })),
        }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) throw new Error("assistant unavailable");

      // Stream tokens into a single growing assistant message.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        if (!started) {
          started = true;
          setPending(false);
          setMessages((m) => [...m, { role: "unifi", text: acc }]);
        } else {
          setMessages((m) => {
            const next = [...m];
            next[next.length - 1] = { role: "unifi", text: acc };
            return next;
          });
        }
      }
      if (!started || !acc.trim()) throw new Error("empty response");
    } catch {
      // User pressed Stop — keep whatever streamed, no fallback.
      if (controller.signal.aborted) return;
      // Otherwise gracefully fall back to the local stewardship mock (e.g. no
      // ANTHROPIC_API_KEY) — only if nothing streamed, to avoid duplicating a
      // partial reply — and let the user know.
      if (!started) setMessages((m) => [...m, answer(question)]);
      setNotice("Showing offline guidance — couldn't reach the assistant.");
    } finally {
      abortRef.current = null;
      setPending(false);
    }
  }

  function stop() {
    abortRef.current?.abort();
  }

  // Only the seeded greeting so far → show the centered empty state.
  const showEmpty = messages.length <= 1 && !pending;

  return (
    <div className="mx-auto flex h-[calc(100vh-7rem)] max-w-3xl flex-col">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-xl font-semibold text-evergreen-900">
            Ask UniFi
          </h1>
          <p className="text-sm text-muted-foreground">
            Answers from your data, grounded in stewardship.
          </p>
        </div>
      </div>

      {/* Messages */}
      <div
        role="log"
        aria-live="polite"
        aria-label="Conversation with UniFi"
        className="flex-1 overflow-y-auto rounded-2xl border border-border bg-card p-5"
      >
        {showEmpty ? (
          <div className="flex h-full flex-col items-center justify-center px-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-soft">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-display text-xl font-semibold text-evergreen-900">
              Ask me anything about your money
            </h2>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              I answer from your real numbers, with a stewardship lens. Try one
              of these:
            </p>
            <div className="mt-6 grid w-full max-w-lg gap-3 sm:grid-cols-2">
              {suggestions.map((s, i) => (
                <motion.button
                  key={s.q}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => ask(s.q)}
                  className="group flex items-center gap-3 rounded-2xl border border-border bg-cream-50 p-3.5 text-left transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                    <s.Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="text-sm font-medium text-evergreen-800">{s.q}</span>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[80%] rounded-2xl rounded-br-sm bg-brand-500 px-4 py-3 text-sm text-white"
                        : "max-w-[85%] rounded-2xl rounded-bl-sm bg-cream-100 px-4 py-3"
                    }
                  >
                    {m.role === "unifi" && (
                      <div className="mb-1.5">
                        <Logo markOnly className="opacity-90" />
                      </div>
                    )}
                    {m.role === "user" ? <p>{m.text}</p> : <Markdown text={m.text} />}
                    {m.verse && (
                      <div className="mt-3 flex items-start gap-2 rounded-xl border border-border bg-card p-3">
                        <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                        <p className="text-xs italic text-evergreen-700">
                          “{m.verse.text}” — <span className="font-semibold not-italic">{m.verse.ref}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {pending && (
              <div className="flex justify-start">
                <div className="flex max-w-[85%] items-center gap-1.5 rounded-2xl rounded-bl-sm bg-cream-100 px-4 py-3.5">
                  <span className="sr-only">UniFi is thinking…</span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        )}
      </div>

      {/* Fallback / error toast */}
      {notice && (
        <div
          role="status"
          className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-800"
        >
          {notice}
        </div>
      )}

      {/* Quick suggestions (during a conversation; the empty state shows cards) */}
      {!showEmpty && (
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s.q}
              onClick={() => ask(s.q)}
              disabled={pending}
              className="rounded-full border border-border bg-cream-50 px-3 py-1.5 text-xs font-medium text-evergreen-700 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {s.q}
            </button>
          ))}
        </div>
      )}

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="mt-3 flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={pending}
          placeholder="Ask about spending, giving, goals…"
          className="h-12 flex-1 rounded-full border border-border bg-card px-5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200 disabled:opacity-60"
        />
        {pending ? (
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="h-12 w-12"
            aria-label="Stop"
            onClick={stop}
          >
            <Square className="h-4 w-4 fill-current" />
          </Button>
        ) : (
          <Button type="submit" size="icon" className="h-12 w-12" aria-label="Send">
            <Send className="h-5 w-5" />
          </Button>
        )}
      </form>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        UniFi offers guidance, not professional financial advice.
      </p>
    </div>
  );
}
