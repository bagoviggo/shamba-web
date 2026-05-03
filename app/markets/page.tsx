"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { TrendChart } from "@/components/charts/TrendChart";
import { PriceTable } from "@/components/ui/PriceTable";
import { ChangeBadge } from "@/components/ui/ChangeBadge";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { getEmoji } from "@/lib/utils";

const DAYS_OPTIONS = [7, 14, 30, 60];

export default function MarketsPage() {
  const [selectedCommodity, setSelected] = useState("Dry Maize");
  const [days, setDays] = useState(30);
  const [countyFilter, setCountyFilter] = useState("");

  const { data: commodities } = useQuery({
    queryKey: ["commodities"],
    queryFn: api.getCommodities,
  });

  const { data: trend, isLoading: trendLoading } = useQuery({
    queryKey: ["trend", selectedCommodity, days],
    queryFn: () => api.getTrend(selectedCommodity, days),
    enabled: !!selectedCommodity,
  });

  const { data: daily, isLoading: dailyLoading } = useQuery({
    queryKey: ["daily", countyFilter],
    queryFn: () => api.getDailyPrices({ county: countyFilter }),
  });

  const { data: movers } = useQuery({
    queryKey: ["movers"],
    queryFn: () => api.getMovers(10),
  });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-earth px-5 pt-5 pb-6">
        <h1 className="font-display font-bold text-white text-xl">Markets & Prices</h1>
        <p className="text-white/50 text-sm mt-1">Trends, movers, and daily data</p>
      </div>

      {/* Trend chart */}
      <div className="px-4 mt-5">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-earth text-sm">📈 Price Trend</h2>
            <div className="flex gap-1">
              {DAYS_OPTIONS.map(d => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${days === d ? "bg-earth text-white" : "text-earth/50 hover:text-earth"}`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>

          {/* Commodity selector */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none mb-4">
            {(commodities ?? []).slice(0, 8).map(c => (
              <button
                key={c.commodity}
                onClick={() => setSelected(c.commodity)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  selectedCommodity === c.commodity
                    ? "bg-earth text-white border-earth"
                    : "border-earth text-earth/60 hover:border-leaf hover:text-leaf"
                }`}
              >
                <span>{getEmoji(c.commodity)}</span>
                {c.commodity}
              </button>
            ))}
          </div>

          {trendLoading ? (
            <div className="h-48 flex items-center justify-center text-earth/30 text-sm">Loading chart…</div>
          ) : (
            <TrendChart data={trend ?? []} title={`Retail price (KES) · ${selectedCommodity} · last ${days} days`} />
          )}
        </div>
      </div>

      {/* Top movers */}
      {movers && movers.length > 0 && (
        <div className="px-4 mt-5">
          <h2 className="font-display font-bold text-earth text-sm mb-3">⚡ Today's Movers</h2>
          <div className="space-y-2">
            {movers.map((m, i) => (
              <div key={i} className="card flex items-center gap-3 px-4 py-3">
                <span className="text-xl">{getEmoji(m.commodity)}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-earth text-xs truncate">{m.commodity}</div>
                  <div className="text-earth/50 text-[10px]">{m.market} · {m.county}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-earth font-semibold text-xs">KES {m.retail_price}</div>
                  <ChangeBadge pct={m.change_pct} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's full table */}
      <div className="px-4 mt-5 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-earth text-sm">📋 All Prices Today</h2>
        </div>
        <input
          type="text"
          placeholder="Filter by county…"
          value={countyFilter}
          onChange={e => setCountyFilter(e.target.value)}
          className="w-full bg-cream border border-earth rounded-xl px-4 py-2 text-sm mb-3 outline-none focus:border-leaf"
        />
        {dailyLoading ? (
          <div className="space-y-1">{[...Array(6)].map((_, i) => <TableRowSkeleton key={i} />)}</div>
        ) : (
          <PriceTable data={daily?.data ?? []} />
        )}
      </div>
    </div>
  );
}
