"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import type { CountyCompare } from "@/lib/api";
import { CHART_COLORS } from "@/lib/utils";

interface Props { data: CountyCompare[] }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-earth rounded-xl p-3 shadow-xl text-xs text-white">
      <p className="opacity-60 mb-1">{label}</p>
      <p>Retail: <strong>KES {payload[0]?.value?.toFixed(2)}</strong></p>
      {payload[1] && <p>Wholesale: <strong>KES {payload[1]?.value?.toFixed(2)}</strong></p>}
    </div>
  );
};

export function CountyBarChart({ data }: Props) {
  if (!data.length) return (
    <div className="flex items-center justify-center h-48 text-earth/40 text-sm">
      No comparison data available
    </div>
  );

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(28,58,42,0.07)" vertical={false} />
        <XAxis dataKey="county" tick={{ fontSize: 10, fill: "#9CA3AF" }} />
        <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="avg_retail" name="Retail" radius={[6, 6, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
