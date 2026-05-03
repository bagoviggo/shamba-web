import { api } from "@/lib/api";
import { ShambaChat } from "@/components/ui/ShambaChat";

export const revalidate = 1800;

export default async function AIPage() {
  const [summary, daily] = await Promise.all([
    api.getSummary().catch(() => null),
    api.getDailyPrices().catch(() => null),
  ]);

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-br from-earth to-moss px-5 pt-5 pb-6 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-lime/10" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 bg-lime rounded-xl flex items-center justify-center text-lg">🤖</div>
            <div>
              <h1 className="font-display font-bold text-white text-xl">Shamba AI</h1>
              <p className="text-white/50 text-xs">Powered by Claude · Live KAMIS data</p>
            </div>
          </div>
          <p className="text-white/60 text-sm mt-3">
            Ask me anything about Kenyan agricultural prices — where to sell, where to buy, what's trending.
          </p>
          {summary && (
            <div className="flex items-center gap-3 mt-4 text-xs">
              <span className="bg-white/10 rounded-full px-2.5 py-1 text-white/70">
                📍 {summary.county_count} counties
              </span>
              <span className="bg-white/10 rounded-full px-2.5 py-1 text-white/70">
                🌾 {summary.commodity_count} commodities
              </span>
              <span className="bg-white/10 rounded-full px-2.5 py-1 text-white/70">
                📅 {summary.latest_date}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 mt-5">
        <div className="bg-gradient-to-br from-earth to-moss rounded-2xl p-4 shadow-lg">
          <ShambaChat summary={summary} daily={daily} />
        </div>

        {/* Suggested questions */}
        <div className="mt-5 pb-4">
          <p className="text-earth/50 text-xs font-semibold uppercase tracking-wide mb-3">Suggested questions</p>
          <div className="space-y-2">
            {[
              { q: "Where should I sell my tomatoes for the best price today?",         emoji: "🍅" },
              { q: "Which county has the cheapest maize right now?",                    emoji: "🌽" },
              { q: "What agricultural products are seeing price increases this week?",  emoji: "📈" },
              { q: "Is it worth travelling to Nairobi to sell my produce?",             emoji: "🚛" },
              { q: "What's the wholesale vs retail margin on avocados?",               emoji: "🥑" },
              { q: "Which markets have the highest supply of Irish potatoes?",          emoji: "🥔" },
            ].map(({ q, emoji }) => (
              <div key={q} className="card px-4 py-3 flex items-start gap-3">
                <span className="text-lg mt-0.5">{emoji}</span>
                <p className="text-earth text-sm leading-relaxed">{q}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
