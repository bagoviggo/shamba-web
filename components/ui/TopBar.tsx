"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatDate } from "@/lib/utils";

export function TopBar() {
  const today = formatDate(new Date().toISOString().split("T")[0]);

  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-earth">
      <div className="flex items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-lime rounded-lg flex items-center justify-center text-sm">🌾</div>
          <div>
            <div className="font-display font-800 text-white text-base leading-none">Shamba AI</div>
            <div className="text-white/50 text-[10px]">Market Intelligence</div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-2.5 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse-slow" />
            <span className="text-white/80 text-[10px]">{today}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
