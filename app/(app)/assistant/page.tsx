"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import {
  netWorth,
  totalGiving,
  givingRate,
  leftToSpend,
  monthlySpending,
  spendingByCategory,
} from "@/lib/mock-data";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface Message {
  role: "user" | "unite";
  text: string;
  verse?: { text: string; ref: string };
}

/**
 * Mock "Ask Unite" assistant. Answers from the local mock data with a
 * stewardship lens. Real version swaps `answer()` for a Claude API call
 * grounded in the user's connected accounts.
 */
function answer(question: string): Message {
  const q = question.toLowerCase();

  if (q.includes("give") || q.includes("giving") || q.includes("tithe")) {
    return {
      role: "unite",
      text: `This month you've given ${formatCurrency(totalGiving)} — about ${formatPercent(givingRate, 1)} of your income. You're close to a full tithe; bumping it a little would get you there. Beautiful, faithful work.`,
      verse: { text: "Bring the whole tithe into the storehouse… and see if I will not throw open the floodgates of heaven.", ref: "Malachi 3:10" },
    };
  }
  if (q.includes("afford") || q.includes("trip") || q.includes("vacation")) {
    return {
      role: "unite",
      text: `You currently have ${formatCurrency(leftToSpend)} left in this month's budget, and your cash flow has run a healthy surplus. A modest trip is within reach — I'd suggest funding it from your Missions Trip goal so it doesn't pull from the emergency fund.`,
    };
  }
  if (q.includes("net worth") || q.includes("worth")) {
    return {
      role: "unite",
      text: `Your net worth is ${formatCurrency(netWorth)}, up about 4% over the last month. Steady progress — paying down the auto loan is the fastest lever to grow it further.`,
    };
  }
  if (q.includes("spend") || q.includes("spent") || q.includes("most")) {
    const top = spendingByCategory[0];
    return {
      role: "unite",
      text: `You've spent ${formatCurrency(monthlySpending)} so far this month. Your biggest category is ${top.emoji} ${top.name} at ${formatCurrency(top.amount)}. You're under budget on groceries but a bit over on shopping — worth a glance.`,
    };
  }
  if (q.includes("save") || q.includes("emergency")) {
    return {
      role: "unite",
      text: `Your emergency fund is at ${formatCurrency(21750)} of a ${formatCurrency(30000)} goal — about 73%. At ${formatCurrency(500)}/month you'll reach it next spring. Want me to suggest a way to get there sooner?`,
    };
  }
  return {
    role: "unite",
    text: `I can help you understand your spending, giving, goals, cash flow, and net worth — all grounded in your real numbers, with stewardship in mind. Try one of the suggestions below.`,
    verse: { text: "Commit to the Lord whatever you do, and he will establish your plans.", ref: "Proverbs 16:3" },
  };
}

const suggestions = [
  "How much have we given this month?",
  "Can we afford a family trip?",
  "What did we spend the most on?",
  "How's our emergency fund doing?",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "unite",
      text: "Hi Jonathan 👋 I'm Unite, your stewardship companion. Ask me anything about your money — I'll answer from your real numbers, with wisdom and care.",
    },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function ask(question: string) {
    if (!question.trim()) return;
    setMessages((m) => [...m, { role: "user", text: question }, answer(question)]);
    setInput("");
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-7rem)] max-w-3xl flex-col">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-xl font-semibold text-evergreen-900">
            Ask Unite
          </h1>
          <p className="text-sm text-muted-foreground">
            Answers from your data, grounded in stewardship.
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-border bg-card p-5">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                m.role === "user"
                  ? "max-w-[80%] rounded-2xl rounded-br-sm bg-brand-500 px-4 py-3 text-sm text-white"
                  : "max-w-[85%] rounded-2xl rounded-bl-sm bg-cream-100 px-4 py-3"
              }
            >
              {m.role === "unite" && (
                <div className="mb-1.5">
                  <Logo markOnly className="opacity-90" />
                </div>
              )}
              <p className={m.role === "user" ? "" : "text-sm leading-relaxed text-evergreen-900"}>
                {m.text}
              </p>
              {m.verse && (
                <div className="mt-3 flex items-start gap-2 rounded-xl border border-border bg-card p-3">
                  <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                  <p className="text-xs italic text-evergreen-700">
                    “{m.verse.text}” — <span className="font-semibold not-italic">{m.verse.ref}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Suggestions */}
      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => ask(s)}
            className="rounded-full border border-border bg-cream-50 px-3 py-1.5 text-xs font-medium text-evergreen-700 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
          >
            {s}
          </button>
        ))}
      </div>

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
          placeholder="Ask about spending, giving, goals…"
          className="h-12 flex-1 rounded-full border border-border bg-card px-5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
        />
        <Button type="submit" size="icon" className="h-12 w-12" aria-label="Send">
          <Send className="h-5 w-5" />
        </Button>
      </form>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Unite offers guidance, not professional financial advice.
      </p>
    </div>
  );
}
