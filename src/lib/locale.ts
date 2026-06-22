import { cookies } from "next/headers";
import type { Locale } from "@/store/languageStore";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const val = store.get("masks-locale")?.value;
  return val === "ko" ? "ko" : "en";
}
