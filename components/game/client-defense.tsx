"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import signTallImage from "@/app/assets/hud/sign-tall.webp";
import { createPortal } from "react-dom";

interface BossDefenseProps {
  onAttack: (damageReduction: number) => void;
  countdownTime: number;
  soundPlay: (soundId: string) => void;
  heroRef: React.RefObject<HTMLDivElement | null>;
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
  const animationFrameRef = useRef<number | null>(null);
  const shieldDecayRateRef = useRef(1); // Points to decrease per decay cycle
  const shieldIncreaseRateRef = useRef(5); // Points to increase per press

  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  // Attack timer
  const attackTimerRef = useRef<NodeJS.Timeout | null>(null);
  const spacebarPressCount = useRef(0);
  const lastPressTimeRef = useRef(0);

  // Update ref when shield value changes
  useEffect(() => {
    shieldValueRef.current = shieldValue;

    // Adjust decay rate based on shield value for smoother feel
    if (shieldValue > 75) {
      shieldDecayRateRef.current = 2; // Faster decay at higher levels
    } else if (shieldValue > 50) {
      shieldDecayRateRef.current = 1.5;
    } else if (shieldValue > 25) {
      shieldDecayRateRef.current = 1;
    } else {
      shieldDecayRateRef.current = 0.8; // Slower decay when shield is low
    }

    // Dynamic boost for rapid pressing
    const now = Date.now();
    if (now - lastPressTimeRef.current < 150) {
      spacebarPressCount.current++;
      // Increase shield boost for consecutive rapid presses (up to a limit)
      shieldIncreaseRateRef.current = Math.min(
        8,
        5 + spacebarPressCount.current * 0.3
      );
    } else {
      spacebarPressCount.current = 0;
      shieldIncreaseRateRef.current = 5;
    }
    lastPressTimeRef.current = now;
  }, [shieldValue]);

  useEffect(() => {
    if (heroRef.current) {
      setPortalTarget(heroRef.current);
    }

    return () => {
      setPortalTarget(null);
    };
  }, [heroRef]);

  // Function to activate shield - now using requestAnimationFrame for smoother updates
  const activateShield = () => {
    // Record timestamp of press
    const now = Date.now();
    lastSpacebarPressRef.current = now;

    // Play sound at certain thresholds for better feedback
    if (
      Math.floor(shieldValue / 10) <
      Math.floor((shieldValue + shieldIncreaseRateRef.current) / 10)
    ) {
      soundPlay("shield");
    }

    // Increase shield value using requestAnimationFrame for smoother animation
    if (animationFrameRef.current === null) {
      const targetValue = Math.min(
        shieldValueRef.current + shieldIncreaseRateRef.current,
        100
      );

      const animateShieldIncrease = () => {
        if (!isComponentMounted.current) return;

        if (shieldValueRef.current < targetValue) {
          // Smoother increase with smaller increments
          setShieldValue((prev) => {
            const newValue = Math.min(prev + 1, targetValue);
            return newValue;
          });
          animationFrameRef.current = requestAnimationFrame(
            animateShieldIncrease
          );
        } else {
          animationFrameRef.current = null;
        }
      };

      animationFrameRef.current = requestAnimationFrame(animateShieldIncrease);
    }

    // Set shield as active with a small delay for visual smoothness
    if (!isShieldActive) {
      setTimeout(() => {
        setIsShieldActive(true);
      }, 10);
    }

    // Clear any existing timeout to prevent premature decay
    if (shieldTimeoutRef.current) {
      clearTimeout(shieldTimeoutRef.current);
      shieldTimeoutRef.current = null;
    }

    // Set timeout to start decreasing shield if spacebar not pressed
    shieldTimeoutRef.current = setTimeout(() => {
      // Only start decreasing if it's been more than 300ms since last press (more forgiving)
      if (Date.now() - lastSpacebarPressRef.current > 300) {
        decreaseShield();
      }
    }, 300); // Longer delay before decay starts
  };

  const decreaseShield = () => {
    // Always clear any existing timeout first
    if (shieldTimeoutRef.current) {
      clearTimeout(shieldTimeoutRef.current);
      shieldTimeoutRef.current = null;
    }

    // Use requestAnimationFrame for smoother decreasing
    const animateShieldDecrease = () => {
      if (!isComponentMounted.current) return;

      setShieldValue((prev) => {
        const newValue = Math.max(prev - shieldDecayRateRef.current, 0);

        // If shield reaches 0, set shield inactive with a transition
        if (newValue === 0) {
          setIsShieldActive(false);
          return 0;
        }

        // Schedule next decrease with requestAnimationFrame
        shieldTimeoutRef.current = setTimeout(() => {
          // Verify component is still mounted
          if (isComponentMounted.current) {
            decreaseShield();
          }
        }, 120); // Slightly slower decay for better control

        return newValue;
      });
    };

    animateShieldDecrease();
  };

  // Setup keyboard handling for spacebar with debounce
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        if (event.repeat){
          console.log("You are not allowed to hold the spacebar for guarding.");
          return;
        }
        
        // Small debounce to prevent too many rapid calls (20ms is still responsive but prevents overload)
        const now = Date.now();
        if (now - lastSpacebarPressRef.current > 20) {
          activateShield();
        }
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

  // Track component mount status and ensure clean unmounting
  useEffect(() => {
    isComponentMounted.current = true;

    return () => {
      isComponentMounted.current = false;

      // Clear all timeouts and animation frames on unmount
      if (shieldTimeoutRef.current) {
        clearTimeout(shieldTimeoutRef.current);
        shieldTimeoutRef.current = null;
      }

      if (attackTimerRef.current) {
        clearTimeout(attackTimerRef.current);
        attackTimerRef.current = null;
      }

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
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

        {/* Shield progress bar with smoother transition */}
        <div className="shield-progress-container mb-4 relative w-4/5 h-6 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="shield-progress-bar h-full rounded-full transition-all duration-100 ease-out"
            style={{
              width: `${shieldValue}%`,
              background: `linear-gradient(90deg, 
                ${shieldValue > 75 ? "#10b981" : shieldValue > 50 ? "#3b82f6" : shieldValue > 25 ? "#f59e0b" : "#ef4444"} 0%, 
                ${shieldValue > 75 ? "#34d399" : shieldValue > 50 ? "#60a5fa" : shieldValue > 25 ? "#fbbf24" : "#f87171"} 100%)`,
            }}
          ></div>
          <span className="absolute right-2 top-0 text-white text-xs font-semibold mix-blend-difference">
            {Math.round(shieldValue)}%
          </span>
        </div>

        {/* Status text based on shield level with fixed positioning */}
        <div className="h-10 flex items-center justify-center">
          {" "}
          {/* Fixed height container */}
          <p
            className={`text-lg font-bold ${
              shieldValue > 75
                ? "text-green-500 shield-status-perfect"
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
      </div>

      {/* Shield effect portal with smoother transitions */}
      {portalTarget &&
        createPortal(
          <div
            className={`absolute inset-0 rounded-full transition-all duration-200 ease-out ${
              isShieldActive ? "opacity-100" : "opacity-0"
            }`}
            style={{
              border: `${Math.min(8, 4 + shieldValue / 25)}px solid ${
                shieldValue > 75
                  ? "rgba(16, 185, 129, 0.6)"
                  : shieldValue > 50
                    ? "rgba(59, 130, 246, 0.6)"
                    : shieldValue > 25
                      ? "rgba(245, 158, 11, 0.6)"
                      : "rgba(239, 68, 68, 0.6)"
              }`,
              boxShadow: `0 0 ${Math.min(20, 5 + shieldValue / 10)}px ${
                shieldValue > 75
                  ? "rgba(16, 185, 129, 0.4)"
                  : shieldValue > 50
                    ? "rgba(59, 130, 246, 0.4)"
                    : shieldValue > 25
                      ? "rgba(245, 158, 11, 0.4)"
                      : "rgba(239, 68, 68, 0.4)"
              }`,
            }}
          />,
          portalTarget
        )}
    </div>
  );
}

export default BossDefense;
