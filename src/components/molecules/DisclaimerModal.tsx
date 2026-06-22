"use client";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/atoms/LanguageSwitcher";
import { useLanguageStore } from "@/store/languageStore";
import { useTranslations } from "@/lib/translations";

const STORAGE_KEY = "masks-disclaimer-dismissed";

export function DisclaimerModal() {
  const [visible, setVisible] = useState(false);
  const [dontShow, setDontShow] = useState(false);
  const locale = useLanguageStore((s) => s.locale);
  const tr = useTranslations(locale);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) !== "true") {
      setVisible(true);
    }
  }, []);

  function handleClose() {
    if (dontShow) localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Card */}
      <div className="relative bg-cream rounded-3xl shadow-xl max-w-md w-full p-8 border border-parchment animate-[fade-up_0.3s_ease_both]">
        {/* Icon */}
        <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center mb-4">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 4a1 1 0 011 1v4a1 1 0 11-2 0V7a1 1 0 011-1zm0 8a1.25 1.25 0 110-2.5A1.25 1.25 0 0110 14z" fill="#c17a5a"/>
          </svg>
        </div>

        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-charcoal">{tr.disclaimer.title}</h2>
          <LanguageSwitcher />
        </div>

        <p className="text-sm text-muted leading-relaxed mb-6">
          {tr.disclaimer.body}
        </p>

        {/* Checkbox */}
        <label className="flex items-center gap-3 cursor-pointer mb-6 group">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={dontShow}
              onChange={(e) => setDontShow(e.target.checked)}
            />
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
              dontShow ? "bg-terracotta border-terracotta" : "border-parchment group-hover:border-terracotta/50"
            }`}>
              {dontShow && (
                <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                  <path d="M1 4l3 3 6-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </div>
          <span className="text-sm text-bark select-none">{tr.disclaimer.dontShow}</span>
        </label>

        <button
          onClick={handleClose}
          className="w-full bg-terracotta hover:bg-terracotta-dark text-white font-semibold py-3 rounded-2xl transition-colors duration-200"
        >
          {tr.disclaimer.confirm}
        </button>
      </div>
    </div>
  );
}
