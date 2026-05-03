"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatsSummary, DailyResponse } from "@/lib/api";

interface Message { role: "user" | "assistant"; content: string }

const CHIPS = [
  "Best price for maize today?",
  "Where should I sell tomatoes?",
  "What's rising this week?",
  "Cheapest potatoes in Nairobi?",
  "Compare maize prices across counties",
];

interface Props {
  summary: StatsSummary | null;
  daily: DailyResponse | null;
  compact?: boolean;
}

export function ShambaChat({ summary, daily, compact = false }: Props) {
  const [messages,  setMessages]  = useState<Message[]>([]);
  const [input,     setInput]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const buildContext = () => {
    if (!summary && !daily) return "No live data available.";
    const lines: string[] = [];
    if (summary?.latest_date) lines.push(`Date: ${summary.latest_date}`);
    if (summary?.county_count) lines.push(`Counties covered: ${summary.county_count}`);
    if (summary?.commodity_count) lines.push(`Commodities tracked: ${summary.commodity_count}`);
    if (summary?.top_movers?.length) {
      lines.push("\nTOP MOVERS:");
      summary.top_movers.forEach(m =>
        lines.push(`- ${m.commodity} in ${m.county} (${m.market}): KES ${m.retail_price}/${m.price_unit} (${m.change_pct > 0 ? "+" : ""}${m.change_pct}%)`)
      );
    }
    if (daily?.data?.length) {
      lines.push("\nTODAY'S SAMPLE PRICES:");
      daily.data.slice(0, 30).forEach(p =>
        lines.push(`- ${p.commodity} | ${p.market}, ${p.county} | Wholesale: KES ${p.wholesale_price} | Retail: KES ${p.retail_price}/${p.price_unit}`)
      );
    }
    return lines.join("\n");
  };

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || loading) return;
    const userMsg: Message = { role: "user", content: q };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory, marketContext: buildContext() }),
      });

      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setMessages([...newHistory, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([...newHistory, { role: "assistant", content: "Samahani! Could not connect. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <div className={cn("flex flex-col", compact ? "gap-3" : "gap-4")}>
      {/* Chat thread */}
      {messages.length > 0 && (
        <div className={cn("flex flex-col gap-2 overflow-y-auto", compact ? "max-h-48" : "max-h-72")}>
          {messages.map((m, i) => (
            <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                m.role === "user"
                  ? "bg-earth text-white rounded-br-sm"
                  : "bg-white border border-earth text-earth rounded-bl-sm shadow-sm"
              )}>
                {m.role === "assistant" && (
                  <div className="flex items-center gap-1.5 mb-1 text-leaf">
                    <Bot size={12} />
                    <span className="text-[10px] font-semibold uppercase tracking-wide">Shamba AI</span>
                  </div>
                )}
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-earth rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-leaf dot-1" />
                  <span className="w-1.5 h-1.5 rounded-full bg-leaf dot-2" />
                  <span className="w-1.5 h-1.5 rounded-full bg-leaf dot-3" />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Quick chips — only when no messages */}
      {!messages.length && (
        <div className="flex gap-2 flex-wrap">
          {CHIPS.map(q => (
            <button
              key={q}
              onClick={() => send(q)}
              className="bg-white/10 border border-white/20 rounded-full px-3 py-1.5 text-white/80 text-xs hover:bg-white/20 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send(input)}
          placeholder="Ask about prices, markets, or trends…"
          className="flex-1 bg-white/12 border border-white/25 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/40 outline-none focus:border-lime/60"
        />
        <button
          onClick={() => send(input)}
          disabled={loading || !input.trim()}
          className="bg-lime disabled:opacity-40 rounded-xl w-11 flex items-center justify-center transition-opacity"
        >
          <Send size={15} className="text-earth" />
        </button>
      </div>
    </div>
  );
}
