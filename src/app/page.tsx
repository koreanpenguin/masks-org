import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: { absolute: "MasksOrg - Home" } };
import { ProductCard } from "@/components/molecules/ProductCard";
import { Button } from "@/components/atoms/Button";
import { LeafIcon } from "@/components/atoms/icons/LeafIcon";
import { BunnyIcon } from "@/components/atoms/icons/BunnyIcon";
import { EcoIcon } from "@/components/atoms/icons/EcoIcon";
import { VideoAd } from "@/components/molecules/VideoAd";
import { getProductsWithOverrides } from "@/lib/products";
import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/translations";

export default async function HomePage() {
  const locale = await getLocale();
  const tr = t[locale];

  const [allProducts, topReviews] = await Promise.all([
    getProductsWithOverrides(),
    prisma.review.findMany({
      orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
      take: 5,
    }),
  ]);
  const explicitlyFeatured = allProducts.filter((p) => p.featured);
  const featured = explicitlyFeatured.length > 0 ? explicitlyFeatured : allProducts.slice(0, 3);
  const productMap = Object.fromEntries(allProducts.map((p) => [p.slug, p.name]));

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-cream via-[#f0e8dd] to-[#faf6f1] py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cream/60 via-transparent to-cream/60 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#c17a5a]/10 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#c17a5a]/8 blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative">
          <p className="text-xs uppercase tracking-[0.2em] text-[#c17a5a] mb-5 font-medium">{tr.home.pill}</p>
          <h1 className="text-5xl md:text-7xl font-bold text-[#2d2926] leading-tight mb-6">
            {tr.home.heroLine1} <br />
            <span className="text-[#c17a5a]">{tr.home.heroLine2}</span>
          </h1>
          <p className="text-lg text-[#8c7b6e] leading-relaxed mb-10 max-w-xl mx-auto">
            {tr.home.heroBody}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/shop">
              <Button size="lg">{tr.home.shopAll}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits strip */}
      <section className="bg-gradient-to-b from-white to-[#faf6f1] border-b border-[#e8ddd0] py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-8 text-center text-sm text-[#6b4f3a]">
          <div className="flex flex-col items-center gap-2">
            <LeafIcon size={36} />
            <span className="font-medium">{tr.home.natural}</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <BunnyIcon size={36} />
            <span className="font-medium">{tr.home.crueltyFree}</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <EcoIcon size={36} />
            <span className="font-medium">{tr.home.eco}</span>
          </div>
        </div>
      </section>

      {/* Video ad */}
      <section className="px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <VideoAd />
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#2d2926] mb-2">{tr.home.featured}</h2>
          <p className="text-[#8c7b6e]">{tr.home.featuredSub}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/shop">
            <Button variant="outline" size="lg">{tr.home.viewAll}</Button>
          </Link>
        </div>
      </section>

      {/* Top reviews */}
      {topReviews.length > 0 && (
        <section className="bg-gradient-to-b from-[#f0e8dd] to-[#faf6f1] py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-[#2d2926] mb-2">{tr.home.reviewsHeading}</h2>
              <p className="text-[#8c7b6e]">{tr.home.reviewsSub}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg key={s} width="16" height="16" viewBox="0 0 20 20" fill={s <= review.rating ? "#c17a5a" : "#e8ddd0"}>
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  {/* Comment */}
                  <p className="text-sm text-[#6b4f3a] leading-relaxed flex-1">&ldquo;{review.comment}&rdquo;</p>
                  {/* Reviewer + product */}
                  <div className="border-t border-[#f0e8dd] pt-3 flex items-center justify-between gap-2">
                    <p className="font-semibold text-[#2d2926] text-sm">{review.userName}</p>
                    {productMap[review.productId] && (
                      <Link
                        href={`/shop/${review.productId}`}
                        className="text-xs text-[#8c7b6e] hover:text-[#c17a5a] transition-colors truncate max-w-[140px]"
                      >
                        {productMap[review.productId]}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
