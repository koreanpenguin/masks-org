"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/atoms/Button";
import { createOrder } from "@/app/actions/order";
import { validateCoupon, redeemCoupon } from "@/app/actions/game";
import { getCurrentUser } from "@/app/actions/auth";
import { discountedUnitPrice } from "@/lib/discount";
import { useLanguageStore } from "@/store/languageStore";
import { useTranslations } from "@/lib/translations";
import { formatPrice } from "@/lib/formatPrice";

const inputClass = "w-full rounded-xl border border-[#e8ddd0] px-4 py-3 text-[#2d2926] text-sm focus:outline-none focus:border-[#c17a5a] transition-colors";

interface AppliedCoupon {
  code: string;
  discountUsd: number;
  discountKrw: number;
}

function getTodayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const locale = useLanguageStore((s) => s.locale);
  const tr = useTranslations(locale);
  const subtotal = totalPrice();
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");

  // Date picker state
  const todayStr = getTodayStr();
  const [scheduledDate, setScheduledDate] = useState(todayStr);
  const isToday = scheduledDate === todayStr;
  const dateSurchargeUsd = isToday ? 0 : 1;
  const dateSurchargeKrw = isToday ? 0 : 1000;

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    document.title = "MasksOrg - Checkout";
    getCurrentUser().then((user) => {
      if (!user) return;
      setFirstName((prev) => prev || user.name.split(" ")[0]);
      setEmail((prev) => prev || user.email);
    });
  }, []);

  const discountUsd = appliedCoupon?.discountUsd ?? 0;
  const discountKrw = appliedCoupon?.discountKrw ?? 0;
  const total = Math.max(0, subtotal - discountUsd + dateSurchargeUsd);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-[#2d2926] mb-4">{tr.checkout.emptyTitle}</h1>
        <Link href="/shop"><Button size="lg">{tr.checkout.browseMasks}</Button></Link>
      </div>
    );
  }

  async function applyCoupon() {
    setCouponLoading(true);
    setCouponError("");
    const result = await validateCoupon(couponInput.trim().toUpperCase());
    if (result.valid) {
      setAppliedCoupon({ code: couponInput.trim().toUpperCase(), discountUsd: result.discountUsd, discountKrw: result.discountKrw });
      setCouponInput("");
    } else {
      setCouponError(result.error ?? "Invalid coupon");
    }
    setCouponLoading(false);
  }

  async function handlePay() {
    if (!firstName.trim() || !email.trim()) return;
    setLoading(true);
    const orderItems = items.map(({ product, quantity }) => ({
      name: product.name,
      description: product.description ?? "",
      quantity,
      price: discountedUnitPrice(product.price, quantity),
    }));
    await createOrder(orderItems, total, firstName.trim(), email.trim(), scheduledDate);
    if (appliedCoupon) {
      await redeemCoupon(appliedCoupon.code);
    }
    const slugs = [...new Set(items.map(({ product }) => product.slug))].join(",");
    clearCart();
    router.push(`/checkout/success?products=${slugs}`);
  }

  const canPay = firstName.trim() !== "" && email.trim() !== "";

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-10 text-xs uppercase tracking-widest text-[#8c7b6e]">
        <span className="text-[#c8bfb8] line-through">{tr.checkout.stepCart}</span>
        <span className="text-[#e8ddd0]">——</span>
        <span className="text-[#c17a5a] font-bold">{tr.checkout.stepCheckout}</span>
        <span className="text-[#e8ddd0]">——</span>
        <span>{tr.checkout.stepConfirmation}</span>
      </div>

      <h1 className="text-3xl font-bold text-[#2d2926] mb-8">{tr.checkout.heading}</h1>

      {/* Contact info */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="text-sm uppercase tracking-widest text-[#8c7b6e] mb-4">{tr.checkout.yourDetails}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#8c7b6e] mb-1.5">{tr.checkout.firstName}</label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={tr.checkout.firstNamePlaceholder}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#8c7b6e] mb-1.5">{tr.checkout.email}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={tr.checkout.emailPlaceholder}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Session date */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="text-sm uppercase tracking-widest text-[#8c7b6e] mb-4">
          📅 {locale === "ko" ? "세션 날짜" : "Session Date"}
        </h2>
        <input
          type="date"
          value={scheduledDate}
          min={todayStr}
          onChange={(e) => setScheduledDate(e.target.value || todayStr)}
          className={`${inputClass} cursor-pointer`}
        />
        {!isToday && (
          <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
            <span>⚠️</span>
            {locale === "ko"
              ? `오늘 이후 날짜는 예약 수수료 ₩${dateSurchargeKrw.toLocaleString("ko-KR")}이 추가됩니다.`
              : `A $${dateSurchargeUsd.toFixed(2)} booking fee applies for future dates.`}
          </p>
        )}
      </div>

      {/* Coupon code */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="text-sm uppercase tracking-widest text-[#8c7b6e] mb-4">
          🎰 {locale === "ko" ? "쿠폰 코드" : "Coupon Code"}
        </h2>
        {appliedCoupon ? (
          <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[#f0fdf4] border border-[#86efac]">
            <div className="flex items-center gap-2">
              <span className="text-green-500 text-lg">✓</span>
              <code className="font-bold text-green-700 tracking-widest text-sm">{appliedCoupon.code}</code>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-green-700 font-semibold text-sm">
                -{locale === "ko"
                  ? `₩${discountKrw.toLocaleString("ko-KR")}`
                  : `$${discountUsd.toFixed(2)}`}
              </span>
              <button
                onClick={() => setAppliedCoupon(null)}
                className="text-xs text-[#8c7b6e] hover:text-red-500 transition-colors underline underline-offset-2"
              >
                {locale === "ko" ? "제거" : "Remove"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="MASKS-XXXXX"
                value={couponInput}
                onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                onKeyDown={(e) => e.key === "Enter" && couponInput.trim() && applyCoupon()}
                className={`${inputClass} flex-1 font-mono tracking-wider`}
              />
              <button
                onClick={applyCoupon}
                disabled={couponLoading || !couponInput.trim()}
                className="shrink-0 px-5 py-3 rounded-xl bg-[#c17a5a] text-white font-semibold text-sm hover:bg-[#a8654a] transition-colors disabled:opacity-40"
              >
                {couponLoading ? "…" : locale === "ko" ? "적용" : "Apply"}
              </button>
            </div>
            {couponError && (
              <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                <span>✕</span> {couponError}
              </p>
            )}
            <p className="text-xs text-[#8c7b6e] mt-2">
              {locale === "ko"
                ? "MasksOrgEry 게임에서 받은 코드를 입력하세요."
                : "Enter a code from the MasksOrgEry scratch game."}
            </p>
          </>
        )}
      </div>

      {/* Order summary */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="text-sm uppercase tracking-widest text-[#8c7b6e] mb-4">{tr.checkout.orderSummary}</h2>
        <div className="space-y-3">
          {items.map(({ product, quantity }) => {
            const unitPrice = discountedUnitPrice(product.price, quantity);
            return (
              <div key={product.id} className="flex justify-between text-sm text-[#6b4f3a]">
                <div>
                  <p className="font-medium text-[#2d2926]">{product.name} × {quantity}</p>
                  {product.description && (
                    <p className="text-xs text-[#8c7b6e] mt-0.5">{product.description}</p>
                  )}
                </div>
                <span className="font-medium ml-4 shrink-0">{formatPrice(unitPrice * quantity, locale)}</span>
              </div>
            );
          })}
        </div>

        {appliedCoupon && (
          <div className="mt-3 flex justify-between text-sm text-green-600 font-medium">
            <span>{locale === "ko" ? "쿠폰 할인" : "Coupon discount"} ({appliedCoupon.code})</span>
            <span>
              -{locale === "ko"
                ? `₩${discountKrw.toLocaleString("ko-KR")}`
                : `$${discountUsd.toFixed(2)}`}
            </span>
          </div>
        )}

        {!isToday && (
          <div className="mt-3 flex justify-between text-sm text-amber-600 font-medium">
            <span>
              {locale === "ko" ? "예약 수수료" : "Booking fee"}
              {" "}
              <span className="text-xs font-normal text-[#8c7b6e]">
                ({locale === "ko"
                  ? new Date(scheduledDate + "T00:00:00").toLocaleDateString("ko-KR", { month: "long", day: "numeric" })
                  : new Date(scheduledDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })})
              </span>
            </span>
            <span>+{locale === "ko" ? `₩${dateSurchargeKrw.toLocaleString("ko-KR")}` : `$${dateSurchargeUsd.toFixed(2)}`}</span>
          </div>
        )}

        <div className="border-t border-[#e8ddd0] mt-4 pt-4 flex justify-between font-bold text-[#2d2926] text-lg">
          <span>{tr.checkout.total}</span>
          <span>{formatPrice(total, locale)}</span>
        </div>
      </div>

      {/* Payment method */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
        <h2 className="text-sm uppercase tracking-widest text-[#8c7b6e] mb-4">{tr.checkout.paymentMethod}</h2>
        <div
          className="flex items-center gap-4 rounded-xl border-2 p-4"
          style={{ borderColor: "#c17a5a", backgroundColor: "#fdf8f4" }}
        >
          <div
            className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
            style={{ borderColor: "#c17a5a" }}
          >
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#c17a5a" }} />
          </div>
          <div>
            <p className="font-semibold text-[#2d2926]">{tr.checkout.cash}</p>
            <p className="text-xs text-[#8c7b6e] mt-0.5">{tr.checkout.cashDetail}</p>
          </div>
        </div>
      </div>

      <Button size="lg" className="w-full" onClick={handlePay} disabled={loading || !canPay}>
        {loading ? tr.checkout.placing : `${tr.checkout.confirm} — ${formatPrice(total, locale)}`}
      </Button>
      <Link href="/cart">
        <Button variant="ghost" size="md" className="w-full mt-2">{tr.checkout.backToCart}</Button>
      </Link>
    </div>
  );
}
