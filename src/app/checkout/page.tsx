"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/atoms/Button";
import { createOrder } from "@/app/actions/order";
import { discountedUnitPrice } from "@/lib/discount";
import { useLanguageStore } from "@/store/languageStore";
import { useTranslations } from "@/lib/translations";
import { formatPrice } from "@/lib/formatPrice";

const inputClass = "w-full rounded-xl border border-[#e8ddd0] px-4 py-3 text-[#2d2926] text-sm focus:outline-none focus:border-[#c17a5a] transition-colors";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const locale = useLanguageStore((s) => s.locale);
  const tr = useTranslations(locale);
  const total = totalPrice();
  const [loading, setLoading] = useState(false);

  useEffect(() => { document.title = "MasksOrg - Checkout"; }, []);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-[#2d2926] mb-4">{tr.checkout.emptyTitle}</h1>
        <Link href="/shop"><Button size="lg">{tr.checkout.browseMasks}</Button></Link>
      </div>
    );
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
    await createOrder(orderItems, total, firstName.trim(), email.trim());
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
