import productsJson from "@/mocks/products.json";
import type { Product } from "@/domain/types";
import { prisma } from "@/lib/db";

interface OverrideData {
  featured?: boolean;
  badge?: string | null;
  inStock?: boolean;
  price?: number;
  originalPrice?: number | null;
  comingSoon?: boolean;
}

export async function getProductsWithOverrides(): Promise<Product[]> {
  const overrides = await prisma.productOverride.findMany();
  const overrideMap = new Map(
    overrides.map((o) => [o.id, JSON.parse(o.data) as OverrideData])
  );

  return (productsJson as Product[]).map((p) => {
    const o = overrideMap.get(p.id) ?? {};
    return {
      ...p,
      featured: o.featured ?? false,
      badge: "badge" in o ? (o.badge ?? null) : p.badge,
      inStock: "inStock" in o ? o.inStock! : p.inStock,
      price: "price" in o ? o.price! : p.price,
      originalPrice: "originalPrice" in o ? (o.originalPrice ?? null) : p.originalPrice,
      comingSoon: "comingSoon" in o ? o.comingSoon : p.comingSoon ?? false,
    };
  });
}
