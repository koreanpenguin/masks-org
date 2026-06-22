import type { Metadata } from "next";
import { ScratchGame } from "./ScratchGame";
import { getGameConfig } from "@/app/actions/game";

export const metadata: Metadata = { title: "MasksOrgEry — Try Your Luck!" };
export const dynamic = "force-dynamic";

export default async function GamePage() {
  const config = await getGameConfig();
  return <ScratchGame config={config} />;
}
