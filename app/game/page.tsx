"use client";

import Image from "next/image";
import { useState } from "react";
import backgroundImage from "@/app/assets/bg/background.jpg"

export default function GamePage() {
  const [gameState, setGameState] = useState();

  return (
    <div className="w-full h-full">
      <div className="absolute z-50 w-full h-full">
        <Image
          src={backgroundImage}
          alt="background"
          className="w-full h-full object-cover"
        />
      </div>
      
      
    </div>
  );
}