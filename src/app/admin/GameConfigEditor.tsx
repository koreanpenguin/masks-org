"use client";
import { useState } from "react";
import { saveGameConfig } from "@/app/actions/admin";

interface Config {
  winPercent: number;
  discountUsd: number;
  discountKrw: number;
}

const fieldClass =
  "w-full rounded-xl border border-[#e8ddd0] px-4 py-3 text-[#2d2926] text-sm focus:outline-none focus:border-[#c17a5a] transition-colors bg-white";

export function GameConfigEditor({ config }: { config: Config }) {
  const [winPercent, setWinPercent] = useState(String(config.winPercent));
  const [discountUsd, setDiscountUsd] = useState(String(config.discountUsd));
  const [discountKrw, setDiscountKrw] = useState(String(config.discountKrw));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    const wp = Math.min(100, Math.max(0, parseFloat(winPercent) || 0));
    const du = Math.max(0, parseFloat(discountUsd) || 0);
    const dk = Math.max(0, parseInt(discountKrw) || 0);
    setSaving(true);
    await saveGameConfig(wp, du, dk);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        {/* Win chance */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#8c7b6e] mb-1.5">
            Win Chance (%)
          </label>
          <div className="relative">
            <input
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={winPercent}
              onChange={(e) => setWinPercent(e.target.value)}
              className={fieldClass}
              placeholder="15"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c7b6e] text-sm pointer-events-none">%</span>
          </div>
          <p className="text-xs text-[#8c7b6e] mt-1">e.g. 15 = 15% win rate</p>
        </div>

        {/* Discount USD */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#8c7b6e] mb-1.5">
            Discount (USD)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c7b6e] text-sm pointer-events-none">$</span>
            <input
              type="number"
              min={0}
              step={0.5}
              value={discountUsd}
              onChange={(e) => setDiscountUsd(e.target.value)}
              className={`${fieldClass} pl-7`}
              placeholder="3"
            />
          </div>
          <p className="text-xs text-[#8c7b6e] mt-1">Amount off in dollars</p>
        </div>

        {/* Discount KRW */}
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#8c7b6e] mb-1.5">
            Discount (KRW)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8c7b6e] text-sm pointer-events-none">₩</span>
            <input
              type="number"
              min={0}
              step={500}
              value={discountKrw}
              onChange={(e) => setDiscountKrw(e.target.value)}
              className={`${fieldClass} pl-7`}
              placeholder="4000"
            />
          </div>
          <p className="text-xs text-[#8c7b6e] mt-1">Amount off in won</p>
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-xl bg-[#faf6f1] border border-[#e8ddd0] px-4 py-3 mb-5 text-sm text-[#6b4f3a] flex flex-wrap gap-x-6 gap-y-1">
        <span>
          <span className="font-semibold">{parseFloat(winPercent) || 0}%</span> win rate
        </span>
        <span>
          Coupon gives <span className="font-semibold">${parseFloat(discountUsd) || 0} / ₩{(parseInt(discountKrw) || 0).toLocaleString("ko-KR")}</span> off
        </span>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-colors disabled:opacity-50"
        style={{ background: saved ? "#6b9e6b" : "#c17a5a" }}
      >
        {saving ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            Saving…
          </>
        ) : saved ? (
          "Saved ✓"
        ) : (
          "Save Settings"
        )}
      </button>
    </div>
  );
}
