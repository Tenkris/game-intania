
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import backgroundImage from "@/app/assets/bg/background.jpg"
import { getMyUser } from "@/utils/api/user";
import { redirect } from "next/navigation";
import { User } from "@/types/user";
import { GameState } from "@/types/game";
import { initGame } from "@/utils/api/game";
import InformationPane from "@/components/game/informationPane";

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState| null>(null);
  const [userData, setUserData] = useState<User | null>(null);


  const handleReducePlayerHP = () => {
    if (gameState) {
      const newGameState = { ...gameState };
      newGameState.player.currentHP -= 5;
      newGameState.boss.currentHP -= 5;
      setGameState(newGameState);
    }
  }


  useEffect(() => {
    const initGameData = async () => {
      const loadedUserData = await getMyUser();
      if (!loadedUserData) {
        redirect("/login");
        return;
      } 
      const loadedGameState = await initGame(loadedUserData.level_id, loadedUserData);
      setUserData(loadedUserData);
      setGameState(loadedGameState);
    }
    initGameData();
  }, []);

  /*const userData = await getMyUser();*/
  if (!gameState || !userData) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-5">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="w-screen h-full">
      <div className="relative z-50 w-full h-full">
        <div className="h-1/6 w-full absolute top-0 left-0 z-10 flex items-center justify-center">
          <div className="flex flex-row items-center justify-center gap-2 w-full h-full">
            <InformationPane info={gameState.player}/>
            <InformationPane info={gameState.boss}/>
            {/* Button to reduce hp */}
            <button className="bg-red-500 w-1/6 h-full" onClick={handleReducePlayerHP}/>
          </div>
          
        </div>
        <Image
          src={backgroundImage}
          alt="background"
          className="w-full h-full object-cover absolute top-0 left-0 -z-10"
        />
        
        
      </div>
      
      
    </div>
  );
}