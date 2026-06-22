"use client";
import { useState, useTransition } from "react";
import { updateProductOverride } from "@/app/actions/admin";
import type { Product } from "@/domain/types";
import { useLanguageStore } from "@/store/languageStore";
import { useTranslations } from "@/lib/translations";

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="relative inline-flex w-10 h-6 rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-40"
      style={{ backgroundColor: checked ? "#c17a5a" : "#e8ddd0" }}
    >
      <span
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
        style={{ left: checked ? "calc(100% - 20px)" : "4px" }}
      />
    </button>
  );
}

function ProductRow({ product }: { product: Product }) {
  const [isPending, startTransition] = useTransition();
  const [featured, setFeatured] = useState(product.featured ?? false);
  const [inStock, setInStock] = useState(product.inStock);
  const [comingSoon, setComingSoon] = useState(product.comingSoon ?? false);
  const [badge, setBadge] = useState(product.badge ?? "");
  const locale = useLanguageStore((s) => s.locale);
  const tr = useTranslations(locale);
  const badgeOptions = [
    { value: "", label: tr.admin.badgeNone },
    { value: "Sale", label: tr.admin.badgeSale },
    { value: "New", label: tr.admin.badgeNew },
    { value: "Staff Pick", label: tr.admin.badgeStaffPick },
    { value: "Best Seller", label: tr.admin.badgeBestSeller },
    { value: "Best Value", label: tr.admin.badgeBestValue },
  ];

  function save(data: Record<string, unknown>) {
    startTransition(async () => {
      await updateProductOverride(product.id, data);
    });
  }

  return (
    <tr className="border-b border-[#f0e8dd] last:border-0">
      {/* Product */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg shrink-0"
            style={{ backgroundColor: product.cardColor }}
          />
          <div>
            <p className="font-semibold text-[#2d2926] text-sm">{product.name}</p>
            {product.tagline && (
              <p className="text-xs text-[#8c7b6e] italic">{product.tagline}</p>
            )}
          </div>
        </div>
      </td>

      {/* Featured */}
      <td className="px-4 py-4">
        <Toggle
          checked={featured}
          disabled={isPending}
          onChange={(v) => { setFeatured(v); save({ featured: v }); }}
        />
      </td>

      {/* Badge */}
      <td className="px-4 py-4">
        <select
          value={badge}
          disabled={isPending}
          onChange={(e) => {
            const v = e.target.value;
            setBadge(v);
            save({ badge: v || null });
          }}
          className="text-xs border border-[#e8ddd0] rounded-lg px-2 py-1.5 text-[#6b4f3a] bg-white focus:outline-none focus:ring-1 focus:ring-[#c17a5a] disabled:opacity-40"
        >
          {badgeOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </td>

      {/* Coming Soon */}
      <td className="px-4 py-4">
        <Toggle
          checked={comingSoon}
          disabled={isPending}
          onChange={(v) => { setComingSoon(v); save({ comingSoon: v }); }}
        />
      </td>

      {/* In Stock */}
      <td className="px-4 py-4">
        <Toggle
          checked={inStock}
          disabled={isPending}
          onChange={(v) => { setInStock(v); save({ inStock: v }); }}
        />
      </td>

      {/* Price */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-1">
          <span className="text-xs text-[#8c7b6e]">$</span>
          <input
            type="number"
            step="0.01"
            min="0"
            defaultValue={product.price.toFixed(2)}
            disabled={isPending}
            onBlur={(e) => {
              const v = parseFloat(e.target.value);
              if (!isNaN(v)) save({ price: v });
            }}
            className="w-16 text-xs border border-[#e8ddd0] rounded-lg px-2 py-1.5 text-[#2d2926] focus:outline-none focus:ring-1 focus:ring-[#c17a5a] disabled:opacity-40"
          />
        </div>
      </td>

      {/* Original Price (sale "was" price) */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-1">
          <span className="text-xs text-[#8c7b6e]">$</span>
          <input
            type="number"
            step="0.01"
            min="0"
            defaultValue={product.originalPrice?.toFixed(2) ?? ""}
            disabled={isPending}
            placeholder="—"
            onBlur={(e) => {
              const v = e.target.value.trim();
              save({ originalPrice: v ? parseFloat(v) : null });
            }}
            className="w-16 text-xs border border-[#e8ddd0] rounded-lg px-2 py-1.5 text-[#2d2926] placeholder-[#c8bfb8] focus:outline-none focus:ring-1 focus:ring-[#c17a5a] disabled:opacity-40"
          />
        </div>
      </td>

      {/* Saving indicator */}
      <td className="px-4 py-4">
        {isPending && <span className="text-xs text-[#8c7b6e] animate-pulse">{tr.admin.saving}</span>}
      </td>
    </tr>
  );
}

export function ProductEditor({ products }: { products: Product[] }) {
  const locale = useLanguageStore((s) => s.locale);
  const tr = useTranslations(locale);
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e8ddd0] text-left">
              <th className="px-4 py-4 text-xs uppercase tracking-widest text-[#8c7b6e] font-medium">
                {tr.admin.colProduct}
              </th>
              <th className="px-4 py-4 text-xs uppercase tracking-widest text-[#8c7b6e] font-medium">
                {tr.admin.colFeatured}
              </th>
              <th className="px-4 py-4 text-xs uppercase tracking-widest text-[#8c7b6e] font-medium">
                {tr.admin.colBadge}
              </th>
              <th className="px-4 py-4 text-xs uppercase tracking-widest text-[#8c7b6e] font-medium">
                Coming Soon
              </th>
              <th className="px-4 py-4 text-xs uppercase tracking-widest text-[#8c7b6e] font-medium">
                {tr.admin.colInStock}
              </th>
              <th className="px-4 py-4 text-xs uppercase tracking-widest text-[#8c7b6e] font-medium">
                {tr.admin.colPrice}
              </th>
              <th className="px-4 py-4 text-xs uppercase tracking-widest text-[#8c7b6e] font-medium">
                {tr.admin.colWas}
              </th>
              <th className="px-4 py-4 w-20" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <ProductRow key={p.id} product={p} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
