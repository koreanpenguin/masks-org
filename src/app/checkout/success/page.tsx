import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Order Confirmed" };
import { Button } from "@/components/atoms/Button";
import { getProductsWithOverrides } from "@/lib/products";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/translations";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ products?: string }>;
}) {
  const { products: slugParam } = await searchParams;
  const locale = await getLocale();
  const tr = t[locale];
  const slugs = slugParam ? slugParam.split(",").filter(Boolean) : [];

  const orderedProducts =
    slugs.length > 0
      ? (await getProductsWithOverrides()).filter((p) => slugs.includes(p.slug))
      : [];

  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="w-24 h-24 rounded-full bg-[#f0e8dd] flex items-center justify-center mx-auto mb-8 animate-[pop-in_0.5s_cubic-bezier(0.34,1.56,0.64,1)_both]">
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          <path d="M10 22L18 30L34 14" stroke="#c17a5a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 className="text-4xl font-bold text-[#2d2926] mb-3">{tr.success.title}</h1>
      <p className="text-[#8c7b6e] leading-relaxed mb-8 max-w-sm mx-auto">
        {tr.success.body}
      </p>

      <div className="bg-white rounded-2xl p-6 mb-10 text-left shadow-sm space-y-3">
        <div className="flex items-start gap-3">
          <span className="text-[#c17a5a] text-lg mt-0.5">1.</span>
          <p className="text-sm text-[#6b4f3a]">{tr.success.step1}</p>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-[#c17a5a] text-lg mt-0.5">2.</span>
          <p className="text-sm text-[#6b4f3a]">{tr.success.step2}</p>
        </div>
        <div className="flex items-start gap-3">
          <span className="text-[#c17a5a] text-lg mt-0.5">3.</span>
          <p className="text-sm text-[#6b4f3a]">{tr.success.step3}</p>
        </div>
      </div>

      {/* Review prompt */}
      {orderedProducts.length > 0 && (
        <div className="mb-10">
          <div className="border-t border-[#e8ddd0] pt-10 mb-6">
            <h2 className="text-xl font-bold text-[#2d2926] mb-1">{tr.success.reviewPromptTitle}</h2>
            <p className="text-sm text-[#8c7b6e]">{tr.success.reviewPromptBody}</p>
          </div>
          <div className="space-y-3">
            {orderedProducts.map((product) => (
              <Link
                key={product.slug}
                href={`/shop/${product.slug}#reviews`}
                className="flex items-center justify-between gap-4 bg-white rounded-2xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3 text-left">
                  <div
                    className="w-9 h-9 rounded-xl shrink-0"
                    style={{ backgroundColor: product.cardColor }}
                  />
                  <p className="font-semibold text-[#2d2926] text-sm">{product.name}</p>
                </div>
                <span className="text-xs text-[#c17a5a] font-medium shrink-0 group-hover:underline">
                  {tr.success.writeReview}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Link href="/shop">
        <Button size="lg">{tr.success.browseMasks}</Button>
      </Link>
    </div>
  );
}
