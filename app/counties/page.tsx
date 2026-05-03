import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { MapPin } from "lucide-react";

export const revalidate = 3600;

export default async function CountiesPage() {
  const counties = await api.getCounties().catch(() => []);

  return (
    <div className="animate-fade-in">
      <div className="bg-earth px-5 pt-5 pb-6">
        <h1 className="font-display font-bold text-white text-xl">Counties</h1>
        <p className="text-white/50 text-sm mt-1">{counties.length} counties with market data</p>
      </div>

      <div className="px-4 mt-5 grid grid-cols-2 gap-2 pb-4">
        {counties.map(c => (
          <Link
            key={c.county}
            href={`/counties/${encodeURIComponent(c.county)}`}
            className="card px-4 py-4 hover:bg-cream transition-colors"
          >
            <div className="flex items-center gap-1.5 text-leaf mb-2">
              <MapPin size={13} />
              <span className="text-[10px] font-semibold uppercase tracking-wide">{c.county}</span>
            </div>
            <div className="font-display font-bold text-earth text-lg">{c.market_count}</div>
            <div className="text-earth/50 text-[10px]">markets</div>
            <div className="mt-2 text-[10px] text-earth/40">{c.commodity_count} commodities</div>
            <div className="text-[10px] text-earth/30">{formatDate(c.latest_date)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
