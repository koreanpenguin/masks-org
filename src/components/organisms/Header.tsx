"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CartIcon } from "@/components/atoms/icons/CartIcon";
import { useCartStore } from "@/store/cartStore";
import { logout } from "@/app/actions/auth";
import type { SessionUser } from "@/lib/session";
import { useLanguageStore } from "@/store/languageStore";
import { useTranslations } from "@/lib/translations";
import { LanguageSwitcher } from "@/components/atoms/LanguageSwitcher";

const ADMINS = new Set(["haeonpark.kr@gmail.com", "jionpark.kr@gmail.com"]);
const navLinkClass =
  "relative hover:text-terracotta transition-colors duration-200 after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-0 after:bg-terracotta after:transition-all after:duration-300 hover:after:w-full";

export function Header({ user }: { user: SessionUser | null }) {
  const totalItems = useCartStore((s) => s.totalItems());
  const locale = useLanguageStore((s) => s.locale);
  const setLocale = useLanguageStore((s) => s.setLocale);
  const tr = useTranslations(locale);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [compact, setCompact] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }

  useEffect(() => {
    if (user && ADMINS.has(user.email) && locale !== "en") {
      setLocale("en");
      document.cookie = "masks-locale=en; path=/; max-age=31536000; SameSite=Lax";
      router.refresh();
    }
  }, [user, locale, setLocale, router]);

  useEffect(() => {
    setMounted(true);

    let prevY = window.scrollY;
    let accumDown = 0;
    let accumUp = 0;
    const TRIGGER = 40;
    let frame: number;

    const handler = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        const d = y - prevY;
        prevY = y;
        if (d > 0) {
          accumDown += d;
          accumUp = 0;
          if (accumDown >= TRIGGER) { setCompact(true); accumDown = 0; }
        } else if (d < 0) {
          accumUp += -d;
          accumDown = 0;
          if (accumUp >= TRIGGER) { setCompact(false); accumUp = 0; }
        }
      });
    };

    window.addEventListener("scroll", handler, { passive: true });
    return () => {
      window.removeEventListener("scroll", handler);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    // Fixed-height wrapper — content below never jumps when card resizes
    <div className="sticky top-0 z-50 h-[76px] pointer-events-none">
      {/* Bottom fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream to-transparent" />
      <div
        className={`absolute inset-x-4 top-3 rounded-2xl bg-cream/95 backdrop-blur-md border border-parchment pointer-events-auto transition-all duration-200 ease-in-out ${
          compact ? "shadow-md" : "shadow-sm"
        }`}
      >
        <div
          className={`px-6 flex items-center justify-between overflow-hidden transition-all duration-200 ease-in-out ${
            compact ? "h-11" : "h-16"
          }`}
        >
          <Link href="/" className="hidden md:flex flex-col leading-none shrink-0">
            <span
              className={`font-bold text-charcoal tracking-tight transition-all duration-200 flex items-center gap-1.5 ${
                compact ? "text-base" : "text-xl"
              }`}
            >
              MasksOrg
              <span className="text-[10px] font-semibold uppercase tracking-widest text-white bg-terracotta px-1.5 py-0.5 rounded-md leading-none">Beta</span>
            </span>
            <span
              className={`text-xs text-muted tracking-widest uppercase transition-all duration-200 origin-top ${
                compact ? "opacity-0 scale-y-0 h-0" : "opacity-100 scale-y-100"
              }`}
            >
              Natural Skincare
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-bark">
            <Link href="/" className={navLinkClass}>{tr.nav.home}</Link>
            <Link href="/shop" className={navLinkClass}>{tr.nav.shop}</Link>
            {user ? (
              <>
                <span className="text-[#6b4f3a]">{tr.nav.hi}, {user.name.split(" ")[0]}</span>
                <Link href="/account" className={navLinkClass}>{tr.nav.orders}</Link>
                {ADMINS.has(user.email) && (
                  <Link href="/admin" className={`${navLinkClass} font-medium`}>{tr.nav.admin}</Link>
                )}
                <form action={logout}>
                  <button type="submit" className={navLinkClass}>{tr.nav.signOut}</button>
                </form>
              </>
            ) : (
              <Link href="/login" className={navLinkClass}>{tr.nav.login}</Link>
            )}
          </nav>

          {/* Mobile icon nav */}
          <nav className="flex md:hidden items-center gap-1 text-charcoal">
            <Link href="/" title={tr.nav.home} className="p-2 hover:text-terracotta transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" /><path d="M9 21V12h6v9" />
              </svg>
            </Link>
            <Link href="/shop" title={tr.nav.shop} className="p-2 hover:text-terracotta transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </Link>
            {user ? (
              <>
                <Link href="/account" title={tr.nav.orders} className="p-2 hover:text-terracotta transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" />
                    </svg>
                  </Link>
                {ADMINS.has(user.email) && (
                  <Link href="/admin" title={tr.nav.admin} className="p-2 hover:text-terracotta transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                  </Link>
                )}
                <form action={logout}>
                  <button type="submit" title={tr.nav.signOut} className="p-2 hover:text-terracotta transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  </button>
                </form>
              </>
            ) : (
              <Link href="/login" title={tr.nav.login} className="p-2 hover:text-terracotta transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
            )}
            <LanguageSwitcher />
          </nav>

          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            className="p-2 text-charcoal hover:text-terracotta transition-all duration-200 hover:scale-110 active:scale-95 shrink-0"
          >
            {isFullscreen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            )}
          </button>

          <Link href="/cart" className="relative p-2 text-charcoal hover:text-terracotta transition-all duration-200 hover:scale-110 active:scale-95 shrink-0">
            <CartIcon size={26} />
            {mounted && totalItems > 0 && (
              <span
                key={totalItems}
                className="absolute -top-0.5 -right-0.5 bg-terracotta text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-[pop-in_0.35s_cubic-bezier(0.34,1.56,0.64,1)_both]"
              >
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
      {/* Side fades — rendered after the pill so they sit on top of its border/shadow */}
      <div className="absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-cream to-transparent" />
      <div className="absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-cream to-transparent" />
    </div>
  );
}
