"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { TimePicker } from "@/components/atoms/TimePicker";
import { createOrder } from "@/app/actions/order";
import { validateCoupon, redeemCoupon } from "@/app/actions/game";
import type { Product } from "@/domain/types";
import { useLanguageStore } from "@/store/languageStore";
import { MiniCalendar } from "@/app/checkout/MiniCalendar";

const SESSION_OPTIONS = [
  { id: "20min", label: "20 Minutes", detail: "Quick refresh", price: 1.00 },
  { id: "30min", label: "30 Minutes", detail: "Full treatment", price: 2.00 },
];
const CLEANSER_OPTIONS = [
  { id: "none",   label: "No Thanks",      detail: "Skip cleanser",     price: 0    },
  { id: "bubble", label: "Bubble Cleanser", detail: "Deep pore cleanse", price: 0.50 },
];
const MASSAGE_OPTIONS = [
  { id: "normal",  label: "Normal",  detail: "Relaxing & effective", price: 0    },
  { id: "premium", label: "Premium", detail: "Deep tissue & glow",   price: 0.50 },
];

function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

interface AppliedCoupon {
  code: string;
  discountUsd: number;
}

const inputClass = "w-full rounded-xl border border-[#e8ddd0] px-4 py-3 text-[#2d2926] text-sm focus:outline-none focus:border-[#c17a5a] transition-colors bg-white";

function Pill({ label, detail, price, selected, onClick }: {
  label: string; detail: string; price: number; selected: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 rounded-xl p-3 text-left border-2 transition-all duration-150 focus:outline-none"
      style={{
        backgroundColor: selected ? "#c17a5a" : "#faf6f1",
        borderColor: selected ? "#c17a5a" : "#e8ddd0",
        color: selected ? "white" : "#2d2926",
      }}
    >
      <p className="font-semibold text-sm">{label}</p>
      <p className="text-xs mt-0.5" style={{ opacity: selected ? 0.85 : undefined, color: selected ? undefined : "#8c7b6e" }}>{detail}</p>
      <p className="text-sm font-bold mt-1">{price === 0 ? "Included" : `+$${price.toFixed(2)}`}</p>
    </button>
  );
}

// Strings for the customer-facing confirm overlay (bilingual)
const confirmTr = {
  en: {
    brand: "MasksOrg",
    heading: "Your Order",
    sub: "Please review the details below before confirming.",
    customer: "Customer",
    walkIn: "Walk-in Customer",
    payMethod: "Payment",
    payDetail: "Cash — pay at the time of your session",
    total: "Total",
    confirm: "Confirm & Book",
    confirming: "Confirming…",
    back: "← Go Back",
    doneTitle: "You're all booked!",
    doneSub: "Your session is confirmed. We'll see you soon!",
    doneStep1: "Arrive a few minutes early.",
    doneStep2: "Bring cash for payment.",
    doneStep3: "Sit back and let your skin glow.",
    newOrder: "New Order",
    backAdmin: "Back to Admin",
  },
  ko: {
    brand: "MasksOrg",
    heading: "주문 확인",
    sub: "아래 내용을 확인하고 예약을 완료해주세요.",
    customer: "고객",
    walkIn: "방문 고객",
    payMethod: "결제 방법",
    payDetail: "현금 — 세션 당일에 직접 지불",
    total: "합계",
    confirm: "확인 & 예약",
    confirming: "처리 중…",
    back: "← 돌아가기",
    doneTitle: "예약 완료!",
    doneSub: "세션이 확정됐어요. 곧 뵙겠습니다!",
    doneStep1: "몇 분 일찍 도착해주세요.",
    doneStep2: "현금을 준비해 오세요.",
    doneStep3: "편하게 앉아 피부가 빛나도록 기다리세요.",
    newOrder: "새 주문",
    backAdmin: "관리자로 돌아가기",
  },
};

export function NewOrderForm({ products }: { products: Product[] }) {
  const router = useRouter();
  const locale = useLanguageStore((s) => s.locale);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [session,   setSession]   = useState<string | null>(null);
  const [cleanser,  setCleanser]  = useState<string | null>(null);
  const [massage,   setMassage]   = useState<string | null>(null);
  const [startTime, setStartTime] = useState("");
  const [customerName,  setCustomerName]  = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [phase, setPhase] = useState<"editing" | "confirming" | "placed">("editing");
  const [loading, setLoading] = useState(false);
  const [confirmLocale, setConfirmLocale] = useState<"en" | "ko">("en");

  // Date picker
  const todayStr = getTodayStr();
  const [scheduledDate, setScheduledDate] = useState(todayStr);
  const isToday = scheduledDate === todayStr;
  const dateSurcharge = isToday ? 0 : 1;

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const sessionPrice  = SESSION_OPTIONS.find((o) => o.id === session)?.price ?? 0;
  const cleanserPrice = CLEANSER_OPTIONS.find((o) => o.id === cleanser)?.price ?? 0;
  const massagePrice  = MASSAGE_OPTIONS.find((o) => o.id === massage)?.price ?? 0;
  const basePrice = selectedProduct?.price ?? 0;
  const subtotal = basePrice + sessionPrice + cleanserPrice + massagePrice + dateSurcharge;
  const discountUsd = appliedCoupon?.discountUsd ?? 0;
  const total = Math.max(0, subtotal - discountUsd);

  const allSelected = selectedProduct !== null && session !== null && cleanser !== null && massage !== null && startTime !== "";

  const addOns = allSelected
    ? [
        `Starts ${startTime}`,
        SESSION_OPTIONS.find((o) => o.id === session)!.label,
        cleanser !== "none" ? "Bubble Cleanser" : null,
        massage === "premium" ? "Premium Massage" : null,
      ].filter(Boolean).join(" · ")
    : "";

  async function applyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    setCouponLoading(true);
    setCouponError("");
    const result = await validateCoupon(code);
    if (result.valid) {
      setAppliedCoupon({ code, discountUsd: result.discountUsd });
      setCouponInput("");
    } else {
      setCouponError(result.error ?? "Invalid coupon");
    }
    setCouponLoading(false);
  }

  function handleSendToCustomer() {
    if (!allSelected) return;
    setConfirmLocale(locale as "en" | "ko");
    setPhase("confirming");
  }

  async function handleConfirm() {
    if (!allSelected || !selectedProduct) return;
    setLoading(true);
    await createOrder(
      [{ name: selectedProduct.name, description: addOns, quantity: 1, price: total }],
      total,
      customerName.trim() || "Walk-in Customer",
      customerEmail.trim() || "",
      scheduledDate,
    );
    if (appliedCoupon) await redeemCoupon(appliedCoupon.code);
    setLoading(false);
    setPhase("placed");
  }

  function reset() {
    setSelectedProduct(null);
    setSession(null);
    setCleanser(null);
    setMassage(null);
    setStartTime("");
    setCustomerName("");
    setCustomerEmail("");
    setCouponInput("");
    setAppliedCoupon(null);
    setCouponError("");
    setScheduledDate(getTodayStr());
    setPhase("editing");
  }

  // Full-screen customer overlay (covers header/footer entirely)
  if (phase === "confirming" || phase === "placed") {
    const tr = confirmTr[confirmLocale];
    return (
      <div className="fixed inset-0 z-[9999] bg-[#faf6f1] overflow-auto flex flex-col">
        {/* Toggle locale inside the overlay */}
        <div className="flex justify-end px-6 pt-5">
          <button
            onClick={() => setConfirmLocale((l) => l === "en" ? "ko" : "en")}
            className="text-xs font-semibold px-3 py-1.5 rounded-full border border-[#e8ddd0] text-[#8c7b6e] hover:border-[#c17a5a] hover:text-[#c17a5a] transition-colors"
          >
            {confirmLocale === "en" ? "한국어" : "English"}
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          {phase === "confirming" ? (
            <div className="w-full max-w-sm animate-fade-up">
              {/* Brand mark */}
              <div className="text-center mb-8">
                <p className="text-xs uppercase tracking-[0.2em] text-[#c17a5a] font-medium mb-1">{tr.brand}</p>
                <h1 className="text-3xl font-bold text-[#2d2926]">{tr.heading}</h1>
                <p className="text-sm text-[#8c7b6e] mt-1">{tr.sub}</p>
              </div>

              {/* Order card */}
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-6">
                {/* Header stripe */}
                <div className="bg-gradient-to-r from-[#c17a5a] via-[#b56e4f] to-[#a8654a] px-6 py-4 text-white">
                  <p className="text-xs uppercase tracking-widest font-semibold opacity-80 mb-0.5">{selectedProduct!.name}</p>
                  <p className="text-sm opacity-80">{addOns}</p>
                  <p className="text-xs opacity-70 mt-1">📅 {scheduledDate}</p>
                </div>

                <div className="p-6 space-y-3 text-sm">
                  {/* Customer */}
                  <div className="flex justify-between text-[#6b4f3a]">
                    <span className="text-[#8c7b6e]">{tr.customer}</span>
                    <span className="font-medium">{customerName.trim() || tr.walkIn}</span>
                  </div>

                  {/* Line items */}
                  <div className="flex justify-between text-[#6b4f3a]">
                    <span className="text-[#8c7b6e]">{selectedProduct!.name}</span>
                    <span>${selectedProduct!.price.toFixed(2)}</span>
                  </div>
                  {sessionPrice > 0 && (
                    <div className="flex justify-between text-[#8c7b6e]">
                      <span>{SESSION_OPTIONS.find((o) => o.id === session)?.label}</span>
                      <span>+${sessionPrice.toFixed(2)}</span>
                    </div>
                  )}
                  {cleanserPrice > 0 && (
                    <div className="flex justify-between text-[#8c7b6e]">
                      <span>Bubble Cleanser</span>
                      <span>+${cleanserPrice.toFixed(2)}</span>
                    </div>
                  )}
                  {massagePrice > 0 && (
                    <div className="flex justify-between text-[#8c7b6e]">
                      <span>Premium Massage</span>
                      <span>+${massagePrice.toFixed(2)}</span>
                    </div>
                  )}
                  {!isToday && (
                    <div className="flex justify-between text-[#8c7b6e]">
                      <span>📅 {scheduledDate}</span>
                      <span>+$1.00</span>
                    </div>
                  )}
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>🎟 {appliedCoupon.code}</span>
                      <span>−${appliedCoupon.discountUsd.toFixed(2)}</span>
                    </div>
                  )}

                  {/* Payment */}
                  <div className="pt-1 border-t border-[#f0e8dd]">
                    <p className="text-[#8c7b6e] text-xs mb-0.5">{tr.payMethod}</p>
                    <p className="text-[#6b4f3a]">{tr.payDetail}</p>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between font-bold text-[#2d2926] text-xl pt-2 border-t border-[#e8ddd0]">
                    <span>{tr.total}</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Confirm button */}
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-[#c17a5a] text-white font-bold text-base hover:bg-[#a8654a] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#c17a5a]/20 mb-3"
              >
                {loading && (
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                )}
                {loading ? tr.confirming : tr.confirm}
              </button>

              {/* Back link for employee */}
              <button
                onClick={() => setPhase("editing")}
                className="w-full text-center text-sm text-[#8c7b6e] hover:text-[#c17a5a] transition-colors py-2"
              >
                {tr.back}
              </button>
            </div>
          ) : (
            /* Success — shown after customer confirms */
            <div className="w-full max-w-sm text-center animate-fade-up">
              <div className="w-20 h-20 rounded-full bg-[#f0e8dd] flex items-center justify-center mx-auto mb-6">
                <svg width="36" height="36" viewBox="0 0 44 44" fill="none">
                  <path d="M10 22L18 30L34 14" stroke="#c17a5a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-[#2d2926] mb-2">{tr.doneTitle}</h1>
              <p className="text-[#8c7b6e] mb-6">{tr.doneSub}</p>
              <div className="bg-white rounded-2xl p-5 text-left space-y-3 mb-8 shadow-sm">
                {[tr.doneStep1, tr.doneStep2, tr.doneStep3].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#f0e8dd] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-[#c17a5a]">{i + 1}</span>
                    <p className="text-sm text-[#6b4f3a]">{step}</p>
                  </div>
                ))}
              </div>
              {/* Employee controls */}
              <div className="flex gap-3">
                <Button onClick={reset} className="flex-1">{tr.newOrder}</Button>
                <Button variant="outline" onClick={() => router.push("/admin")} className="flex-1">{tr.backAdmin}</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-[#8c7b6e] mb-1">Admin</p>
        <h1 className="text-3xl font-bold text-[#2d2926]">New Order</h1>
        <p className="text-[#8c7b6e] text-sm mt-1">Place an order on behalf of a customer.</p>
      </div>

      {/* Product selection */}
      <section>
        <p className="text-xs uppercase tracking-widest text-[#8c7b6e] mb-3">Select Product</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProduct(p)}
              className="rounded-xl px-4 py-3 text-left border-2 transition-all duration-150 focus:outline-none"
              style={{
                backgroundColor: selectedProduct?.id === p.id ? "#c17a5a" : "#faf6f1",
                borderColor: selectedProduct?.id === p.id ? "#c17a5a" : "#e8ddd0",
                color: selectedProduct?.id === p.id ? "white" : "#2d2926",
              }}
            >
              <p className="font-semibold text-sm leading-tight">{p.name}</p>
              <p className="text-xs mt-0.5" style={{ opacity: selectedProduct?.id === p.id ? 0.85 : undefined, color: selectedProduct?.id === p.id ? undefined : "#8c7b6e" }}>
                ${p.price.toFixed(2)}
              </p>
            </button>
          ))}
        </div>
      </section>

      {selectedProduct && (
        <>
          {/* Start time */}
          <section>
            <p className="text-xs uppercase tracking-widest text-[#8c7b6e] mb-3">Start Time</p>
            <TimePicker value={startTime} onChange={setStartTime} />
          </section>

          {/* Session length */}
          <section>
            <p className="text-xs uppercase tracking-widest text-[#8c7b6e] mb-3">Session Length</p>
            <div className="flex gap-3">
              {SESSION_OPTIONS.map((o) => (
                <Pill key={o.id} {...o} selected={session === o.id} onClick={() => setSession(o.id)} />
              ))}
            </div>
          </section>

          {/* Cleanser */}
          <section>
            <p className="text-xs uppercase tracking-widest text-[#8c7b6e] mb-3">Bubble Cleanser</p>
            <div className="flex gap-3">
              {CLEANSER_OPTIONS.map((o) => (
                <Pill key={o.id} {...o} selected={cleanser === o.id} onClick={() => setCleanser(o.id)} />
              ))}
            </div>
          </section>

          {/* Massage */}
          <section>
            <p className="text-xs uppercase tracking-widest text-[#8c7b6e] mb-3">Massage</p>
            <div className="flex gap-3">
              {MASSAGE_OPTIONS.map((o) => (
                <Pill key={o.id} {...o} selected={massage === o.id} onClick={() => setMassage(o.id)} />
              ))}
            </div>
          </section>

          {/* Customer info */}
          <section>
            <p className="text-xs uppercase tracking-widest text-[#8c7b6e] mb-3">Customer Info <span className="normal-case text-[#c8bfb8]">(optional)</span></p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className={inputClass}
              />
              <input
                type="email"
                placeholder="Customer email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className={inputClass}
              />
            </div>
          </section>

          {/* Session date */}
          <section>
            <p className="text-xs uppercase tracking-widest text-[#8c7b6e] mb-3">
              Session Date
              {!isToday && <span className="ml-2 normal-case text-[#c17a5a] font-semibold">+$1.00 future date</span>}
            </p>
            <MiniCalendar value={scheduledDate} minValue={todayStr} onChange={setScheduledDate} locale="en" />
          </section>

          {/* Coupon */}
          <section>
            <p className="text-xs uppercase tracking-widest text-[#8c7b6e] mb-3">Coupon Code <span className="normal-case text-[#c8bfb8]">(optional)</span></p>
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-green-700">🎟 {appliedCoupon.code}</p>
                  <p className="text-xs text-green-600">−${appliedCoupon.discountUsd.toFixed(2)} off</p>
                </div>
                <button
                  onClick={() => setAppliedCoupon(null)}
                  className="text-xs text-[#8c7b6e] hover:text-red-500 transition-colors"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="MASKS-XXXXX"
                    value={couponInput}
                    onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && !couponLoading && applyCoupon()}
                    className={`${inputClass} flex-1`}
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={couponLoading || !couponInput.trim()}
                    className="px-4 py-3 rounded-xl bg-[#c17a5a] text-white text-sm font-semibold hover:bg-[#a8654a] transition-colors disabled:opacity-40"
                  >
                    {couponLoading ? "…" : "Apply"}
                  </button>
                </div>
                {couponError && (
                  <p className="text-xs text-red-500 flex items-center gap-1"><span>✕</span> {couponError}</p>
                )}
              </div>
            )}
          </section>

          {/* Summary */}
          {allSelected && (
            <section className="bg-white rounded-2xl shadow-sm p-6 space-y-2 text-sm text-[#6b4f3a]">
              <div className="flex justify-between">
                <span>{selectedProduct.name}</span>
                <span>${selectedProduct.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#8c7b6e]">
                <span>Starts {startTime} · {SESSION_OPTIONS.find((o) => o.id === session)?.label}</span>
                <span>+${sessionPrice.toFixed(2)}</span>
              </div>
              {cleanserPrice > 0 && (
                <div className="flex justify-between text-[#8c7b6e]">
                  <span>Bubble Cleanser</span><span>+${cleanserPrice.toFixed(2)}</span>
                </div>
              )}
              {massagePrice > 0 && (
                <div className="flex justify-between text-[#8c7b6e]">
                  <span>Premium Massage</span><span>+${massagePrice.toFixed(2)}</span>
                </div>
              )}
              {!isToday && (
                <div className="flex justify-between text-[#8c7b6e]">
                  <span>📅 Future date ({scheduledDate})</span>
                  <span>+$1.00</span>
                </div>
              )}
              {appliedCoupon && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>🎟 {appliedCoupon.code}</span>
                  <span>−${appliedCoupon.discountUsd.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-[#e8ddd0] pt-3 flex justify-between font-bold text-[#2d2926] text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </section>
          )}

          <Button
            size="lg"
            className="w-full"
            disabled={!allSelected}
            onClick={handleSendToCustomer}
          >
            {allSelected ? `Send to Customer → $${total.toFixed(2)}` : "Select all options"}
          </Button>
        </>
      )}
    </div>
  );
}
