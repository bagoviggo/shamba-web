import { TrendingUp, TrendingDown } from "lucide-react";
import { cn, formatChange } from "@/lib/utils";

export function ChangeBadge({ pct, className }: { pct: number; className?: string }) {
  const up = pct >= 0;
  return (
    <span className={cn("chip text-xs", up ? "up" : "down", className)}>
      {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
      {formatChange(pct)}
    </span>
  );
}
