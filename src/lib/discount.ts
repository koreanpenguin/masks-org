export const DISCOUNT_TIERS = [
  { min: 1,  max: 5,        rate: 0,    label: "Regular" },
  { min: 6,  max: 11,       rate: 0.10, label: "Save 10%" },
  { min: 12, max: 23,       rate: 0.15, label: "Save 15%" },
  { min: 24, max: Infinity,  rate: 0.20, label: "Save 20%" },
] as const;

export function getDiscountRate(qty: number): number {
  if (qty >= 24) return 0.20;
  if (qty >= 12) return 0.15;
  if (qty >= 6)  return 0.10;
  return 0;
}

export function discountedUnitPrice(basePrice: number, qty: number): number {
  return basePrice * (1 - getDiscountRate(qty));
}
