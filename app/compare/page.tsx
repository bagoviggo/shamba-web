"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CountyBarChart } from "@/components/charts/CountyBarChart";
import { formatKES, getEmoji } from "@/lib/utils";
import { X } from "lucide-react";

const POPULAR_COUNTIES = [
  "Nairobi", "Nakuru", "Kiambu", "Meru", "Kisumu",
  "Uasin-Gishu", "Trans-Nzoia", "Kakamega", "Muranga", "Kirinyaga",
];

export default function ComparePage() {
  const [commodity, setCommodity] = useState("Dry Maize");
  const [selected,  setSelected]  = useState<string[]>(["Nairobi", "Nakuru", "Kiambu"]);
  const [days, setDays] = useState(7);

  const { data: commodities } = useQuery({ queryKey: ["commodities"], queryFn: api.getCommodities });
  const { data: counties }    = useQuery({ queryKey: ["counties"],    queryFn: api.getCounties });

  const { data: comparison, isLoading } = useQuery({
    queryKey: ["compare", commodity, selected, days],
    queryFn:  () => api.compareCounties(commodity, selected, days),
    enabled:  selected.length > 0 && !!commodity,
  });

  const toggle = (county: string) => {
    setSelected(s =>
      s.includes(county) ? s.filter(c => c !== county) : s.length < 6 ? [...s, county] : s
    );
  };

  const allCounties = counties?.map(c => c.county) ?? POPULAR_COUNTIES;

  return (
    <div className="animate-fade-in">
      <div className="bg-earth px-5 pt-5 pb-6">
        <h1 className="font-display font-bold text-white text-xl">Compare Prices</h1>
        <p className="text-white/50 text-sm mt-1">Same commodity, multiple counties</p>
      </div>

      <div className="px-4 mt-5 space-y-4">
        {/* Commodity select */}
        <div>
          <label className="text-earth/60 text-xs font-semibold uppercase tracking-wide mb-2 block">Commodity</label>
          <select
            value={commodity}
            onChange={e => setCommodity(e.target.value)}
            className="w-full bg-white border border-earth rounded-xl px-4 py-2.5 text-sm text-earth outline-none focus:border-leaf"
          >
            {(commodities ?? []).map(c => (
              <option key={c.commodity} value={c.commodity}>
                {getEmoji(c.commodity)} {c.commodity}
              </option>
            ))}
          </select>
        </div>

        {/* County picker */}
        <div>
          <label className="text-earth/60 text-xs font-semibold uppercase tracking-wide mb-2 block">
            Counties ({selected.length}/6 selected)
          </label>
          <div className="flex flex-wrap gap-2">
            {allCounties.map(c => (
              <button
                key={c}
                onClick={() => toggle(c)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  selected.includes(c)
                    ? "bg-earth text-white border-earth"
                    : "border-earth text-earth/60 hover:border-leaf"
                }`}
              >
                {c}
                {selected.includes(c) && <X size={10} />}
              </button>
            ))}
          </div>
        </div>

        {/* Days */}
        <div className="flex gap-2">
          {[7, 14, 30].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                days === d ? "bg-earth text-white border-earth" : "border-earth text-earth/60"
              }`}
            >
              Last {d} days
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="card p-4">
          <h2 className="font-display font-bold text-earth text-sm mb-1">
            {getEmoji(commodity)} {commodity} — Retail Price (KES)
          </h2>
          <p className="text-earth/40 text-xs mb-4">Average over last {days} days</p>
          {isLoading ? (
            <div className="h-48 flex items-center justify-center text-earth/30 text-sm">Loading…</div>
          ) : (
            <CountyBarChart data={comparison ?? []} />
          )}
        </div>

        {/* Table */}
        {comparison && comparison.length > 0 && (
          <div className="card overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-cream">
                <tr>
                  <th className="px-4 py-2.5 text-left text-earth/60 font-semibold uppercase tracking-wide text-[10px]">County</th>
                  <th className="px-4 py-2.5 text-right text-earth/60 font-semibold uppercase tracking-wide text-[10px]">Retail</th>
                  <th className="px-4 py-2.5 text-right text-earth/60 font-semibold uppercase tracking-wide text-[10px]">Wholesale</th>
                  <th className="px-4 py-2.5 text-right text-earth/60 font-semibold uppercase tracking-wide text-[10px]">Markets</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((r, i) => (
                  <tr key={r.county} className={`border-t border-earth ${i % 2 === 0 ? "bg-white" : "bg-warm"}`}>
                    <td className="px-4 py-2.5 font-medium text-earth">{r.county}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-leaf">{formatKES(r.avg_retail)}</td>
                    <td className="px-4 py-2.5 text-right text-earth/60">{formatKES(r.avg_wholesale)}</td>
                    <td className="px-4 py-2.5 text-right text-earth/40">{r.market_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
