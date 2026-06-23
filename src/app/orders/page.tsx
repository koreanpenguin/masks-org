import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import { getLocale } from "@/lib/locale";
import type { OrderItem } from "@/app/actions/order";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My Orders" };

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [orders, locale] = await Promise.all([
    prisma.order.findMany({
      where: { userEmail: session.email },
      orderBy: { createdAt: "desc" },
    }),
    getLocale(),
  ]);

  const dateLocale = locale === "ko" ? "ko-KR" : "en-US";

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-[#8c7b6e] mb-1">
          {session.name.split(" ")[0]}
        </p>
        <h1 className="text-3xl font-bold text-[#2d2926]">
          {locale === "ko" ? "내 주문" : "My Orders"}
        </h1>
        <p className="text-[#8c7b6e] mt-1 text-sm">
          {locale === "ko"
            ? `총 ${orders.length}건의 주문`
            : `${orders.length} order${orders.length !== 1 ? "s" : ""} total`}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <p className="text-5xl mb-4">🧖</p>
          <p className="text-xl font-bold text-[#2d2926] mb-2">
            {locale === "ko" ? "아직 주문이 없어요" : "No orders yet"}
          </p>
          <p className="text-[#8c7b6e] mb-6">
            {locale === "ko"
              ? "첫 번째 마스크 세션을 예약하면 여기에 표시됩니다."
              : "Book your first session and it'll show up here."}
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#c17a5a] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#a8654a] transition-colors"
          >
            {locale === "ko" ? "마스크 둘러보기 →" : "Browse Masks →"}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const items = JSON.parse(order.items) as OrderItem[];
            return (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Order header */}
                <div className="px-6 py-4 bg-gradient-to-r from-[#faf6f1] to-[#f5ede4] flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-[#2d2926]">
                      {order.scheduledDate
                        ? order.scheduledDate.toLocaleDateString(dateLocale, { year: "numeric", month: "long", day: "numeric" })
                        : order.createdAt.toLocaleDateString(dateLocale, { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                    {order.scheduledDate && (
                      <p className="text-xs text-amber-600 font-medium mt-0.5">
                        {locale === "ko" ? "📅 예약 날짜" : "📅 Appointment"}
                      </p>
                    )}
                    <p className="text-xs text-[#8c7b6e] mt-0.5">
                      {locale === "ko" ? "주문: " : "Ordered: "}
                      {order.createdAt.toLocaleDateString(dateLocale, { month: "short", day: "numeric" })}
                      {" · "}
                      <span className="font-mono tracking-wider">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-[#2d2926] text-lg">
                      ${order.total.toFixed(2)}
                    </p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#e8f5e9] text-[#4caf50] font-semibold">
                      {locale === "ko" ? "확정됨" : "Confirmed"}
                    </span>
                  </div>
                </div>

                {/* Order items */}
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
    </div>
  );
}
