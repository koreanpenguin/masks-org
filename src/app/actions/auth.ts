"use server";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";

export async function signup(prevState: string | null, formData: FormData) {
  const name     = String(formData.get("name")     ?? "").trim();
  const email    = String(formData.get("email")    ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirm  = String(formData.get("confirm")  ?? "");

  if (!name || !email || !password) return "All fields are required.";
  if (password.length < 6)          return "Password must be at least 6 characters.";
  if (password !== confirm)          return "Passwords don't match.";

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return "An account with this email already exists.";

  const hashed = await bcrypt.hash(password, 12);
  const user   = await prisma.user.create({ data: { name, email, password: hashed } });

  await createSession({ id: user.id, name: user.name, email: user.email });
  redirect("/");
}

export async function login(prevState: string | null, formData: FormData) {
  const email    = String(formData.get("email")    ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return "Invalid email or password.";

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return "Invalid email or password.";

  await createSession({ id: user.id, name: user.name, email: user.email });
  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}
