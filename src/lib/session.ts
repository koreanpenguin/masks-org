import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE = "masksorg-session";
const key = () => new TextEncoder().encode(process.env.JWT_SECRET!);

export interface SessionUser {
  id: string;
  name: string;
  email: string;
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({ id: user.id, name: user.name, email: user.email } as Record<string, string>)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(key());

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
}

export async function getSession(): Promise<SessionUser | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key());
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}

export async function deleteSession() {
  (await cookies()).delete(COOKIE);
}
