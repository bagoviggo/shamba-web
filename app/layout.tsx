import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { BottomNav } from "@/components/ui/BottomNav";
import { TopBar } from "@/components/ui/TopBar";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Shamba AI — Kenya Market Prices",
  description: "Real-time agricultural commodity prices across Kenya's 47 counties",
  manifest: "/manifest.json",
  themeColor: "#1C3A2A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="bg-warm font-body text-gray-900 antialiased">
        <Providers>
          <div className="mx-auto max-w-[430px] min-h-screen bg-warm relative">
            <TopBar />
            <main className="pb-24 pt-16">{children}</main>
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
