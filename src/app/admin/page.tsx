import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin" };
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/db";
import type { OrderItem } from "@/app/actions/order";
import { clearOrders, clearUsers, clearReviews, deleteReview, deleteUser } from "@/app/actions/admin";
import { ClearButton } from "./ClearButton";
import { DeploySteps } from "./DeploySteps";
import { ProductEditor } from "./ProductEditor";
import { getProductsWithOverrides } from "@/lib/products";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/translations";

const ADMINS = ["haeonpark.kr@gmail.com", "jionpark.kr@gmail.com"];

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!ADMINS.includes(session.email)) redirect("/");

  const locale = await getLocale();
  const tr = t[locale].admin;
  const dateLocale = locale === "ko" ? "ko-KR" : "en-US";

  const [users, orders, products, reviews] = await Promise.all([
    prisma.user.findMany({
      where: { email: { notIn: ADMINS } },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, createdAt: true },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    }),
    getProductsWithOverrides(),
    prisma.review.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-14">

      <DeploySteps />

      {/* Products */}
      <section>
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-[#8c7b6e] mb-1">{tr.heading}</p>
          <h2 className="text-3xl font-bold text-[#2d2926]">{tr.products}</h2>
          <p className="text-[#8c7b6e] mt-1 text-sm">{tr.productsSub}</p>
        </div>
        <ProductEditor products={products} />
      </section>

      {/* Users */}
      <section>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#8c7b6e] mb-1">{tr.heading}</p>
            <h1 className="text-3xl font-bold text-[#2d2926]">{tr.users}</h1>
            <p className="text-[#8c7b6e] mt-1">
              {locale === "ko"
                ? `${tr.total} ${users.length}${tr.accountsTotal}`
                : `${users.length} ${users.length !== 1 ? tr.accountsTotal : tr.accountTotal} ${tr.total}`}
            </p>
          </div>
          <ClearButton
            label={tr.clearUsers}
            confirmMessage={tr.clearUsersConfirm}
            action={clearUsers}
          />
        </div>

        {users.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-[#8c7b6e] shadow-sm">
            {tr.noUsers}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e8ddd0] text-left">
                  <th className="px-6 py-4 text-xs uppercase tracking-widest text-[#8c7b6e] font-medium">{tr.colName}</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-widest text-[#8c7b6e] font-medium">{tr.colEmail}</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-widest text-[#8c7b6e] font-medium">{tr.colJoined}</th>
                  <th className="px-6 py-4 w-20" />
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr key={user.id} className={i !== users.length - 1 ? "border-b border-[#f0e8dd]" : ""}>
                    <td className="px-6 py-4 font-medium text-[#2d2926]">{user.name}</td>
                    <td className="px-6 py-4 text-[#6b4f3a]">{user.email}</td>
                    <td className="px-6 py-4 text-[#8c7b6e]">
                      {user.createdAt.toLocaleDateString(dateLocale, { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td className="px-6 py-4">
                      <form action={deleteUser.bind(null, user.id)}>
                        <button type="submit" className="text-xs text-[#8c7b6e] hover:text-red-500 transition-colors">
                          {tr.colDelete}
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Reviews */}
      <section>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#2d2926]">{tr.reviewsHeading}</h2>
            <p className="text-[#8c7b6e] mt-1">
              {locale === "ko"
                ? `${tr.total} ${reviews.length}${tr.reviewsTotal}`
                : `${reviews.length} ${reviews.length !== 1 ? tr.reviewsTotal : tr.reviewTotal} ${tr.total}`}
            </p>
          </div>
          <ClearButton
            label={tr.clearReviews}
            confirmMessage={tr.clearReviewsConfirm}
            action={clearReviews}
          />
        </div>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-[#8c7b6e] shadow-sm">
            {tr.noReviews}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e8ddd0] text-left">
                  <th className="px-6 py-4 text-xs uppercase tracking-widest text-[#8c7b6e] font-medium">{tr.colProduct}</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-widest text-[#8c7b6e] font-medium">{tr.colReviewer}</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-widest text-[#8c7b6e] font-medium">{tr.colRating}</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-widest text-[#8c7b6e] font-medium">{tr.colComment}</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-widest text-[#8c7b6e] font-medium">{tr.colDate}</th>
                  <th className="px-6 py-4 w-20" />
                </tr>
              </thead>
              <tbody>
                {reviews.map((review, i) => {
                  const product = products.find((p) => p.slug === review.productId);
                  return (
                    <tr key={review.id} className={i !== reviews.length - 1 ? "border-b border-[#f0e8dd]" : ""}>
                      <td className="px-6 py-4 text-[#2d2926] font-medium">
                        {product?.name ?? review.productId}
                      </td>
                      <td className="px-6 py-4 text-[#6b4f3a]">{review.userName}</td>
                      <td className="px-6 py-4">
                        <div className="flex">
                          {[1,2,3,4,5].map((s) => (
                            <svg key={s} width="12" height="12" viewBox="0 0 20 20" fill={s <= review.rating ? "#c17a5a" : "#e8ddd0"}>
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#8c7b6e] max-w-xs truncate">{review.comment}</td>
                      <td className="px-6 py-4 text-[#8c7b6e] text-xs whitespace-nowrap">
                        {review.createdAt.toLocaleDateString(dateLocale, { year: "numeric", month: "short", day: "numeric" })}
                      </td>
                      <td className="px-6 py-4">
                        <form action={deleteReview.bind(null, review.id)}>
                          <button
                            type="submit"
                            className="text-xs text-[#8c7b6e] hover:text-red-500 transition-colors"
                          >
                            {tr.colDelete}
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Orders */}
      <section>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#2d2926]">{tr.ordersHeading}</h2>
            <p className="text-[#8c7b6e] mt-1">
              {locale === "ko"
                ? `${tr.total} ${orders.length}${tr.ordersTotal}`
                : `${orders.length} ${orders.length !== 1 ? tr.ordersTotal : tr.orderTotal} ${tr.total}`}
            </p>
          </div>
          <ClearButton
            label={tr.clearOrders}
            confirmMessage={tr.clearOrdersConfirm}
            action={clearOrders}
          />
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center text-[#8c7b6e] shadow-sm">
            {tr.noOrders}
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const items = JSON.parse(order.items) as OrderItem[];
              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="font-semibold text-[#2d2926]">
                        {order.userName ?? tr.guest}
                        {order.userEmail && (
                          <span className="text-[#8c7b6e] font-normal text-sm ml-2">{order.userEmail}</span>
                        )}
                      </p>
                      <p className="text-xs text-[#8c7b6e] mt-0.5">
                        {order.createdAt.toLocaleDateString(dateLocale, { year: "numeric", month: "short", day: "numeric" })}
                        {" · "}
                        {order.createdAt.toLocaleTimeString(dateLocale, { hour: "numeric", minute: "2-digit" })}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-[#2d2926] text-lg">${order.total.toFixed(2)}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#f0e8dd] text-[#c17a5a] font-medium capitalize">
                        {order.paymentMethod}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-[#f0e8dd] pt-4 space-y-2">
                    {items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <div>
                          <span className="text-[#2d2926] font-medium">{item.name}</span>
                          <span className="text-[#8c7b6e]"> × {item.quantity}</span>
                          {item.description && (
                            <p className="text-xs text-[#8c7b6e] mt-0.5">{item.description}</p>
                          )}
                        </div>
                        <span className="text-[#6b4f3a] ml-4 shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
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
