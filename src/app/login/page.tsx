"use client";
import { useEffect } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/app/actions/auth";
import { Button } from "@/components/atoms/Button";
import { useLanguageStore } from "@/store/languageStore";
import { useTranslations } from "@/lib/translations";

export default function LoginPage() {
  const [error, action, pending] = useActionState(login, null);
  const locale = useLanguageStore((s) => s.locale);
  const tr = useTranslations(locale);

  useEffect(() => { document.title = "MasksOrg - Login"; }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6">
            <p className="text-2xl font-bold text-[#2d2926] leading-none">MasksOrg</p>
            <p className="text-xs tracking-[0.2em] uppercase text-[#8c7b6e] mt-1">Natural Skincare</p>
          </Link>
          <h1 className="text-3xl font-bold text-[#2d2926]">{tr.login.heading}</h1>
          <p className="text-[#8c7b6e] mt-2">{tr.login.sub}</p>
        </div>

        <form action={action} className="bg-white rounded-3xl shadow-sm p-8 space-y-5">
          {error && (
            <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>
          )}

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#8c7b6e] mb-1.5">
              {tr.login.email}
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-xl border border-[#e8ddd0] px-4 py-3 text-[#2d2926] text-sm focus:outline-none focus:border-[#c17a5a] transition-colors"
              placeholder={tr.login.emailPlaceholder}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[#8c7b6e] mb-1.5">
              {tr.login.password}
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-xl border border-[#e8ddd0] px-4 py-3 text-[#2d2926] text-sm focus:outline-none focus:border-[#c17a5a] transition-colors"
              placeholder={tr.login.passwordPlaceholder}
            />
          </div>

          <Button size="lg" className="w-full" disabled={pending}>
            {pending ? tr.login.signingIn : tr.login.signIn}
          </Button>

          <p className="text-center text-sm text-[#8c7b6e]">
            {tr.login.noAccount}{" "}
            <Link href="/signup" className="text-[#c17a5a] hover:underline font-medium">
              {tr.login.createOne}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
