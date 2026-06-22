"use client";
import { useRouter } from "next/navigation";
import { useLanguageStore, type Locale } from "@/store/languageStore";
import { useLocaleTransition } from "@/components/providers/LocaleTransitionProvider";

const options: { value: Locale; label: string }[] = [
  { value: "en", label: "English" },
  { value: "ko", label: "한국어" },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguageStore();
  const router = useRouter();
  const { triggerTransition } = useLocaleTransition();

  function handleChange(value: Locale) {
    if (value === locale) return;
    triggerTransition(() => {
      setLocale(value);
      document.cookie = `masks-locale=${value}; path=/; max-age=31536000; SameSite=Lax`;
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-1 rounded-xl border border-parchment bg-white/50 p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => handleChange(opt.value)}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150 ${
            locale === opt.value
              ? "bg-terracotta text-white shadow-sm"
              : "text-muted hover:text-bark"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
