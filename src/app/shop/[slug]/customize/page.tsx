"use client";
import { use, useState, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { ProductIcon } from "@/components/atoms/icons/ProductIcon";
import { Button } from "@/components/atoms/Button";
import { TimePicker } from "@/components/atoms/TimePicker";
import { useCartStore } from "@/store/cartStore";
import products from "@/mocks/products.json";
import type { Product } from "@/domain/types";
import { useLanguageStore } from "@/store/languageStore";
import { useTranslations } from "@/lib/translations";
import { localizeProduct } from "@/lib/productTranslations";
import { formatPrice, formatTotalPrice } from "@/lib/formatPrice";
import type { Locale } from "@/store/languageStore";

const SESSION_OPTIONS = [
  { id: "20min", label: "20 Minutes", detail: "Quick refresh", price: 1.00 },
  { id: "30min", label: "30 Minutes", detail: "Full treatment", price: 2.00 },
];

const CLEANSER_OPTIONS = [
  { id: "none",   label: "No Thanks",       detail: "Skip the cleanser",  price: 0    },
  { id: "bubble", label: "Bubble Cleanser",  detail: "Deep pore cleanse",  price: 0.50 },
];

const MASSAGE_OPTIONS = [
  { id: "normal",  label: "Normal",  detail: "Relaxing & effective",  price: 0    },
  { id: "premium", label: "Premium", detail: "Deep tissue & glow",    price: 0.50 },
];

function OptionCard({
  label,
  detail,
  price,
  selected,
  onClick,
  includedLabel = "Included",
  locale = "en",
}: {
  label: string;
  detail: string;
  price: number;
  selected: boolean;
  onClick: () => void;
  includedLabel?: string;
  locale?: Locale;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 rounded-2xl p-4 text-left border-2 transition-all duration-200 focus:outline-none hover:-translate-y-0.5 active:scale-[0.98]"
      style={{
        backgroundColor: selected ? "#c17a5a" : "#faf6f1",
        borderColor: selected ? "#c17a5a" : "#e8ddd0",
        color: selected ? "white" : "#2d2926",
        boxShadow: selected ? "0 4px 14px rgba(193,122,90,0.25)" : undefined,
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="font-bold text-sm">{label}</p>
        {selected && (
          <span className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center shrink-0 mt-0.5">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </div>
      <p className="text-xs mt-0.5" style={{ opacity: selected ? 0.85 : undefined, color: selected ? undefined : "#8c7b6e" }}>
        {detail}
      </p>
      <p className="text-sm font-semibold mt-2">
        {price === 0 ? includedLabel : `+${formatPrice(price, locale)}`}
      </p>
    </button>
  );
}

export default function CustomizePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const raw = (products as Product[]).find((p) => p.slug === slug);
  if (!raw) notFound();

  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const locale = useLanguageStore((s) => s.locale);
  const tr = useTranslations(locale);
  const product = localizeProduct(raw, locale);
  const opts = tr.customize.options;

  useEffect(() => { document.title = `MasksOrg - ${product.name}`; }, [product.name]);

  const [session,   setSession]   = useState<string | null>(null);
  const [cleanser,  setCleanser]  = useState<string | null>(null);
  const [massage,   setMassage]   = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string>("");

  const sessionPrice  = SESSION_OPTIONS.find((o) => o.id === session)?.price ?? 0;
  const cleanserPrice = CLEANSER_OPTIONS.find((o) => o.id === cleanser)?.price ?? 0;
  const massagePrice  = MASSAGE_OPTIONS.find((o) => o.id === massage)?.price ?? 0;
  const total = product.price + sessionPrice + cleanserPrice + massagePrice;
  const allSelected = session !== null && cleanser !== null && massage !== null && startTime !== "";


  function handleAddToCart() {
    if (!allSelected || !product) return;
    const addOns = [
      `Starts ${startTime}`,
      SESSION_OPTIONS.find((o) => o.id === session)!.label,
      cleanser !== "none" ? "Bubble Cleanser" : null,
      massage === "premium" ? "Premium Massage" : null,
    ].filter(Boolean).join(" · ");

    // Always store English name/description so orders are readable in the admin
    // regardless of the locale the customer was using when they checked out.
    const customProduct: Product = {
      ...(product as Product),
      id: `${product.id}-${session}-${cleanser}-${massage}`,
      name: raw!.name,
      description: `${addOns} | ${raw!.description}`,
      price: total,
      originalPrice: null,
    };

    addItem(customProduct);
    router.push("/cart");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href={`/shop/${slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-[#8c7b6e] hover:text-[#c17a5a] transition-colors mb-8 group"
      >
        <span className="group-hover:-translate-x-0.5 transition-transform inline-block">←</span>
        {tr.customize.backToProduct}
      </Link>
      {/* Product header */}
      <div
        className="rounded-3xl p-8 flex items-center gap-6 mb-10"
        style={{ backgroundColor: product.cardColor }}
      >
        <ProductIcon iconType={product.iconType} size={90} />
        <div>
          <p className="text-xs uppercase tracking-widest text-[#6b4f3a] mb-1">{product.category}</p>
          <h1 className="text-2xl font-bold text-[#2d2926]">{product.name}</h1>
          {product.tagline && (
            <p className="text-sm text-[#6b4f3a] italic mt-0.5">{product.tagline}</p>
          )}
          <p className="text-[#6b4f3a] font-semibold mt-1">{tr.customize.from} {formatPrice(product.price, locale, product.slug)}</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Start time */}
        <div>
          <p className="text-xs uppercase tracking-widest text-[#8c7b6e] mb-3">{tr.customize.startTime}</p>
          <TimePicker value={startTime} onChange={setStartTime} />
        </div>

        {/* Session length */}
        <div>
          <p className="text-xs uppercase tracking-widest text-[#8c7b6e] mb-3">{tr.customize.sessionLength}</p>
          <div className="flex gap-3">
            {SESSION_OPTIONS.map((o) => (
              <OptionCard
                key={o.id}
                label={opts[o.id as keyof typeof opts].label}
                detail={opts[o.id as keyof typeof opts].detail}
                price={o.price}
                includedLabel={tr.customize.included}
                locale={locale}
                selected={session === o.id}
                onClick={() => setSession(o.id)}
              />
            ))}
          </div>
        </div>

        {/* Bubble cleanser */}
        <div>
          <p className="text-xs uppercase tracking-widest text-[#8c7b6e] mb-3">{tr.customize.bubbleCleanser}</p>
          <div className="flex gap-3">
            {CLEANSER_OPTIONS.map((o) => (
              <OptionCard
                key={o.id}
                label={opts[o.id as keyof typeof opts].label}
                detail={opts[o.id as keyof typeof opts].detail}
                price={o.price}
                includedLabel={tr.customize.included}
                locale={locale}
                selected={cleanser === o.id}
                onClick={() => setCleanser(o.id)}
              />
            ))}
          </div>
        </div>

        {/* Massage quality */}
        <div>
          <p className="text-xs uppercase tracking-widest text-[#8c7b6e] mb-3">{tr.customize.massage}</p>
          <div className="flex gap-3">
            {MASSAGE_OPTIONS.map((o) => (
              <OptionCard
                key={o.id}
                label={opts[o.id as keyof typeof opts].label}
                detail={opts[o.id as keyof typeof opts].detail}
                price={o.price}
                includedLabel={tr.customize.included}
                locale={locale}
                selected={massage === o.id}
                onClick={() => setMassage(o.id)}
              />
            ))}
          </div>
        </div>

        {/* Summary — always visible */}
        <div className="border-t border-[#e8ddd0] pt-6 space-y-2 text-sm text-[#6b4f3a]">
          <div className="flex justify-between">
            <span>{product.name}</span>
            <span>{formatPrice(product.price, locale, product.slug)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8c7b6e]">{tr.customize.startTimeSummary}</span>
            <span className={startTime ? "text-[#2d2926]" : "text-[#c8bfb8]"}>{startTime || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8c7b6e]">{tr.customize.sessionLengthSummary}</span>
            <span className={session ? "text-[#2d2926]" : "text-[#c8bfb8]"}>
              {session ? SESSION_OPTIONS.find((o) => o.id === session)!.label : "—"}
            </span>
          </div>
          {cleanserPrice > 0 && (
            <div className="flex justify-between">
              <span className="text-[#8c7b6e]">{tr.customize.bubbleCleanser}</span>
              <span>+{formatPrice(cleanserPrice, locale)}</span>
            </div>
          )}
          {massagePrice > 0 && (
            <div className="flex justify-between">
              <span className="text-[#8c7b6e]">{tr.customize.premiumMassage}</span>
              <span>+{formatPrice(massagePrice, locale)}</span>
            </div>
          )}
          {allSelected && (
            <div className="flex justify-between font-bold text-[#2d2926] text-lg pt-2 border-t border-[#e8ddd0]">
              <span>{tr.customize.total}</span>
              <span>{formatTotalPrice(product.price, sessionPrice + cleanserPrice + massagePrice, locale, product.slug)}</span>
            </div>
          )}
        </div>

        <Button size="lg" className="w-full" disabled={!allSelected} onClick={handleAddToCart}>
          {allSelected ? `${tr.customize.addToCart} — ${formatTotalPrice(product.price, sessionPrice + cleanserPrice + massagePrice, locale, product.slug)}` : tr.customize.selectAll}
        </Button>
      </div>
    </div>
  );
}
