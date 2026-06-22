import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getProductsWithOverrides } from "@/lib/products";
import { NewOrderForm } from "./NewOrderForm";

export const dynamic = "force-dynamic";

const ADMINS = ["haeonpark.kr@gmail.com", "jionpark.kr@gmail.com"];

export default async function NewOrderPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!ADMINS.includes(session.email)) redirect("/");

  const products = await getProductsWithOverrides();
  const available = products.filter((p) => !p.comingSoon && p.inStock);

  return <NewOrderForm products={available} />;
}
