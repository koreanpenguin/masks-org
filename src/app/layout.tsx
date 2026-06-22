import type { Metadata } from "next";
import { Jua } from "next/font/google";
import Link from "next/link";
import { Header } from "@/components/organisms/Header";
import { LanguageSwitcher } from "@/components/atoms/LanguageSwitcher";
import { DisclaimerModal } from "@/components/molecules/DisclaimerModal";
import { LocaleTransitionProvider } from "@/components/providers/LocaleTransitionProvider";
import { getSession } from "@/lib/session";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/translations";
import "./globals.css";

const jua = Jua({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-jua",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "MasksOrg - %s",
    default: "MasksOrg",
  },
  description: "Premium natural and organic face masks for every skin type.",
  icons: { icon: "/icon.svg" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, locale] = await Promise.all([getSession(), getLocale()]);
  const tr = t[locale];
  return (
    <html lang="en" className={`h-full bg-cream ${jua.variable}`}>
      <body className="min-h-full flex flex-col bg-cream text-charcoal antialiased" style={{ fontFamily: "var(--font-jua), sans-serif" }}>
        <DisclaimerModal />
        <LocaleTransitionProvider>
        <Header user={user} />
        <main className="flex-1">{children}</main>
        <footer className="bg-gradient-to-b from-cream to-cream-dark border-t border-parchment py-10 px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="font-bold text-charcoal text-base leading-none">MasksOrg</p>
              <p className="text-xs tracking-widest uppercase text-muted mt-1">{tr.footer.tagline}</p>
            </div>
            <div className="flex gap-8 text-sm text-muted">
              <Link href="/shop" className="hover:text-terracotta transition-colors">{tr.footer.shop}</Link>
              <Link href="/cart" className="hover:text-terracotta transition-colors">{tr.footer.cart}</Link>
              <Link href="/login" className="hover:text-terracotta transition-colors">{tr.footer.account}</Link>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2">
              <LanguageSwitcher />
              <p className="text-sm text-muted text-center md:text-right">
                © {new Date().getFullYear()} MasksOrg.{" "}
                <span className="hidden md:inline"><br /></span>
                {tr.footer.made}
              </p>
            </div>
          </div>
        </footer>
        </LocaleTransitionProvider>
      </body>
    </html>
  );
}
