import type { Locale } from "@/store/languageStore";

const USD_TO_KRW = 1350;

const KRW_PRICES: Record<string, number> = {
  "aloe-soothing-mask":           3000,
  "pearl-purifying-mask":         7000,
  "collagen-lifting-mask":        5000,
  "seaweed-balancing-mask":       2000,
  "blueberry-revitalizing-mask":  6000,
  "hyaluronic-acid-hydrating-mask": 4000,
  "lemon-glowing-mask":           3000,
  "honey-nourishing-mask":        5000,
  "chamomile-calming-mask":       2000,
  "rose-rejuvenating-mask":       7000,
  "avocado-moisturizing-mask":    4000,
  "pomegranate-firming-mask":     6000,
};

export function formatPrice(usdPrice: number, locale: Locale, slug?: string): string {
  if (locale === "ko") {
    const krw =
      slug != null && KRW_PRICES[slug] != null
        ? KRW_PRICES[slug]
        : Math.round((usdPrice * USD_TO_KRW) / 1000) * 1000;
    return `₩${krw.toLocaleString("ko-KR")}`;
  }
  return `$${usdPrice.toFixed(2)}`;
}

export function formatTotalPrice(baseUsd: number, addonsUsd: number, locale: Locale, slug?: string): string {
  if (locale === "ko") {
    const base = slug != null && KRW_PRICES[slug] != null
      ? KRW_PRICES[slug]
      : Math.round((baseUsd * USD_TO_KRW) / 1000) * 1000;
    const addons = Math.round((addonsUsd * USD_TO_KRW) / 1000) * 1000;
    return `₩${(base + addons).toLocaleString("ko-KR")}`;
  }
  return `$${(baseUsd + addonsUsd).toFixed(2)}`;
}
