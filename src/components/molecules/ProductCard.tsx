"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { StarRating } from "@/components/atoms/StarRating";
import { ProductIcon } from "@/components/atoms/icons/ProductIcon";
import type { Product } from "@/domain/types";
import { useLanguageStore } from "@/store/languageStore";
import { useTranslations } from "@/lib/translations";
import { localizeProduct } from "@/lib/productTranslations";
import { formatPrice } from "@/lib/formatPrice";

interface ProductCardProps {
  product: Product;
}

function getBadgeVariant(badge: string | null) {
  if (!badge) return "default";
  const map: Record<string, string> = {
    Sale: "sale",
    New: "new",
    "Staff Pick": "staff",
    "Best Seller": "bestseller",
    "Best Value": "bestseller",
  };
  return (map[badge] as "sale" | "new" | "staff" | "bestseller") ?? "default";
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const locale = useLanguageStore((s) => s.locale);
  const tr = useTranslations(locale);
  const p = localizeProduct(product, locale);

  if (product.comingSoon) {
    return (
      <div className="group bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col opacity-90">
        <div
          className="relative h-56 flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: product.cardColor }}
        >
          <div className="transition-transform duration-300 group-hover:scale-105">
            <ProductIcon iconType={product.iconType} size={105} />
          </div>
          <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-white/90 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-[#2d2926] text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
              Coming Soon
            </span>
          </div>
        </div>
        <div className="p-4 flex flex-col flex-1 gap-1.5">
          {p.tagline && <p className="text-xs text-[#8c7b6e] italic">{p.tagline}</p>}
          <h3 className="font-bold text-[#2d2926] leading-snug">{p.name}</h3>
          <p className="text-xs text-[#8c7b6e] mt-auto pt-1">Available soon</p>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col">
      <Link href={`/shop/${product.slug}`}>
        <div
          className="relative h-56 flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: product.cardColor }}
        >
          <div className="transition-transform duration-300 group-hover:scale-110">
            <ProductIcon iconType={product.iconType} size={105} />
          </div>
          <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-white/90 to-transparent pointer-events-none" />
          {product.badge && (
            <div className="absolute top-3 left-3">
              <Badge label={product.badge} variant={getBadgeVariant(product.badge)} />
            </div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="text-[#8c7b6e] font-medium text-sm">Sold Out</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1 gap-1.5">
        {p.tagline && (
          <p className="text-xs text-[#8c7b6e] italic">{p.tagline}</p>
        )}
        <Link href={`/shop/${p.slug}`}>
          <h3 className="font-bold text-[#2d2926] leading-snug hover:text-[#c17a5a] transition-colors">
            {p.name}
          </h3>
        </Link>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />

        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className="text-lg font-bold text-[#2d2926]">{formatPrice(p.price, locale, p.slug)}</span>
          {p.originalPrice && (
            <span className="text-sm text-[#8c7b6e] line-through">
              {formatPrice(p.originalPrice, locale)}
            </span>
          )}
        </div>

        <Button
          variant="primary"
          size="sm"
          disabled={!product.inStock}
          onClick={() => router.push(`/shop/${product.slug}/customize`)}
          className="w-full mt-1"
        >
          {product.inStock ? tr.product.bookSession : tr.product.outOfStock}
        </Button>
      </div>
    </div>
  );
}
