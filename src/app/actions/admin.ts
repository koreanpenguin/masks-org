"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function clearOrders() {
  await prisma.order.deleteMany();
  revalidatePath("/admin");
}

export async function clearUsers() {
  await prisma.user.deleteMany();
  revalidatePath("/admin");
}

export async function clearReviews() {
  await prisma.review.deleteMany();
  revalidatePath("/admin");
}

export async function deleteReview(id: string) {
  await prisma.review.delete({ where: { id } });
  revalidatePath("/admin");
}

export async function deleteUser(id: string) {
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin");
}

export async function updateProductOverride(
  productId: string,
  data: Record<string, unknown>
) {
  const existing = await prisma.productOverride.findUnique({ where: { id: productId } });
  const current = existing ? (JSON.parse(existing.data) as Record<string, unknown>) : {};
  const merged = { ...current, ...data };

  await prisma.productOverride.upsert({
    where: { id: productId },
    create: { id: productId, data: JSON.stringify(merged) },
    update: { data: JSON.stringify(merged) },
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");
}
