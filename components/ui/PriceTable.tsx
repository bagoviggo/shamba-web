"use client";
import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { formatKES, getEmoji, cn } from "@/lib/utils";
import type { PriceRecord } from "@/lib/api";

interface Props {
  data: PriceRecord[];
  showCounty?: boolean;
}

type SortKey = "commodity" | "retail_price" | "wholesale_price" | "county" | "market";

export function PriceTable({ data, showCounty = true }: Props) {
  const [sort, setSort]   = useState<SortKey>("commodity");
  const [asc,  setAsc]    = useState(true);
  const [search, setSearch] = useState("");

  const sorted = [...data]
    .filter(r =>
      !search ||
      r.commodity.toLowerCase().includes(search.toLowerCase()) ||
      r.market.toLowerCase().includes(search.toLowerCase()) ||
      r.county.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const va = a[sort] ?? "";
      const vb = b[sort] ?? "";
      return asc
        ? String(va).localeCompare(String(vb), undefined, { numeric: true })
        : String(vb).localeCompare(String(va), undefined, { numeric: true });
    });

  const toggle = (key: SortKey) => {
    if (sort === key) setAsc(!asc);
    else { setSort(key); setAsc(true); }
  };

  const Th = ({ k, label }: { k: SortKey; label: string }) => (
    <th
      className="px-3 py-2 text-left text-[10px] font-semibold text-earth/60 uppercase tracking-wide cursor-pointer select-none whitespace-nowrap"
      onClick={() => toggle(k)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {sort === k ? (asc ? <ChevronUp size={10} /> : <ChevronDown size={10} />) : null}
      </span>
    </th>
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search commodity, market, county…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full bg-cream border border-earth rounded-xl px-4 py-2.5 text-sm mb-3 outline-none focus:border-leaf"
      />
      <div className="overflow-x-auto rounded-xl border border-earth">
        <table className="w-full text-sm">
          <thead className="bg-cream sticky top-0">
            <tr>
              <Th k="commodity" label="Commodity" />
              <Th k="retail_price" label="Retail" />
              <Th k="wholesale_price" label="Wholesale" />
              {showCounty && <Th k="county" label="County" />}
              <Th k="market" label="Market" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => (
              <tr key={r.id} className={cn("border-t border-earth hover:bg-cream/60 transition-colors", i % 2 === 0 ? "bg-white" : "bg-warm")}>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{getEmoji(r.commodity)}</span>
                    <div>
                      <div className="font-medium text-earth text-xs">{r.commodity}</div>
                      {r.classification && <div className="text-[10px] text-earth/50">{r.classification}</div>}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5 font-semibold text-leaf text-xs">{formatKES(r.retail_price)}</td>
                <td className="px-3 py-2.5 text-earth/70 text-xs">{formatKES(r.wholesale_price)}</td>
                {showCounty && <td className="px-3 py-2.5 text-earth/60 text-xs">{r.county}</td>}
                <td className="px-3 py-2.5 text-earth/60 text-xs">{r.market}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!sorted.length && (
          <div className="text-center py-12 text-earth/40 text-sm">No records found</div>
        )}
      </div>
      <p className="text-[10px] text-earth/40 mt-2 text-right">{sorted.length} records</p>
    </div>
  );
}
