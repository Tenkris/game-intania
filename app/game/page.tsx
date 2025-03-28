"use client";

import Image from "next/image";
import { useState } from "react";
import heroImage from "@/app/assets/character/hero.png";
import monsterImage from "@/app/assets/character/monster.png";
import HealthBar from "@/components/health/health-bar";

const API_URL =
  process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000/api/v1";

export default function GamePage() {
  const [gameState, setGameState] = useState({
    hero: {
      health: 80,
      maxHealth: 100,
    },
    monster: {
      health: 60,
      maxHealth: 100,
    },
  });

  return (
    <div className="w-full h-full">
      <div className="w-full h-full flex flex-col justify-between items-center">
        <div className="bg-[#2A2A2A] w-full h-20 flex justify-between items-start p-5">
          <div className="flex flex-col gap-2">
            <span className="text-white font-[Press_Start_2P] text-sm">
              Monster
            </span>
            <HealthBar value={9} max={10} />
          </div>
          <div className="text-white font-[Press_Start_2P] text-sm">Level</div>
          <div className="flex flex-col gap-2">
            <span className="text-white font-[Press_Start_2P] text-sm">
              Hero
            </span>
            <HealthBar value={9} max={10} />
          </div>
        </div>

        <div className="flex justify-between w-full">
          <Image
            src={monsterImage}
            alt="background"
            className="h-80 md:h-96 w-fit object-cover -scale-x-100 [image-rendering:pixelated]"
          />
          <Image
            src={heroImage}
            alt="background"
            className="h-80 md:h-96 w-fit object-cover -scale-x-100 [image-rendering:pixelated]"
          />
        </div>
      </div>
    </div>
  );
}
