"use client";
import { useRouter } from "next/navigation";
import { useLanguageStore, type Locale } from "@/store/languageStore";
import { useLocaleTransition } from "@/components/providers/LocaleTransitionProvider";

function FlagUS() {
  return (
    <span className="block overflow-hidden rounded-sm" style={{ lineHeight: 0 }}>
      <svg viewBox="0 0 22 15" width={22} height={15}>
        {/* 6 alternating terracotta / cream stripes */}
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} x={0} y={i * 2.5} width={22} height={2.5}
            fill={i % 2 === 0 ? "#c17a5a" : "#f0e8dd"} />
        ))}
        {/* Canton */}
        <rect x={0} y={0} width={9} height={7.5} fill="#2d2926" />
        {/* 9 star dots (3×3 grid) */}
        {Array.from({ length: 9 }, (_, i) => (
          <circle key={i}
            cx={1.5 + (i % 3) * 3}
            cy={1.25 + Math.floor(i / 3) * 2.5}
            r={0.55} fill="#f0e8dd" />
        ))}
      </svg>
    </span>
  );
}

function FlagKR() {
  const cx = 11, cy = 7.5, R = 4, r = 2;
  return (
    <span className="block overflow-hidden rounded-sm" style={{ lineHeight: 0 }}>
      <svg viewBox="0 0 22 15" width={22} height={15}>
        {/* Cream background */}
        <rect width={22} height={15} fill="#faf6f1" />

        {/* Taeguk: dark (yin) base circle */}
        <circle cx={cx} cy={cy} r={R} fill="#2d2926" />
        {/* Yang (terracotta) S-curve half */}
        <path
          d={`M${cx},${cy - R} A${R},${R} 0 0,1 ${cx},${cy + R} A${r},${r} 0 0,1 ${cx},${cy} A${r},${r} 0 0,0 ${cx},${cy - R} Z`}
          fill="#c17a5a"
        />
        {/* Yin dot inside yang territory */}
        <circle cx={cx} cy={cy - r} r={r / 2} fill="#2d2926" />
        {/* Yang dot inside yin territory */}
        <circle cx={cx} cy={cy + r} r={r / 2} fill="#c17a5a" />

        {/* Top-left: Geon (Heaven) — 3 solid lines */}
        <rect x={0.5} y={1.2} width={4.5} height={0.8} fill="#2d2926" rx={0.2} />
        <rect x={0.5} y={2.3} width={4.5} height={0.8} fill="#2d2926" rx={0.2} />
        <rect x={0.5} y={3.4} width={4.5} height={0.8} fill="#2d2926" rx={0.2} />

        {/* Top-right: Gam (Water) — broken, solid, broken */}
        <rect x={17}   y={1.2} width={1.9} height={0.8} fill="#2d2926" rx={0.2} />
        <rect x={19.6} y={1.2} width={1.9} height={0.8} fill="#2d2926" rx={0.2} />
        <rect x={17}   y={2.3} width={4.5} height={0.8} fill="#2d2926" rx={0.2} />
        <rect x={17}   y={3.4} width={1.9} height={0.8} fill="#2d2926" rx={0.2} />
        <rect x={19.6} y={3.4} width={1.9} height={0.8} fill="#2d2926" rx={0.2} />

        {/* Bottom-left: Son (Wind) — broken, broken, solid */}
        <rect x={0.5} y={11}   width={1.9} height={0.8} fill="#2d2926" rx={0.2} />
        <rect x={3.1} y={11}   width={1.9} height={0.8} fill="#2d2926" rx={0.2} />
        <rect x={0.5} y={12.1} width={1.9} height={0.8} fill="#2d2926" rx={0.2} />
        <rect x={3.1} y={12.1} width={1.9} height={0.8} fill="#2d2926" rx={0.2} />
        <rect x={0.5} y={13.2} width={4.5} height={0.8} fill="#2d2926" rx={0.2} />

        {/* Bottom-right: Gon (Earth) — 3 broken */}
        <rect x={17}   y={11}   width={1.9} height={0.8} fill="#2d2926" rx={0.2} />
        <rect x={19.6} y={11}   width={1.9} height={0.8} fill="#2d2926" rx={0.2} />
        <rect x={17}   y={12.1} width={1.9} height={0.8} fill="#2d2926" rx={0.2} />
        <rect x={19.6} y={12.1} width={1.9} height={0.8} fill="#2d2926" rx={0.2} />
        <rect x={17}   y={13.2} width={1.9} height={0.8} fill="#2d2926" rx={0.2} />
        <rect x={19.6} y={13.2} width={1.9} height={0.8} fill="#2d2926" rx={0.2} />
      </svg>
    </span>
  );
}

const options = [
  { value: "en" as Locale, label: "English", Flag: FlagUS },
  { value: "ko" as Locale, label: "한국어", Flag: FlagKR },
];

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
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

  if (compact) {
    return (
      <div className="flex items-center gap-0.5 rounded-xl border border-parchment bg-white/50 p-1">
        {options.map(({ value, label, Flag }) => (
          <button
            key={value}
            onClick={() => handleChange(value)}
            title={label}
            className={`p-0.5 rounded-lg flex items-center justify-center transition-all duration-150 border-2 ${
              locale === value
                ? "border-[#c17a5a] shadow-sm opacity-100"
                : "border-transparent opacity-45 hover:opacity-70"
            }`}
          >
            <Flag />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 rounded-xl border border-parchment bg-white/50 p-1">
      {options.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => handleChange(value)}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150 ${
            locale === value
              ? "bg-terracotta text-white shadow-sm"
              : "text-muted hover:text-bark"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
