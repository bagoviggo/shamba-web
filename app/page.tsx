import { api } from "@/lib/api";
import { formatKES, formatDate, getEmoji, formatChange } from "@/lib/utils";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ShambaChat } from "@/components/ui/ShambaChat";
import { PriceTable } from "@/components/ui/PriceTable";

export const revalidate = 1800; // 30 min

export default async function HomePage() {
  const [summary, daily] = await Promise.all([
    api.getSummary().catch(() => null),
    api.getDailyPrices().catch(() => null),
  ]);

  const movers = summary?.top_movers ?? [];

  return (
    <div className="animate-fade-in">
      {/* Hero header */}
      <div className="bg-earth px-5 pt-5 pb-8 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-lime/10" />
        <div className="absolute -bottom-8 left-8 w-24 h-24 rounded-full bg-amber/8" />
        <div className="relative">
          <h1 className="font-display font-bold text-white text-2xl leading-tight">
            Habari, Farmer! 👋
          </h1>
          <p className="text-white/60 text-sm mt-1">
            {daily?.count ?? 0} prices across {summary?.county_count ?? 0} counties today
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="w-2 h-2 rounded-full bg-lime animate-pulse-slow" />
            <span className="text-lime text-xs">
              Updated {summary?.last_scrape?.run_at ? formatDate(summary.last_scrape.run_at) : "today"}
            </span>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      {summary && (
        <div className="flex gap-3 px-4 -mt-4 overflow-x-auto scrollbar-none pb-1">
          {[
            { label: "Counties", value: summary.county_count, icon: "📍" },
            { label: "Commodities", value: summary.commodity_count, icon: "🌾" },
            { label: "Records", value: summary.total_records.toLocaleString(), icon: "📊" },
          ].map(s => (
            <div key={s.label} className="flex-shrink-0 bg-white border border-earth rounded-2xl px-4 py-3 shadow-sm min-w-[110px]">
              <div className="text-lg">{s.icon}</div>
              <div className="font-display font-bold text-earth text-xl mt-1">{s.value}</div>
              <div className="text-earth/50 text-[10px] font-medium uppercase tracking-wide">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* AI Card */}
      <div className="px-4 mt-5">
        <div className="bg-gradient-to-br from-earth to-moss rounded-2xl p-4 shadow-lg relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-lime/10" />
          <div className="flex items-center gap-2 mb-3 relative">
            <div className="w-7 h-7 bg-lime rounded-lg flex items-center justify-center text-sm">🤖</div>
            <div>
              <div className="font-display font-bold text-white text-sm">Ask Shamba AI</div>
              <div className="text-white/50 text-[10px]">Powered by Claude · Live market data</div>
            </div>
          </div>
          <ShambaChat summary={summary} daily={daily} compact />
        </div>
      </div>

      {/* Top Movers */}
      {movers.length > 0 && (
        <div className="px-4 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-earth text-base">⚡ Top Movers</h2>
            <Link href="/markets" className="text-leaf text-xs flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {movers.map((m, i) => (
              <div key={i} className="card flex items-center gap-3 px-4 py-3">
                <span className="text-2xl">{getEmoji(m.commodity)}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-earth text-sm truncate">{m.commodity}</div>
                  <div className="text-earth/50 text-xs">{m.market} · {m.county}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-display font-bold text-earth text-sm">{formatKES(m.retail_price)}</div>
                  <div className={`text-xs font-semibold flex items-center gap-0.5 justify-end ${m.change_pct >= 0 ? "text-green-700" : "text-red-600"}`}>
                    {m.change_pct >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                    {formatChange(m.change_pct)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's prices table */}
      {daily?.data && daily.data.length > 0 && (
        <div className="px-4 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-earth text-base">📋 Today's Prices</h2>
            <span className="text-earth/40 text-xs">{daily.date}</span>
          </div>
          <PriceTable data={daily.data} />
        </div>
      )}

      {/* Quick links */}
      <div className="px-4 mt-6 grid grid-cols-2 gap-3 pb-4">
        {[
          { href: "/commodities", label: "Browse Commodities", emoji: "🌽", desc: "All tracked crops" },
          { href: "/counties",    label: "By County",          emoji: "📍", desc: "47 counties" },
          { href: "/compare",     label: "Compare Prices",     emoji: "📊", desc: "Side-by-side" },
          { href: "/ai",          label: "Ask AI",             emoji: "🤖", desc: "Full AI chat" },
        ].map(l => (
          <Link key={l.href} href={l.href} className="card px-4 py-4 hover:bg-cream transition-colors">
            <div className="text-2xl mb-2">{l.emoji}</div>
            <div className="font-semibold text-earth text-sm">{l.label}</div>
            <div className="text-earth/50 text-xs mt-0.5">{l.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
