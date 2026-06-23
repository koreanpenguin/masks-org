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
  scheduledDate?: string | null,
) {
  await prisma.order.create({
    data: {
      items: JSON.stringify(items),
      total,
      paymentMethod: "cash",
      userName,
      userEmail,
      scheduledDate: scheduledDate ? new Date(scheduledDate + "T00:00:00.000Z") : null,
    },
  });
}
