import GameClient from "@/components/game/game-client";
import { getLevelData, getMyUser } from "@/utils/api/user";
import { cookies } from "next/headers";
import { Suspense } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000/api/v1";

type GamePageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function GamePage({ searchParams }: GamePageProps) {
  // Fetch data on the server
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  const userData = await getMyUser();

  // Use level from query param if present, otherwise fallback to user's level
  const levelParam = (await searchParams)?.level;
  const levelId =
    typeof levelParam === "string"
      ? levelParam
      : userData?.level_id?.toString() || "";

  const levelData = await getLevelData({
    level: levelId,
  });

  if (!levelData || ((levelParam === "string") && Number(levelParam) > (userData?.level_id || 0))) {
    return <div>Level not found</div>;
  }
  if (!token) {
    return <div>Token not found</div>;
  }
  if (!userData) {
    return <div>User not found</div>;
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
