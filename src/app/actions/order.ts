"use server";
import { prisma } from "@/lib/db";

export interface OrderItem {
  name: string;
  description: string;
  quantity: number;
  price: number;
}

export async function createOrder(
  items: OrderItem[],
  total: number,
  userName: string,
  userEmail: string,
) {
  await prisma.order.create({
    data: {
      items: JSON.stringify(items),
      total,
      paymentMethod: "cash",
      userName,
      userEmail,
    },
  });
}
