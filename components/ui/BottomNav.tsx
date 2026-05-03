"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart2, MapPin, GitCompare, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/",            label: "Home",     Icon: Home },
  { href: "/markets",     label: "Markets",  Icon: BarChart2 },
  { href: "/counties",    label: "Counties", Icon: MapPin },
  { href: "/compare",     label: "Compare",  Icon: GitCompare },
  { href: "/ai",          label: "Ask AI",   Icon: Bot },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-earth z-50">
      <div className="flex pb-safe">
        {NAV.map(({ href, label, Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-opacity",
                active ? "opacity-100" : "opacity-40 hover:opacity-70"
              )}
            >
              <Icon
                size={20}
                className={active ? "text-leaf" : "text-earth"}
                strokeWidth={active ? 2.5 : 1.8}
              />
              <span className={cn("text-[10px] font-medium", active ? "text-leaf font-semibold" : "text-earth")}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
