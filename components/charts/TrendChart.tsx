"use client";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { groupTrendByCounty, CHART_COLORS } from "@/lib/utils";
import type { TrendPoint } from "@/lib/api";

interface Props {
  data: TrendPoint[];
  title?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-earth rounded-xl p-3 shadow-xl text-xs">
      <p className="text-white/60 mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 text-white">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="opacity-70">{p.name}:</span>
          <span className="font-semibold">KES {p.value?.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
};

export function TrendChart({ data, title }: Props) {
  const chartData = groupTrendByCounty(data);
  const counties  = [...new Set(data.map(d => d.county))].slice(0, 6);

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-48 text-earth/40 text-sm">
        No trend data available yet
      </div>
    );
  }

  return (
    <div>
      {title && <p className="text-xs text-earth/50 mb-3">{title}</p>}
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            {counties.map((county, i) => (
              <linearGradient key={county} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.25} />
                <stop offset="95%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(28,58,42,0.07)" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9CA3AF" }} />
          <YAxis tick={{ fontSize: 10, fill: "#9CA3AF" }} />
          <Tooltip content={<CustomTooltip />} />
          {counties.map((county, i) => (
            <Area
              key={county}
              type="monotone"
              dataKey={county}
              stroke={CHART_COLORS[i % CHART_COLORS.length]}
              fill={`url(#grad-${i})`}
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-3 mt-2">
        {counties.map((county, i) => (
          <div key={county} className="flex items-center gap-1.5 text-[11px] text-earth/60">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
            {county}
          </div>
        ))}
      </div>
    </div>
  );
}
