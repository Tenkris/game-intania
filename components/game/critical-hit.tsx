"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import signTallImage from "@/app/assets/hud/sign-tall.webp";

interface CriticalHitProps {
  onComplete: (multiplier: number) => void;
}

export default function CriticalHit({ onComplete }: CriticalHitProps) {
  const [position, setPosition] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = right, -1 = left
  const [isActive, setIsActive] = useState(true);
  const [multiplier, setMultiplier] = useState(1.0);
  const [showResult, setShowResult] = useState(false);
  const [currentZone, setCurrentZone] = useState<string>("MISS");
  const animationRef = useRef<number | null>(null);
  const lastTimestamp = useRef<number>(0);

  // Constants for the game
  const MAX_POSITION = 100;
  const MIN_POSITION = 0;
  const SPEED = 0.15; // Pixels per millisecond
  const PERFECT_ZONE = 50; // Center position
  const ZONE_SIZE = 5; // Size of the perfect zone

  // Define zones for different multipliers
  const getMultiplier = (pos: number): number => {
    const distance = Math.abs(pos - PERFECT_ZONE);
    if (distance <= ZONE_SIZE) return 2.0; // Perfect - 2.0x
    if (distance <= ZONE_SIZE * 2) return 1.8; // Excellent - 1.8x
    if (distance <= ZONE_SIZE * 3) return 1.5; // Great - 1.5x
    if (distance <= ZONE_SIZE * 4) return 1.3; // Good - 1.3x
    if (distance <= ZONE_SIZE * 5) return 1.1; // OK - 1.1x
    return 1.0; // Miss - 1.0x
  };

  // Get zone label based on position
  const getZoneLabel = (pos: number): string => {
    const distance = Math.abs(pos - PERFECT_ZONE);
    if (distance <= ZONE_SIZE) return "PERFECT";
    if (distance <= ZONE_SIZE * 2) return "EXCELLENT";
    if (distance <= ZONE_SIZE * 3) return "GREAT";
    if (distance <= ZONE_SIZE * 4) return "GOOD";
    if (distance <= ZONE_SIZE * 5) return "OK";
    return "MISS";
  };

  // Animation loop for the moving target
  const animate = (timestamp: number) => {
    if (!lastTimestamp.current) lastTimestamp.current = timestamp;
    const deltaTime = timestamp - lastTimestamp.current;
    lastTimestamp.current = timestamp;

    // Move the position based on direction and speed
    setPosition((prev) => {
      const newPos = prev + direction * SPEED * deltaTime;

      // Update current zone label for live feedback
      setCurrentZone(getZoneLabel(newPos));

      // Reverse direction if hitting the edges
      if (newPos >= MAX_POSITION) {
        setDirection(-1);
        return MAX_POSITION;
      } else if (newPos <= MIN_POSITION) {
        setDirection(1);
        return MIN_POSITION;
      }

      return newPos;
    });

    // Continue animation if active
    if (isActive) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  // Start animation on component mount
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isActive) return;

      if (event.code === "Space" || event.code === "Enter") {
        event.preventDefault();

        // Stop the animation
        setIsActive(false);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }

        // Calculate multiplier based on position
        const hitMultiplier = getMultiplier(position);
        setMultiplier(hitMultiplier);
        setShowResult(true);

        // Wait a moment to show the result before calling onComplete
        setTimeout(() => {
          onComplete(hitMultiplier);
        }, 1500);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, position, onComplete]);

  // Helper function to get color based on zone
  const getZoneColor = (zone: string): string => {
    switch (zone) {
      case "PERFECT":
        return "rgb(16, 185, 129)"; // green-500
      case "EXCELLENT":
        return "rgb(59, 130, 246)"; // blue-500
      case "GREAT":
        return "rgb(139, 92, 246)"; // purple-500
      case "GOOD":
        return "rgb(245, 158, 11)"; // yellow-500
      case "OK":
        return "rgb(239, 68, 68)"; // red-500
      default:
        return "rgb(107, 114, 128)"; // gray-500
    }
  };

  return (
    <div className="absolute w-full h-full z-30 flex flex-col justify-center items-center">
      <div className="w-[40rem] h-[30rem] flex flex-col justify-center items-center rounded-lg relative">
        <Image
          src={signTallImage}
          alt="Button Sign"
          className="w-full h-full absolute top-0 -z-[1] left-0 [image-rendering:pixelated]"
        />

        <div className="flex flex-col items-center w-full max-w-[36rem] px-6">
          <h1 className="text-3xl font-bold mb-2 text-amber-400 drop-shadow-md">
            ⚔️ Critical Hit! ⚔️
          </h1>

          {!showResult ? (
            <>
              {/* Live feedback of current zone */}
              <div
                className="text-lg font-bold mb-3 transition-colors duration-150 ease-in-out"
                style={{ color: getZoneColor(currentZone) }}
              >
                {currentZone}
              </div>

              <p className="mb-6 text-center text-neutral-800">
                <span className="font-bold">Press SPACE</span> when the marker
                is in the center for maximum damage!
              </p>

              {/* Critical hit meter with improved styling */}
              <div className="relative w-full h-12 bg-neutral-800/80 rounded-xl mb-4 border-2 border-neutral-700 shadow-inner shadow-neutral-900/50 overflow-hidden">
                {/* Background pattern for the meter */}
                <div className="absolute inset-0 w-full h-full opacity-20">
                  <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent,10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)]"></div>
                </div>

                {/* Multiplier zones with improved styling */}
                <div
                  className="absolute inset-0 h-full"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(107,114,128,0.5), rgba(239,68,68,0.5), rgba(245,158,11,0.5), rgba(139,92,246,0.5), rgba(59,130,246,0.5), rgba(16,185,129,0.7), rgba(59,130,246,0.5), rgba(139,92,246,0.5), rgba(245,158,11,0.5), rgba(239,68,68,0.5), rgba(107,114,128,0.5))",
                  }}
                ></div>

                {/* Zone markers */}
                <div className="absolute inset-0 flex justify-between px-0">
                  {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((pos) => (
                    <div
                      key={pos}
                      className="h-full w-[2px] bg-white/30"
                      style={{
                        left: `${pos}%`,
                        position: "absolute",
                      }}
                    />
                  ))}
                </div>

                {/* Center line marker */}
                <div className="absolute h-full w-[2px] bg-green-400/80 left-1/2 transform -translate-x-1/2" />

                {/* Sliding marker with glow effect */}
                <div
                  className="absolute h-full w-4 rounded-full transition-transform"
                  style={{
                    left: `${position}%`,
                    transform: "translateX(-50%)",
                    zIndex: 10,
                    background: "white",
                    boxShadow: `0 0 10px 2px ${getZoneColor(currentZone)}, 0 0 5px 1px white`,
                  }}
                />
              </div>

              {/* Zone indicators with labels */}
              <div className="w-full flex justify-between my-2">
                <div className="flex flex-col items-center">
                  <span className="h-1 w-6 bg-gray-400 rounded-full mb-1"></span>
                  <span className="text-xs text-gray-500">Miss</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="h-1 w-6 bg-red-400 rounded-full mb-1"></span>
                  <span className="text-xs text-red-400">1.1x</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="h-1 w-6 bg-amber-400 rounded-full mb-1"></span>
                  <span className="text-xs text-amber-400">1.3x</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="h-1 w-6 bg-purple-400 rounded-full mb-1"></span>
                  <span className="text-xs text-purple-400">1.5x</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="h-1 w-6 bg-blue-400 rounded-full mb-1"></span>
                  <span className="text-xs text-blue-400">1.8x</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="h-1 w-6 bg-green-400 rounded-full mb-1"></span>
                  <span className="text-xs font-bold text-green-400">2.0x</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="h-1 w-6 bg-blue-400 rounded-full mb-1"></span>
                  <span className="text-xs text-blue-400">1.8x</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="h-1 w-6 bg-purple-400 rounded-full mb-1"></span>
                  <span className="text-xs text-purple-400">1.5x</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="h-1 w-6 bg-amber-400 rounded-full mb-1"></span>
                  <span className="text-xs text-amber-400">1.3x</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="h-1 w-6 bg-red-400 rounded-full mb-1"></span>
                  <span className="text-xs text-red-400">1.1x</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="h-1 w-6 bg-gray-400 rounded-full mb-1"></span>
                  <span className="text-xs text-gray-500">Miss</span>
                </div>
              </div>

              {/* Instruction for mobile/touch users */}
              <p className="text-xs text-neutral-600 mt-4">
                <span className="bg-neutral-800 text-white px-2 py-0.5 rounded">
                  SPACE
                </span>{" "}
                or{" "}
                <span className="bg-neutral-800 text-white px-2 py-0.5 rounded">
                  ENTER
                </span>{" "}
                to hit!
              </p>
            </>
          ) : (
            // Enhanced result display
            <div className="flex flex-col items-center p-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-black/10 blur-xl rounded-full"></div>
                <div
                  className="rounded-full w-28 h-28 flex items-center justify-center relative"
                  style={{
                    background: `radial-gradient(circle, ${getZoneColor(getZoneLabel(position))} 0%, rgba(0,0,0,0.2) 100%)`,
                    boxShadow: `0 0 20px 5px ${getZoneColor(getZoneLabel(position))}`,
                  }}
                >
                  <span className="text-4xl font-bold text-white drop-shadow-lg">
                    {multiplier.toFixed(1)}x
                  </span>
                </div>
              </div>

              <p
                className="text-3xl font-bold mb-4"
                style={{
                  color: getZoneColor(getZoneLabel(position)),
                  textShadow: "0 2px 5px rgba(0,0,0,0.3)",
                }}
              >
                {getZoneLabel(position)}!
              </p>

              <div
                className="flex items-center gap-2 px-6 py-2 rounded-lg"
                style={{
                  background: `rgba(${getZoneColor(getZoneLabel(position)).replace("rgb(", "").replace(")", "")}, 0.2)`,
                }}
              >
                <span className="font-bold text-neutral-800">
                  {multiplier.toFixed(1)}x Damage Multiplier!
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
