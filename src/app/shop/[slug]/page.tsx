import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { StarRating } from "@/components/atoms/StarRating";
import { ProductIcon } from "@/components/atoms/icons/ProductIcon";
import { getProductsWithOverrides } from "@/lib/products";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import { localizeProduct } from "@/lib/productTranslations";
import { formatPrice } from "@/lib/formatPrice";
import { ReviewSection } from "./ReviewSection";
import type { ReviewData } from "./ReviewSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const products = await getProductsWithOverrides();
  const product = products.find((p) => p.slug === slug);
  return { title: product?.name ?? "Product" };
}

function getBadgeVariant(badge: string | null) {
  if (!badge) return "default" as const;
  const map: Record<string, "sale" | "new" | "staff" | "bestseller"> = {
    Sale: "sale", New: "new", "Staff Pick": "staff", "Best Seller": "bestseller",
  };
  return map[badge] ?? ("default" as const);
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const tr = t[locale];

  const [products, session, rawReviews] = await Promise.all([
    getProductsWithOverrides(),
    getSession(),
    prisma.review.findMany({
      where: { productId: slug },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const raw = products.find((p) => p.slug === slug);
  if (!raw) notFound();
  const product = localizeProduct(raw, locale);

  const reviews: ReviewData[] = rawReviews.map((r) => ({
    id: r.id,
    userName: r.userName,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link
        href="/shop"
        className="inline-flex items-center gap-1.5 text-sm text-[#8c7b6e] hover:text-[#c17a5a] transition-colors mb-8 group"
      >
        <span className="group-hover:-translate-x-0.5 transition-transform inline-block">←</span>
        {tr.product.backToShop}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image */}
        <div
          className="relative rounded-3xl h-80 md:h-auto flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: product.cardColor }}
        >
          <ProductIcon iconType={product.iconType} size={200} />
          <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-[#faf6f1]/70 to-transparent pointer-events-none" />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#8c7b6e] mb-1">{product.category}</p>
              <h1 className="text-3xl font-bold text-[#2d2926]">{product.name}</h1>
              {product.tagline && (
                <p className="text-sm text-[#8c7b6e] italic mt-0.5">{product.tagline}</p>
              )}
            </div>
            {product.badge && (
              <Badge label={product.badge} variant={getBadgeVariant(product.badge)} />
            )}
          </div>

          <StarRating rating={product.rating} reviewCount={product.reviewCount} />

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-[#2d2926]">{formatPrice(product.price, locale, product.slug)}</span>
            {product.originalPrice && (
              <span className="text-lg text-[#8c7b6e] line-through">
                {formatPrice(product.originalPrice, locale)}
              </span>
            )}
          </div>

          <p className="text-[#8c7b6e] leading-relaxed">{product.description}</p>

          <div>
            <p className="text-xs uppercase tracking-widest text-[#8c7b6e] mb-2">{tr.product.bestFor}</p>
            <div className="flex flex-wrap gap-2">
              {product.skinType.map((type) => (
                <span
                  key={type}
                  className="px-3 py-1 text-sm rounded-full bg-[#f0e8dd] text-[#6b4f3a]"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          {product.inStock ? (
            <Link href={`/shop/${product.slug}/customize`} className="mt-2">
              <Button size="lg" className="w-full">{tr.product.bookSession}</Button>
            </Link>
          ) : (
            <Button size="lg" disabled className="mt-2">{tr.product.outOfStock}</Button>
          )}

          <div className="border-t border-[#e8ddd0] pt-4 mt-2">
            <p className="text-xs uppercase tracking-widest text-[#8c7b6e] mb-2">{tr.product.howToUse}</p>
            <p className="text-sm text-[#6b4f3a] leading-relaxed">{product.howToUse}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-[#8c7b6e] mb-2">{tr.product.keyIngredients}</p>
            <div className="flex flex-wrap gap-2">
              {product.ingredients.map((ing) => (
                <span
                  key={ing}
                  className="px-2 py-0.5 text-xs rounded-full border border-[#e8ddd0] text-[#6b4f3a]"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ReviewSection
        productSlug={slug}
        reviews={reviews}
        userName={session?.name?.split(" ")[0] ?? ""}
        locale={locale}
      />
    </div>
  );
}
