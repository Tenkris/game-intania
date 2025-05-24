import LoadDefaultBackground from "@/components/context/LoadDefaultBackground";
import GameClient from "@/components/game/game-client";
import { getLevelData, getMyUser } from "@/utils/api/user";
import { get } from "http";
import { cookies } from "next/headers";
import { Suspense } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000/api/v1";

export default async function GamePage() {
  // Fetch data on the server
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  const userData = await getMyUser();
  const levelData = await getLevelData({
    level: userData?.level_id.toString() || "",
  });
  if (!levelData) {
    return (<LoadDefaultBackground><div>Level not found</div></LoadDefaultBackground>);
  }
  if (!token) {
    return (<LoadDefaultBackground><div>Token not found</div></LoadDefaultBackground>);
  }
  if (!userData) {
    return (<LoadDefaultBackground><div>User not found</div></LoadDefaultBackground>);
  }

  return (
    <Suspense fallback={<span>Loading..</span>}>
      <GameClient
        levelData={levelData}
        cookie={token.value}
        userData={userData}
      />
    </Suspense>
  );
}
