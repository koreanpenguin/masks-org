"use server";
import { prisma } from "@/lib/db";

async function getConfig() {
  const c = await prisma.gameConfig.findUnique({ where: { id: "singleton" } });
  return c ?? { winPercent: 15, discountUsd: 3, discountKrw: 4000 };
}

export async function getGameConfig() {
  return getConfig();
}

export async function checkAndRegisterPlay(rawEmail: string): Promise<{
  allowed: boolean;
  error?: string;
}> {
  const email = rawEmail.trim().toLowerCase();
  if (!email || !email.includes("@") || !email.includes(".")) {
    return { allowed: false, error: "Enter a valid email address" };
  }

  // Check for a play in the last 24 hours
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const existing = await prisma.gamePlay.findFirst({
    where: { email, playedAt: { gte: since } },
  });

  if (existing) {
    const nextPlay = new Date(existing.playedAt.getTime() + 24 * 60 * 60 * 1000);
    const hoursLeft = Math.ceil((nextPlay.getTime() - Date.now()) / (1000 * 60 * 60));
    return {
      allowed: false,
      error: `You've already played today! Try again in ${hoursLeft} hour${hoursLeft === 1 ? "" : "s"}.`,
    };
  }

  await prisma.gamePlay.create({ data: { email } });
  return { allowed: true };
}

export async function createCoupon(): Promise<{ code: string; discountUsd: number; discountKrw: number }> {
  const config = await getConfig();
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 5; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  const code = `MASKS-${suffix}`;

  await prisma.coupon.create({
    data: { code, discountUsd: config.discountUsd, discountKrw: config.discountKrw },
  });

  return { code, discountUsd: config.discountUsd, discountKrw: config.discountKrw };
}

export async function validateCoupon(raw: string): Promise<{
  valid: boolean;
  discountUsd: number;
  discountKrw: number;
  error?: string;
}> {
  const code = raw.trim().toUpperCase();
  if (!code) return { valid: false, discountUsd: 0, discountKrw: 0, error: "Enter a coupon code" };

  const coupon = await prisma.coupon.findUnique({ where: { code } });
  if (!coupon) return { valid: false, discountUsd: 0, discountKrw: 0, error: "Invalid coupon code" };
  if (coupon.used) return { valid: false, discountUsd: 0, discountKrw: 0, error: "This coupon has already been used" };

  return { valid: true, discountUsd: coupon.discountUsd, discountKrw: coupon.discountKrw };
}

export async function redeemCoupon(raw: string): Promise<void> {
  const code = raw.trim().toUpperCase();
  await prisma.coupon.update({ where: { code }, data: { used: true } });
}
