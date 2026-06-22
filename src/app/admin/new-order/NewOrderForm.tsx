"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { TimePicker } from "@/components/atoms/TimePicker";
import { createOrder } from "@/app/actions/order";
import type { Product } from "@/domain/types";

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

export function NewOrderForm({ products }: { products: Product[] }) {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [session,   setSession]   = useState<string | null>(null);
  const [cleanser,  setCleanser]  = useState<string | null>(null);
  const [massage,   setMassage]   = useState<string | null>(null);
  const [startTime, setStartTime] = useState("");
  const [customerName,  setCustomerName]  = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const sessionPrice  = SESSION_OPTIONS.find((o) => o.id === session)?.price ?? 0;
  const cleanserPrice = CLEANSER_OPTIONS.find((o) => o.id === cleanser)?.price ?? 0;
  const massagePrice  = MASSAGE_OPTIONS.find((o) => o.id === massage)?.price ?? 0;
  const basePrice = selectedProduct?.price ?? 0;
  const total = basePrice + sessionPrice + cleanserPrice + massagePrice;

  const allSelected = selectedProduct !== null && session !== null && cleanser !== null && massage !== null && startTime !== "";

  async function handleSubmit() {
    if (!allSelected || !selectedProduct) return;
    setLoading(true);

    const addOns = [
      `Starts ${startTime}`,
      SESSION_OPTIONS.find((o) => o.id === session)!.label,
      cleanser !== "none" ? "Bubble Cleanser" : null,
      massage === "premium" ? "Premium Massage" : null,
    ].filter(Boolean).join(" · ");

    await createOrder(
      [{ name: selectedProduct.name, description: addOns, quantity: 1, price: total }],
      total,
      customerName.trim() || "Walk-in Customer",
      customerEmail.trim() || "",
    );

    setDone(true);
    setLoading(false);
  }

  function reset() {
    setSelectedProduct(null);
    setSession(null);
    setCleanser(null);
    setMassage(null);
    setStartTime("");
    setCustomerName("");
    setCustomerEmail("");
    setDone(false);
  }

  if (done) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-[#f0e8dd] flex items-center justify-center mx-auto mb-6">
          <svg width="36" height="36" viewBox="0 0 44 44" fill="none">
            <path d="M10 22L18 30L34 14" stroke="#c17a5a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-[#2d2926] mb-2">Order Placed!</h1>
        <p className="text-[#8c7b6e] mb-8">
          {selectedProduct?.name} for {customerName || "Walk-in Customer"} — ${total.toFixed(2)}
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>New Order</Button>
          <Button variant="outline" onClick={() => router.push("/admin")}>Back to Admin</Button>
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

          {/* Summary & submit */}
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
              <div className="border-t border-[#e8ddd0] pt-3 flex justify-between font-bold text-[#2d2926] text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </section>
          )}

          <Button size="lg" className="w-full" disabled={!allSelected || loading} onClick={handleSubmit}>
            {loading ? "Placing order…" : allSelected ? `Place Order — $${total.toFixed(2)}` : "Select all options"}
          </Button>
        </>
      )}
    </div>
  );
}
