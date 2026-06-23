"use client";
import { useState, useMemo } from "react";
import { ProductCard } from "@/components/molecules/ProductCard";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/domain/types";
import { useLanguageStore } from "@/store/languageStore";
import { useTranslations } from "@/lib/translations";

const BRANDS = ["All", "Vespro", "ZealSea"] as const;
type Brand = typeof BRANDS[number];

export function ShopContent({ products }: { products: Product[] }) {
  const locale = useLanguageStore((s) => s.locale);
  const tr = useTranslations(locale);
  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "rating">(
    (searchParams.get("sort") as "price-asc" | "price-desc" | "rating") ?? "default"
  );
  const [brand, setBrand] = useState<Brand>("All");

  const filtered = useMemo(() => {
    let list = [...products];
    if (brand !== "All") list = list.filter((p) => p.brand === brand);
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, sortBy, brand]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold text-[#2d2926] mb-2">{tr.shop.heading}</h1>
          <p className="text-[#8c7b6e]">
            {filtered.length} {filtered.length === 1 ? tr.shop.product : tr.shop.products}
          </p>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="text-sm border border-[#e8ddd0] rounded-full px-4 py-1.5 text-[#6b4f3a] bg-white focus:outline-none focus:ring-1 focus:ring-[#c17a5a]"
        >
          <option value="default">{tr.shop.sortFeatured}</option>
          <option value="price-asc">{tr.shop.sortPriceLow}</option>
          <option value="price-desc">{tr.shop.sortPriceHigh}</option>
          <option value="rating">{tr.shop.sortRated}</option>
        </select>
      </div>

      {/* Brand filters */}
      <div className="flex gap-2 mb-8">
        {BRANDS.map((b) => (
          <button
            key={b}
            onClick={() => setBrand(b)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 border ${
              brand === b
                ? "bg-[#c17a5a] text-white border-[#c17a5a] shadow-sm"
                : "bg-white text-[#6b4f3a] border-[#e8ddd0] hover:border-[#c17a5a]/50"
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-xl font-bold text-[#2d2926] mb-2">
            {locale === "ko" ? "제품을 찾을 수 없어요" : "No products found"}
          </p>
          <p className="text-[#8c7b6e] mb-6">
            {locale === "ko" ? "다른 필터를 시도해보세요." : "Try a different filter."}
          </p>
          <button
            onClick={() => setBrand("All")}
            className="px-6 py-2.5 rounded-xl bg-[#c17a5a] text-white font-semibold text-sm hover:bg-[#a8654a] transition-colors"
          >
            {locale === "ko" ? "필터 초기화" : "Clear filters"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
