import GameClient from "@/components/game/game-client";
import LevelsSelector from "@/components/game/levels-selector";
import { getLevelData, getMyUser } from "@/utils/api/user";
import { get } from "http";
import { cookies } from "next/headers";
import { Suspense } from "react";

export default async function LevelsPage() {
  const userData = await getMyUser();

  if (!userData) {
    return <div>User not found</div>;
  }

  return (
    <Suspense fallback={<span>Loading..</span>}>
      <LevelsSelector userData={userData} />
    </Suspense>
  );
}
