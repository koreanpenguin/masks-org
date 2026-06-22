import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Shop" };
import { getProductsWithOverrides } from "@/lib/products";
import { ShopContent } from "./ShopContent";

export default async function ShopPage() {
  const products = await getProductsWithOverrides();
  return (
    <Suspense>
      <ShopContent products={products} />
    </Suspense>
  );
}
