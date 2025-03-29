"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import signTallImage from "@/app/assets/hud/sign-tall.webp";
import { createPortal } from "react-dom";

interface BossDefenseProps {
  onAttack: (damageReduction: number) => void;
  countdownTime: number;
  soundPlay: (soundId: string) => void;
  heroRef: React.RefObject<HTMLDivElement | null>; // Add heroRef prop
}

function BossDefense({
  onAttack,
  countdownTime,
  soundPlay,
  heroRef,
}: BossDefenseProps) {
  // Shield state
  const [shieldValue, setShieldValue] = useState(0);
  const [isShieldActive, setIsShieldActive] = useState(false);
  const shieldTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSpacebarPressRef = useRef<number>(0);
  const isComponentMounted = useRef(true);
  const shieldValueRef = useRef(shieldValue);

  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  // Attack timer
  const attackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Update ref when shield value changes
  useEffect(() => {
    shieldValueRef.current = shieldValue;
  }, [shieldValue]);

  useEffect(() => {
    if (heroRef.current) {
      setPortalTarget(heroRef.current);
    }

    return () => {
      setPortalTarget(null);
    };
  }, [heroRef]);

  // Function to activate shield
  const activateShield = () => {
    // Record timestamp of press
    const now = Date.now();
    lastSpacebarPressRef.current = now;

    if (shieldValue % 10 === 0) {
      soundPlay("shield");
    }

    // Increase shield value (max 100)
    setShieldValue((prev) => Math.min(prev + 5, 100));

    // Set shield as active
    setIsShieldActive(true);

    // Clear any existing timeout
    if (shieldTimeoutRef.current) {
      clearTimeout(shieldTimeoutRef.current);
      shieldTimeoutRef.current = null;
    }

    // Skip further processing if shield is max
    if (shieldValueRef.current >= 100) {
      return;
    }

    // Set timeout to start decreasing shield if spacebar not pressed
    shieldTimeoutRef.current = setTimeout(() => {
      // Only start decreasing if it's been more than 200ms since last press
      if (Date.now() - lastSpacebarPressRef.current > 200) {
        decreaseShield();
      }
    }, 200);
  };

  const decreaseShield = () => {
    // Always clear any existing timeout first
    if (shieldTimeoutRef.current) {
      clearTimeout(shieldTimeoutRef.current);
      shieldTimeoutRef.current = null;
    }

    // Set shield value with function to ensure we have the latest value
    setShieldValue((prev) => {
      // If component is unmounted, don't update state
      if (!isComponentMounted.current) return prev;

      const newValue = Math.max(prev - 1, 0);

      // If shield reaches 0, set shield inactive and don't schedule another decrease
      if (newValue === 0) {
        setIsShieldActive(false);
        return 0;
      }

      // Schedule next decrease AFTER state is updated
      // This ensures we're not creating multiple timeouts
      shieldTimeoutRef.current = setTimeout(() => {
        // Verify component is still mounted
        if (isComponentMounted.current) {
          decreaseShield();
        }
      }, 100);

      return newValue;
    });
  };

  // Setup keyboard handling for spacebar
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        activateShield();
      }
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  // Start boss attack timer
  useEffect(() => {
    // Reset shield
    setShieldValue(0);
    setIsShieldActive(false);

    // Clear any existing timer
    if (attackTimerRef.current) {
      clearTimeout(attackTimerRef.current);
      attackTimerRef.current = null;
    }

    // Set attack timer
    attackTimerRef.current = setTimeout(() => {
      // Calculate damage reduction based on shield value
      const damageReduction = shieldValueRef.current / 100; // 0 to 1

      // Play appropriate sound based on shield level
      if (shieldValueRef.current > 75) {
        soundPlay("shieldBlock");
      } else if (shieldValueRef.current > 25) {
        soundPlay("shieldPartial");
      } else {
        soundPlay("heroHurt");
      }

      // Call the attack handler with damage reduction
      onAttack(damageReduction);

      // Reset timer ref
      attackTimerRef.current = null;
    }, countdownTime);

    // Cleanup when component unmounts
    return () => {
      if (attackTimerRef.current) {
        clearTimeout(attackTimerRef.current);
        attackTimerRef.current = null;
      }
    };
  }, [countdownTime, onAttack, soundPlay]);

  // Track component mount status
  useEffect(() => {
    isComponentMounted.current = true;

    return () => {
      isComponentMounted.current = false;

      // Clear all timeouts on unmount
      if (shieldTimeoutRef.current) {
        clearTimeout(shieldTimeoutRef.current);
        shieldTimeoutRef.current = null;
      }

      if (attackTimerRef.current) {
        clearTimeout(attackTimerRef.current);
        attackTimerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="absolute w-full h-full z-30 flex flex-col justify-center items-center pointer-events-none">
      <div className="w-[40rem] h-[20rem] flex flex-col justify-center items-center rounded-lg relative">
        <Image
          src={signTallImage}
          alt="Button Sign"
          className="w-full h-full absolute top-0 -z-[1] left-0 [image-rendering:pixelated]"
        />

        <h1 className="text-2xl font-bold mb-4">Defense</h1>
        <p className="mb-6 text-center max-w-md">
          Spam SPACEBAR to raise your shield!
        </p>

        {/* Shield progress bar */}
        <div className="shield-progress-container mb-4 relative">
          <div
            className="shield-progress-bar"
            style={{ width: `${shieldValue}%` }}
          ></div>
          <span className="absolute right-2 top-0 text-white text-xs">
            {Math.round(shieldValue)}%
          </span>
        </div>

        {/* Status text based on shield level */}
        <p
          className={`text-lg font-bold ${
            shieldValue > 75
              ? "text-green-500"
              : shieldValue > 50
                ? "text-blue-400"
                : shieldValue > 25
                  ? "text-yellow-500"
                  : "text-red-500"
          }`}
        >
          {shieldValue > 75
            ? "PERFECT DEFENSE!"
            : shieldValue > 50
              ? "STRONG DEFENSE!"
              : shieldValue > 25
                ? "WEAK DEFENSE!"
                : "VULNERABLE!"}
        </p>
      </div>
      {/* Shield effect portal */}
      {portalTarget &&
        isShieldActive &&
        createPortal(
          <div
            className="absolute inset-0 border-4 border-cyan-400 opacity-40 rounded-full shield-active"
            style={{
              opacity: Math.max(0.2, shieldValue / 150),
            }}
          />,
          portalTarget
        )}
    </div>
  );
}

export default BossDefense;
