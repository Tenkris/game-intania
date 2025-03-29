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

  // Animation loop for the moving target
  const animate = (timestamp: number) => {
    if (!lastTimestamp.current) lastTimestamp.current = timestamp;
    const deltaTime = timestamp - lastTimestamp.current;
    lastTimestamp.current = timestamp;

    // Move the position based on direction and speed
    setPosition((prev) => {
      const newPos = prev + direction * SPEED * deltaTime;

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

        // Play appropriate sound based on multiplier
        const soundId =
          hitMultiplier >= 2.0
            ? "criticalPerfect"
            : hitMultiplier >= 1.5
              ? "criticalGood"
              : "criticalHit";

        // Wait a moment to show the result before calling onComplete
        setTimeout(() => {
          onComplete(hitMultiplier);
        }, 1500);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, position, onComplete]);

  return (
    <div className="absolute w-full h-full z-30 flex flex-col justify-center items-center">
      <div className="w-[40rem] h-[20rem] flex flex-col justify-center items-center rounded-lg relative">
        <Image
          src={signTallImage}
          alt="Button Sign"
          className="w-full h-full absolute top-0 -z-[1] left-0 [image-rendering:pixelated]"
        />

        <h1 className="text-2xl font-bold mb-4">Critical Hit!</h1>
        {!showResult ? (
          <>
            <p className="mb-6 text-center">
              Press SPACE when the marker is in the center for max damage!
            </p>

            {/* Critical hit slider */}
            <div className="relative w-4/5 h-8 bg-gray-800 rounded-full mb-4">
              {/* Perfect zone marker */}
              <div
                className="absolute h-full bg-green-500 opacity-30 rounded-full"
                style={{
                  left: `${PERFECT_ZONE - ZONE_SIZE}%`,
                  width: `${ZONE_SIZE * 2}%`,
                }}
              />

              {/* Excellent zones */}
              <div
                className="absolute h-full bg-blue-500 opacity-30 rounded-full"
                style={{
                  left: `${PERFECT_ZONE - ZONE_SIZE * 2}%`,
                  width: `${ZONE_SIZE}%`,
                }}
              />
              <div
                className="absolute h-full bg-blue-500 opacity-30 rounded-full"
                style={{
                  left: `${PERFECT_ZONE + ZONE_SIZE}%`,
                  width: `${ZONE_SIZE}%`,
                }}
              />

              {/* Great zones */}
              <div
                className="absolute h-full bg-purple-500 opacity-30 rounded-full"
                style={{
                  left: `${PERFECT_ZONE - ZONE_SIZE * 3}%`,
                  width: `${ZONE_SIZE}%`,
                }}
              />
              <div
                className="absolute h-full bg-purple-500 opacity-30 rounded-full"
                style={{
                  left: `${PERFECT_ZONE + ZONE_SIZE * 2}%`,
                  width: `${ZONE_SIZE}%`,
                }}
              />

              {/* Sliding marker */}
              <div
                className="absolute h-full w-4 bg-white rounded-full transition-transform"
                style={{ left: `${position}%`, transform: "translateX(-50%)" }}
              />
            </div>

            {/* Multiplier zones labels */}
            <div className="flex w-4/5 justify-between text-xs mt-1">
              <span>1.0x</span>
              <span>1.1x</span>
              <span>1.3x</span>
              <span>1.5x</span>
              <span>1.8x</span>
              <span>2.0x</span>
              <span>1.8x</span>
              <span>1.5x</span>
              <span>1.3x</span>
              <span>1.1x</span>
              <span>1.0x</span>
            </div>
          </>
        ) : (
          // Result display
          <div className="flex flex-col items-center">
            <p className="text-xl mb-2">
              {multiplier >= 2.0
                ? "PERFECT!"
                : multiplier >= 1.8
                  ? "EXCELLENT!"
                  : multiplier >= 1.5
                    ? "GREAT!"
                    : multiplier >= 1.3
                      ? "GOOD!"
                      : multiplier >= 1.1
                        ? "OK!"
                        : "MISS!"}
            </p>
            <p
              className="text-3xl font-bold"
              style={{
                color:
                  multiplier >= 2.0
                    ? "#10b981"
                    : multiplier >= 1.8
                      ? "#3b82f6"
                      : multiplier >= 1.5
                        ? "#8b5cf6"
                        : multiplier >= 1.3
                          ? "#f59e0b"
                          : multiplier >= 1.1
                            ? "#ef4444"
                            : "#6b7280",
              }}
            >
              {multiplier.toFixed(1)}x Damage!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
