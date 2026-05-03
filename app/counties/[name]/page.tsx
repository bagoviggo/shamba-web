import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { PriceTable } from "@/components/ui/PriceTable";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Store } from "lucide-react";

export const revalidate = 1800;

interface Props { params: { name: string } }

export default async function CountyDetailPage({ params }: Props) {
  const name = decodeURIComponent(params.name);

  const [prices, markets] = await Promise.all([
    api.getCountyPrices(name).catch(() => null),
    api.getCountyMarkets(name).catch(() => null),
  ]);

  if (!prices) notFound();

  return (
    <div className="animate-fade-in">
      <div className="bg-earth px-5 pt-5 pb-6">
        <Link href="/counties" className="flex items-center gap-1.5 text-white/60 text-xs mb-4">
          <ArrowLeft size={13} /> Back to counties
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-lime/20 rounded-xl flex items-center justify-center">
            <MapPin size={18} className="text-lime" />
          </div>
          <div>
            <h1 className="font-display font-bold text-white text-xl">{name}</h1>
            <p className="text-white/50 text-xs">{prices.count} prices today</p>
          </div>
        </div>
      </div>

      {/* Markets list */}
      {markets && markets.markets.length > 0 && (
        <div className="px-4 mt-4">
          <h2 className="font-display font-bold text-earth text-sm mb-3">
            <Store size={14} className="inline mr-1" />Markets in {name}
          </h2>
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {markets.markets.map(m => (
              <div key={m.market} className="flex-shrink-0 bg-white border border-earth rounded-xl px-3 py-2 text-xs">
                <div className="font-semibold text-earth">{m.market}</div>
                <div className="text-earth/50">{m.commodity_count} items</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prices table */}
      <div className="px-4 mt-4 pb-4">
        <h2 className="font-display font-bold text-earth text-sm mb-3">Today's Prices</h2>
        <PriceTable data={prices.data} showCounty={false} />
      </div>
    </div>
  );
}
