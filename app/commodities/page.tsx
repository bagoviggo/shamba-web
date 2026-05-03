import { api } from "@/lib/api";
import { formatKES, getEmoji } from "@/lib/utils";
import Link from "next/link";

export const revalidate = 3600;

export default async function CommoditiesPage() {
  const commodities = await api.getCommodities().catch(() => []);

  return (
    <div className="animate-fade-in">
      <div className="bg-earth px-5 pt-5 pb-6">
        <h1 className="font-display font-bold text-white text-xl">Commodities</h1>
        <p className="text-white/50 text-sm mt-1">{commodities.length} products tracked across Kenya</p>
      </div>

      <div className="px-4 mt-5 space-y-2 pb-4">
        {commodities.map(c => (
          <Link
            key={c.commodity}
            href={`/commodities/${encodeURIComponent(c.commodity)}`}
            className="card flex items-center gap-3 px-4 py-3.5 hover:bg-cream transition-colors"
          >
            <span className="text-2xl w-10 text-center">{getEmoji(c.commodity)}</span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-earth text-sm truncate">{c.commodity}</div>
              <div className="text-earth/50 text-xs mt-0.5">
                {c.county_count} counties · {c.market_count} markets
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="font-display font-bold text-leaf text-sm">{formatKES(c.avg_retail)}</div>
              <div className="text-earth/40 text-[10px]">avg retail</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
