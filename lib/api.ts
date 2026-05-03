const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function apiFetch<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
    });
  }
  const res = await fetch(url.toString(), { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}

// ── Types ──────────────────────────────────────────────────────────────────

export interface PriceRecord {
  id: number;
  commodity: string;
  classification: string | null;
  grade: string | null;
  market: string;
  county: string;
  wholesale_price: number | null;
  retail_price: number | null;
  price_unit: string | null;
  supply_volume: number | null;
  recorded_date: string;
}

export interface PriceListResponse {
  total: number;
  page: number;
  limit: number;
  data: PriceRecord[];
}

export interface DailyResponse {
  date: string;
  count: number;
  data: PriceRecord[];
}

export interface TrendPoint {
  recorded_date: string;
  county: string;
  avg_retail: number | null;
  avg_wholesale: number | null;
  total_supply: number | null;
  data_points: number;
}

export interface CountyCompare {
  county: string;
  avg_retail: number | null;
  avg_wholesale: number | null;
  latest_date: string | null;
  market_count: number;
}

export interface Mover {
  commodity: string;
  county: string;
  market: string;
  retail_price: number;
  price_unit: string | null;
  prev_price: number;
  change_pct: number;
}

export interface CommoditySummary {
  commodity: string;
  latest_date: string | null;
  avg_retail: number | null;
  avg_wholesale: number | null;
  market_count: number;
  county_count: number;
}

export interface CommodityDetail {
  summary: {
    commodity: string;
    latest_date: string | null;
    avg_retail: number | null;
    avg_wholesale: number | null;
    min_retail: number | null;
    max_retail: number | null;
    market_count: number;
    county_count: number;
  };
  latest_prices: PriceRecord[];
}

export interface CountySummary {
  county: string;
  market_count: number;
  commodity_count: number;
  latest_date: string | null;
}

export interface StatsSummary {
  latest_date: string | null;
  total_records: number;
  county_count: number;
  commodity_count: number;
  top_movers: Mover[];
  last_scrape: {
    run_at: string;
    status: string;
    records_inserted: number;
    records_skipped: number;
    duration_seconds: number;
  } | null;
}

// ── API calls ──────────────────────────────────────────────────────────────

export const api = {
  // Prices
  getPrices: (params?: Record<string, string | number>) =>
    apiFetch<PriceListResponse>("/api/v1/prices", params),

  getDailyPrices: (params?: { county?: string; commodity?: string }) =>
    apiFetch<DailyResponse>("/api/v1/prices/daily", params as Record<string, string>),

  getTrend: (name: string, days = 30) =>
    apiFetch<TrendPoint[]>(`/api/v1/prices/commodity/${encodeURIComponent(name)}/trend`, { days }),

  compareCounties: (commodity: string, counties: string[], days = 7) =>
    apiFetch<CountyCompare[]>("/api/v1/prices/compare", {
      commodity, counties: counties.join(","), days,
    }),

  getMovers: (limit = 10) =>
    apiFetch<Mover[]>("/api/v1/prices/movers", { limit }),

  // Commodities
  getCommodities: () =>
    apiFetch<CommoditySummary[]>("/api/v1/commodities"),

  getCommodity: (name: string) =>
    apiFetch<CommodityDetail>(`/api/v1/commodities/${encodeURIComponent(name)}`),

  // Counties
  getCounties: () =>
    apiFetch<CountySummary[]>("/api/v1/counties"),

  getCountyPrices: (name: string, commodity?: string) =>
    apiFetch<{ county: string; count: number; data: PriceRecord[] }>(
      `/api/v1/counties/${encodeURIComponent(name)}/prices`,
      commodity ? { commodity } : undefined,
    ),

  getCountyMarkets: (name: string) =>
    apiFetch<{ county: string; markets: { market: string; commodity_count: number; latest_date: string }[] }>(
      `/api/v1/counties/${encodeURIComponent(name)}/markets`,
    ),

  // Stats
  getSummary: () =>
    apiFetch<StatsSummary>("/api/v1/stats/summary"),
};
