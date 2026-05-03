import { api } from "@/lib/api";
import { formatKES, getEmoji } from "@/lib/utils";
import { TrendChart } from "@/components/charts/TrendChart";
import { PriceTable } from "@/components/ui/PriceTable";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const revalidate = 3600;

interface Props { params: { name: string } }

export default async function CommodityDetailPage({ params }: Props) {
  const name = decodeURIComponent(params.name);

  const [detail, trend] = await Promise.all([
    api.getCommodity(name).catch(() => null),
    api.getTrend(name, 30).catch(() => []),
  ]);

  if (!detail) notFound();

  const s = detail.summary;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-earth px-5 pt-5 pb-6">
        <Link href="/commodities" className="flex items-center gap-1.5 text-white/60 text-xs mb-4">
          <ArrowLeft size={13} /> Back to commodities
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-4xl">{getEmoji(name)}</span>
          <div>
            <h1 className="font-display font-bold text-white text-xl">{name}</h1>
            <p className="text-white/50 text-xs mt-0.5">{s.county_count} counties · {s.market_count} markets</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 mt-4 grid grid-cols-3 gap-2">
        {[
          { label: "Avg Retail",    value: formatKES(s.avg_retail) },
          { label: "Avg Wholesale", value: formatKES(s.avg_wholesale) },
          { label: "Price Range",   value: `${formatKES(s.min_retail)} – ${formatKES(s.max_retail)}` },
        ].map(stat => (
          <div key={stat.label} className="card px-3 py-3 text-center">
            <div className="font-display font-bold text-earth text-xs">{stat.value}</div>
            <div className="text-earth/50 text-[10px] mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Trend */}
      <div className="px-4 mt-4">
        <div className="card p-4">
          <h2 className="font-display font-bold text-earth text-sm mb-4">📈 30-Day Price Trend</h2>
          <TrendChart data={trend} title="Retail price (KES) by county" />
        </div>
      </div>

      {/* Latest prices table */}
      <div className="px-4 mt-4 pb-4">
        <h2 className="font-display font-bold text-earth text-sm mb-3">Latest Market Prices</h2>
        <PriceTable data={detail.latest_prices} />
      </div>
    </div>
  );
}
