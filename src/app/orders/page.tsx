import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/locale";
import type { OrderItem } from "@/app/actions/order";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [orders, coupons, locale] = await Promise.all([
    prisma.order.findMany({
      where: { userEmail: session.email },
      orderBy: { createdAt: "desc" },
    }),
    prisma.coupon.findMany({
      where: { winnerEmail: session.email.toLowerCase() },
      orderBy: { createdAt: "desc" },
    }),
    getLocale(),
  ]);

  const ko = locale === "ko";
  const dateLocale = ko ? "ko-KR" : "en-US";

  const activeCoupons = coupons.filter((c) => !c.used);
  const usedCoupons   = coupons.filter((c) => c.used);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-14">

      {/* ── Header ── */}
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#c17a5a] to-[#a8654a] flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-xl">{session.name.charAt(0).toUpperCase()}</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#2d2926]">{session.name}</h1>
          <p className="text-sm text-[#8c7b6e]">{session.email}</p>
        </div>
      </div>

      {/* ── Coupon codes ── */}
      <section>
        <div className="mb-5">
          <p className="text-xs uppercase tracking-widest text-[#8c7b6e] mb-1">MasksOrgEry</p>
          <h2 className="text-2xl font-bold text-[#2d2926]">{ko ? "내 쿠폰" : "My Coupons"}</h2>
          <p className="text-sm text-[#8c7b6e] mt-0.5">
            {ko ? "MasksOrgEry 게임에서 당첨된 쿠폰이에요." : "Coupons you've won from the MasksOrgEry game."}
          </p>
        </div>

        {coupons.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <p className="text-4xl mb-3">🎰</p>
            <p className="font-semibold text-[#2d2926] mb-1">{ko ? "아직 쿠폰이 없어요" : "No coupons yet"}</p>
            <p className="text-sm text-[#8c7b6e] mb-5">
              {ko ? "게임을 플레이해서 할인 쿠폰을 받아보세요!" : "Play the game for a chance to win a discount!"}
            </p>
            <Link
              href="/game"
              className="inline-flex items-center gap-2 bg-[#c17a5a] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#a8654a] transition-colors"
            >
              {ko ? "🎰 게임하러 가기" : "🎰 Try Your Luck"}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {activeCoupons.length > 0 && (
              <>
                <p className="text-xs uppercase tracking-widest text-[#8c7b6e] pl-1">
                  {ko ? "사용 가능" : "Active"}
                </p>
                {activeCoupons.map((coupon) => (
                  <div
                    key={coupon.code}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden flex items-center gap-0"
                  >
                    {/* Accent stripe */}
                    <div className="w-2 self-stretch bg-gradient-to-b from-[#c17a5a] to-[#a8654a] shrink-0" />
                    <div className="flex-1 flex items-center justify-between gap-4 px-5 py-4">
                      <div>
                        <p className="font-mono font-bold text-[#c17a5a] tracking-widest text-base">{coupon.code}</p>
                        <p className="text-xs text-[#8c7b6e] mt-0.5">
                          {ko
                            ? `$${coupon.discountUsd.toFixed(2)} · ₩${coupon.discountKrw.toLocaleString("ko-KR")} 할인`
                            : `$${coupon.discountUsd.toFixed(2)} · ₩${coupon.discountKrw.toLocaleString("ko-KR")} off`}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="inline-block text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-600 font-semibold border border-green-200">
                          {ko ? "사용 가능" : "Active"}
                        </span>
                        <p className="text-xs text-[#c8bfb8] mt-1">
                          {ko ? "결제 시 입력" : "Use at checkout"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {usedCoupons.length > 0 && (
              <>
                <p className="text-xs uppercase tracking-widest text-[#8c7b6e] pl-1 pt-2">
                  {ko ? "사용됨" : "Used"}
                </p>
                {usedCoupons.map((coupon) => (
                  <div
                    key={coupon.code}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden flex items-center opacity-50"
                  >
                    <div className="w-2 self-stretch bg-[#e8ddd0] shrink-0" />
                    <div className="flex-1 flex items-center justify-between gap-4 px-5 py-4">
                      <div>
                        <p className="font-mono font-bold text-[#8c7b6e] tracking-widest text-base line-through">{coupon.code}</p>
                        <p className="text-xs text-[#8c7b6e] mt-0.5">
                          {ko
                            ? `$${coupon.discountUsd.toFixed(2)} · ₩${coupon.discountKrw.toLocaleString("ko-KR")} 할인`
                            : `$${coupon.discountUsd.toFixed(2)} · ₩${coupon.discountKrw.toLocaleString("ko-KR")} off`}
                        </p>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-[#f0e8dd] text-[#8c7b6e] font-semibold shrink-0">
                        {ko ? "사용됨" : "Used"}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </section>

      {/* ── Orders ── */}
      <section>
        <div className="mb-5">
          <p className="text-xs uppercase tracking-widest text-[#8c7b6e] mb-1">
            {ko ? "주문 내역" : "History"}
          </p>
          <h2 className="text-2xl font-bold text-[#2d2926]">{ko ? "내 주문" : "My Orders"}</h2>
          <p className="text-sm text-[#8c7b6e] mt-0.5">
            {ko
              ? `총 ${orders.length}건의 주문`
              : `${orders.length} order${orders.length !== 1 ? "s" : ""} total`}
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <p className="text-4xl mb-3">🧖</p>
            <p className="font-semibold text-[#2d2926] mb-1">{ko ? "아직 주문이 없어요" : "No orders yet"}</p>
            <p className="text-sm text-[#8c7b6e] mb-5">
              {ko
                ? "첫 번째 마스크 세션을 예약하면 여기에 표시됩니다."
                : "Book your first session and it'll show up here."}
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#c17a5a] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#a8654a] transition-colors"
            >
              {ko ? "마스크 둘러보기 →" : "Browse Masks →"}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const items = JSON.parse(order.items) as OrderItem[];
              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 bg-gradient-to-r from-[#faf6f1] to-[#f5ede4] flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#2d2926]">
                        {order.scheduledDate
                          ? order.scheduledDate.toLocaleDateString(dateLocale, { year: "numeric", month: "long", day: "numeric" })
                          : order.createdAt.toLocaleDateString(dateLocale, { year: "numeric", month: "long", day: "numeric" })}
                      </p>
                      {order.scheduledDate && (
                        <p className="text-xs text-amber-600 font-medium mt-0.5">
                          {ko ? "📅 예약 날짜" : "📅 Appointment"}
                        </p>
                      )}
                      <p className="text-xs text-[#8c7b6e] mt-0.5">
                        {ko ? "주문: " : "Ordered: "}
                        {order.createdAt.toLocaleDateString(dateLocale, { month: "short", day: "numeric" })}
                        {" · "}
                        <span className="font-mono tracking-wider">#{order.id.slice(-8).toUpperCase()}</span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-[#2d2926] text-lg">${order.total.toFixed(2)}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#e8f5e9] text-[#4caf50] font-semibold">
                        {ko ? "확정됨" : "Confirmed"}
                      </span>
                    </div>
                  </div>
                  <div className="px-6 py-4 space-y-3">
                    {items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm gap-4">
                        <div className="min-w-0">
                          <p className="font-medium text-[#2d2926]">
                            {item.name}
                            <span className="text-[#8c7b6e] font-normal"> × {item.quantity}</span>
                          </p>
                          {item.description && (
                            <p className="text-xs text-[#8c7b6e] mt-0.5 truncate">{item.description}</p>
                          )}
                        </div>
                        <span className="text-[#6b4f3a] font-medium shrink-0">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
