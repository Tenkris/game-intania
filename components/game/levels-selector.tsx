"use client";
import React, { useEffect, useState } from "react";

import { User } from "@/types/user";

function LevelsSelector({ userData }: { userData: User }) {
  const [scrollPosition, setScrollPosition] = useState(0);
  // Mock level data by groups
  // Levels from 1 to 100
  // Split into groups of 5
  const levelGroups = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    levels: Array.from({ length: 5 }, (_, j) => i * 5 + j + 1),
  }));

  const levelPositions = {
    1: { gridArea: "1 / 2 / 2 / 30" },
    2: { gridArea: "1 / 3 / 3 / 2" },
    3: { gridArea: "2 / 1 / 4 / -41" },
    4:
      Math.random() > 1
        ? { gridArea: "3 / 1 / 20 / 5" }
        : { gridArea: "4 / 1 / 20 / 5" },
    5: { gridArea: "5 / 3 / 5 / 35" },
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <div className="relative w-full min-h-screen overflow-hidden flex flex-col items-center">
        <div className="z-1 relative">
          {levelGroups.map((group, i) => (
            <div
              key={i}
              className="relative h-screen overflow-hidden aspect-[2/3]"
            >
              <img
                src="/game-level-map.png"
                alt={`Level Map ${i + 1}`}
                className="h-full object-cover"
              />

              {group.levels.map((level, index) => (
                <div
                  key={`${group}-${level}`}
                  className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-4"
                >
                  <div
                    className="relative flex items-center justify-center"
                    //@ts-ignore
                    style={levelPositions[index + 1]}
                  >
                    <div 
                      className={`w-[min(8vw,_4rem)] h-[min(8vw,_4rem)] rounded-full ${(level <= userData.level_id) ? 'bg-blue-400' : 'bg-slate-400'} border-[3px] ${(level <= userData.level_id) ? 'border-blue-600' : 'border-slate-600'} flex items-center justify-center ${(level <= userData.level_id) ? 'cursor-pointer' : 'cursor-default'} transition-transform shadow-lg z-50`}
                      onClick={() => {
                        if (level <= userData.level_id) {
                          window.location.href = `/game?level=${level}`;
                        }
                      }}
                    >
                      <span className="text-white font-bold text-[min(4vw,_1.5rem)]">
                        {level}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LevelsSelector;
