"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function submitReview(
  productSlug: string,
  userName: string,
  rating: number,
  comment: string
): Promise<string | null> {
  if (!userName.trim()) return "Please enter your name.";
  if (rating < 1 || rating > 5) return "Please select a star rating.";
  if (!comment.trim()) return "Please write a comment.";

  await prisma.review.create({
    data: {
      productId: productSlug,
      userName: userName.trim(),
      rating,
      comment: comment.trim(),
    },
  });

  revalidatePath(`/shop/${productSlug}`);
  return null;
}
