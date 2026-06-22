"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/atoms/Button";
import { SheetMaskIcon } from "@/components/atoms/icons/SheetMaskIcon";
import { discountedUnitPrice, getDiscountRate } from "@/lib/discount";
import { useLanguageStore } from "@/store/languageStore";
import { useTranslations } from "@/lib/translations";
import { formatPrice } from "@/lib/formatPrice";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();
  const locale = useLanguageStore((s) => s.locale);
  const tr = useTranslations(locale);
  const total = totalPrice();

  useEffect(() => { document.title = "MasksOrg - Cart"; }, []);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="flex justify-center mb-6"><SheetMaskIcon size={90} /></div>
        <h1 className="text-3xl font-bold text-[#2d2926] mb-3">{tr.cart.emptyTitle}</h1>
        <p className="text-[#8c7b6e] mb-8">{tr.cart.emptyBody}</p>
        <Link href="/shop">
          <Button size="lg">{tr.cart.browseMasks}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#2d2926] mb-8">{tr.cart.heading}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => {
            const rate = getDiscountRate(quantity);
            const unitPrice = discountedUnitPrice(product.price, quantity);
            const lineTotal = unitPrice * quantity;
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-4 flex gap-4 items-center shadow-sm"
              >
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: product.cardColor }}
                >
                  <SheetMaskIcon size={40} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-widest text-[#8c7b6e]">{product.category}</p>
                  <p className="font-semibold text-[#2d2926] truncate">{product.name}</p>
                  <p className="text-xs text-[#8c7b6e] mt-0.5 line-clamp-2 leading-relaxed">{product.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[#c17a5a] font-bold">{formatPrice(unitPrice, locale)}{tr.cart.perMask}</p>
                    {rate > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#f0e8dd] text-[#c17a5a] font-semibold">
                        {tr.cart.save} {Math.round(rate * 100)}%
                      </span>
                    )}
                  </div>
                </div>


                <div className="text-right">
                  <p className="font-bold text-[#2d2926]">{formatPrice(lineTotal, locale)}</p>
                  {rate > 0 && (
                    <p className="text-xs text-[#8c7b6e] line-through">
                      {formatPrice(product.price * quantity, locale)}
                    </p>
                  )}
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-xs text-[#8c7b6e] hover:text-[#c17a5a] transition-colors mt-1"
                  >
                    {tr.cart.remove}
                  </button>
                </div>
              </div>
            );
          })}

          <button
            onClick={clearCart}
            className="text-sm text-[#8c7b6e] hover:text-[#c17a5a] transition-colors"
          >
            {tr.cart.clearCart}
          </button>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-[#2d2926] mb-4">{tr.cart.orderSummary}</h2>

          <div className="space-y-2 text-sm text-[#6b4f3a] mb-4">
            {items.map(({ product, quantity }) => {
              const unitPrice = discountedUnitPrice(product.price, quantity);
              return (
                <div key={product.id} className="flex justify-between">
                  <span className="truncate mr-2">{product.name} × {quantity}</span>
                  <span>{formatPrice(unitPrice * quantity, locale)}</span>
                </div>
              );
            })}
          </div>

          <div className="border-t border-[#e8ddd0] pt-3 mb-6">
            <div className="flex justify-between font-bold text-[#2d2926] text-lg">
              <span>{tr.cart.total}</span>
              <span>{formatPrice(total, locale)}</span>
            </div>
          </div>

          <Link href="/checkout">
            <Button className="w-full" size="lg">{tr.cart.checkout}</Button>
          </Link>
          <Link href="/shop">
            <Button variant="ghost" className="w-full mt-2" size="md">
              {tr.cart.continueShopping}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
