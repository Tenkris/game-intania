import GameClient from "@/components/game/game-client";
import { getLevelData } from "@/utils/api/user";
import { get } from "http";
import { cookies } from "next/headers";
import { Suspense } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000/api/v1";

export default async function GamePage() {
  // Fetch data on the server
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  const levelData = await getLevelData({
    level: "1",
  });
  if (!levelData) {
    return <div>Level not found</div>;
  }
  if (!token) {
    return <div>Token not found</div>;
  }

  return (
    <Suspense fallback={<span>Loading..</span>}>
      <GameClient levelData={levelData} cookie={token.value} />
    </Suspense>
  );
}
