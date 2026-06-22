"use client";
import { useEffect } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signup } from "@/app/actions/auth";
import { Button } from "@/components/atoms/Button";
import { useLanguageStore } from "@/store/languageStore";
import { useTranslations } from "@/lib/translations";
import type { Locale } from "@/store/languageStore";

export default function SignUpPage() {
  const [error, action, pending] = useActionState(signup, null);
  const locale = useLanguageStore((s) => s.locale);
  const setLocale = useLanguageStore((s) => s.setLocale);
  const tr = useTranslations(locale);

  useEffect(() => { document.title = "MasksOrg - Sign Up"; }, []);
  const router = useRouter();

  function handleSelectLanguage(lang: Locale) {
    setLocale(lang);
    document.cookie = `masks-locale=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6">
            <p className="text-2xl font-bold text-[#2d2926] leading-none">MasksOrg</p>
            <p className="text-xs tracking-[0.2em] uppercase text-[#8c7b6e] mt-1">Natural Skincare</p>
          </Link>
          <h1 className="text-3xl font-bold text-[#2d2926]">{tr.signup.heading}</h1>
          <p className="text-[#8c7b6e] mt-2">{tr.signup.sub}</p>
        </div>

        <form action={action} className="bg-white rounded-3xl shadow-sm p-8 space-y-5">
          {error && (
            <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>
          )}

          {/* Language picker — shown in both languages so new users understand */}
          <div>
            <p className="text-xs text-center text-[#8c7b6e] mb-3">
              Choose your language&nbsp;&nbsp;·&nbsp;&nbsp;언어를 선택하세요
            </p>
            <div className="flex gap-3">
              {(["en", "ko"] as Locale[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleSelectLanguage(lang)}
                  className="flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all duration-150"
                  style={{
                    borderColor: locale === lang ? "#c17a5a" : "#e8ddd0",
                    backgroundColor: locale === lang ? "#c17a5a" : "white",
                    color: locale === lang ? "white" : "#8c7b6e",
                  }}
                >
                  {lang === "en" ? "English" : "한국어"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#8c7b6e] mb-1.5">
              {tr.signup.name}
            </label>
            <input
              name="name"
              type="text"
              required
              className="w-full rounded-xl border border-[#e8ddd0] px-4 py-3 text-[#2d2926] text-sm focus:outline-none focus:border-[#c17a5a] transition-colors"
              placeholder={tr.signup.namePlaceholder}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#8c7b6e] mb-1.5">
              {tr.signup.email}
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-[#e8ddd0] px-4 py-3 text-[#2d2926] text-sm focus:outline-none focus:border-[#c17a5a] transition-colors"
              placeholder={tr.signup.emailPlaceholder}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#8c7b6e] mb-1.5">
              {tr.signup.password}
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-xl border border-[#e8ddd0] px-4 py-3 text-[#2d2926] text-sm focus:outline-none focus:border-[#c17a5a] transition-colors"
              placeholder={tr.signup.passwordPlaceholder}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#8c7b6e] mb-1.5">
              {tr.signup.confirmPassword}
            </label>
            <input
              name="confirm"
              type="password"
              required
              className="w-full rounded-xl border border-[#e8ddd0] px-4 py-3 text-[#2d2926] text-sm focus:outline-none focus:border-[#c17a5a] transition-colors"
              placeholder={tr.signup.confirmPlaceholder}
            />
          </div>

          <Button size="lg" className="w-full" disabled={pending}>
            {pending ? tr.signup.creating : tr.signup.create}
          </Button>

          <p className="text-center text-sm text-[#8c7b6e]">
            {tr.signup.haveAccount}{" "}
            <Link href="/login" className="text-[#c17a5a] hover:underline font-medium">
              {tr.signup.signIn}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
