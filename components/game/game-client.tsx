"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import heroImage from "@/app/assets/character/hero.png";
import monsterImage from "@/app/assets/character/monster.png";
import HealthBar from "@/components/health/health-bar";
import signImage from "@/app/assets/hud/sign.webp";
import signTallImage from "@/app/assets/hud/sign-tall.webp";
import buttonImage from "@/app/assets/hud/button-wide.webp";
import { LevelData, QuestionData } from "@/types/level";
import GameTimer from "../timer/game-timer";
import "@/app/game.css";
import { redirect } from "next/navigation";
import { User } from "@/types/user";

const API_URL =
  process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000/api/v1";

const SoundManager = {
  sounds: {} as Record<string, HTMLAudioElement>,

  preload: (soundId: string, url: string, volume: number = 1.0) => {
    const audio = new Audio(url);
    audio.volume = volume;
    // Preload the audio
    audio.load();
    SoundManager.sounds[soundId] = audio;
  },

  play: (soundId: string) => {
    const sound = SoundManager.sounds[soundId];
    if (sound) {
      // Clone the audio element to allow overlapping sounds
      const clone = sound.cloneNode() as HTMLAudioElement;
      clone.volume = sound.volume;
      clone.play();
    }
  },
};

export default function GamePage({
  levelData,
  cookie,
}: {
  levelData: LevelData;
  cookie: string;
}) {
  const [loading, setLoading] = useState(true);
  const [heroPosition, setHeroPosition] = useState(0);
  const [isHeroAttacking, setIsHeroAttacking] = useState(false);
  const [showCorrectEffect, setShowCorrectEffect] = useState(false);
  const [showWrongEffect, setShowWrongEffect] = useState(false);
  const [isTimerStarted, setIsTimerStarted] = useState(false);

  const [shieldValue, setShieldValue] = useState(0);
  const [isShieldActive, setIsShieldActive] = useState(false);
  const shieldTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSpacebarPressRef = useRef<number>(0);

  // Hero animation reference
  const heroAnimationRef = useRef<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  interface EntityProperty {
    health: number;
    maxHealth: number;
    attack: number;
  }

  interface HeroProperty extends EntityProperty {
    
  }

  interface BossProperty extends EntityProperty {
    
  }

  const [gameState, setGameState] = useState<{
    hero: HeroProperty;
    boss: BossProperty;
    question: QuestionData | null;
    currentQuestionIndex: number;
    whoseTurn: "hero" | "boss";
  }>({
    hero: {
      health: 80,
      maxHealth: 100,
      attack: 10,
    },
    boss: {
      health: levelData.boss_hp,
      maxHealth: levelData.boss_hp,
      attack: levelData.boss_attack,
    },
    question: null,
    currentQuestionIndex: 0,
    whoseTurn: "hero",
  });

  const fetchQuestion = async (questionId: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/questions/questions/${questionId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookie}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch question");
      }

      const data = await response.json();
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      return null;
    }
  };

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      console.log("Enter key pressed");
    } else if (event.key === "Escape") {
      console.log("Escape key pressed");
    } else if (event.code === "Space") {
      event.preventDefault(); // Prevent default spacebar behavior
      console.log("Space key pressed");
      // If it's boss's turn, activate shield
      if (gameState.whoseTurn === "boss") {
        activateShield();
      }
    } else if (event.key === "1") {
      console.log("1 key pressed");
      onSelectChoice(0);
    } else if (event.key === "2") {
      console.log("2 key pressed");
      onSelectChoice(1);
    } else if (event.key === "3") {
      console.log("3 key pressed");
      onSelectChoice(2);
    } else if (event.key === "4") {
      console.log("4 key pressed");
      onSelectChoice(3);
    } else if (event.key === "5") {
      console.log("5 key pressed");
      onSelectChoice(4);
    }
  }

  const activateShield = () => {
    // Record timestamp of press
    const now = Date.now();
    lastSpacebarPressRef.current = now;

    // Play shield sound (only if not too frequent)
    if (shieldValue % 10 === 0) {
      SoundManager.play("shieldRaise");
    }

    // Increase shield value (max 100)
    setShieldValue((prev) => Math.min(prev + 3, 100));

    // Set shield as active
    setIsShieldActive(true);

    // Clear any existing timeout
    if (shieldTimeoutRef.current) {
      clearTimeout(shieldTimeoutRef.current);
    }

    // Set timeout to start decreasing shield if spacebar not pressed
    shieldTimeoutRef.current = setTimeout(() => {
      // Only start decreasing if it's been more than 200ms since last press
      if (Date.now() - lastSpacebarPressRef.current > 200) {
        decreaseShield();
      }
    }, 200);
  };

  // Function to gradually decrease shield when not pressing spacebar
  const decreaseShield = () => {
    setShieldValue((prev) => {
      const newValue = Math.max(prev - 1, 0);

      // If shield reaches 0, set shield inactive
      if (newValue === 0) {
        setIsShieldActive(false);
        return 0;
      }

      // Schedule next decrease
      shieldTimeoutRef.current = setTimeout(decreaseShield, 50);

      return newValue;
    });
  };

  // Animation for hero attack
  const performHeroAttack = () => {
    setIsHeroAttacking(true);

    // Move hero forward
    const startPos = 0;
    const midPos = 200; // Distance to move forward
    const duration = 1000; // Total animation duration in ms
    const startTime = Date.now();

    // Player attack sound
    SoundManager.play("heroAttack");

    // Cancel any existing animation
    if (heroAnimationRef.current) {
      cancelAnimationFrame(heroAnimationRef.current);
    }

    // Animation function
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Forward movement (0 to 0.4 of total time)
      if (progress < 0.4) {
        const forwardProgress = progress / 0.4;
        setHeroPosition(startPos + forwardProgress * midPos);
      }
      // Attack pause (0.4 to 0.6 of total time)
      else if (progress < 0.6) {
        setHeroPosition(midPos);
      }
      // Return movement (0.6 to 1.0 of total time)
      else {
        const returnProgress = (progress - 0.6) / 0.4;
        setHeroPosition(midPos - returnProgress * midPos);
      }

      // Continue animation if not complete
      if (progress < 1) {
        heroAnimationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        setHeroPosition(0);
        setIsHeroAttacking(false);
      }
    };

    // Start animation
    heroAnimationRef.current = requestAnimationFrame(animate);
  };

  async function featchHeroStats() {
    try {
      const response = await fetch(`${API_URL}/users/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
      });
      if (!response.ok) {
        redirect("/login");
      }
      const data : User = (await response.json()).data;

      const heroStats : HeroProperty = {
        health: data.hp,
        attack: data.attack,
        maxHealth: data.hp,
      };
      
      setGameState((prevState) => ({
        ...prevState,
        hero: heroStats,
      }));
    } catch (error) {
      console.error("Error fetching hero stats:", error);
    }
  }


  const handleBossAttack = () => {
    // Calculate damage based on shield value
    // More shield = less damage
    const baseDamage = 20;
    const damageReduction = shieldValue / 100; // 0 to 1
    const actualDamage = Math.round(baseDamage * (1 - damageReduction));

    // Play appropriate sound
    if (shieldValue > 75) {
      SoundManager.play("shieldBlock");
    } else if (shieldValue > 25) {
      SoundManager.play("shieldPartial");
    } else {
      SoundManager.play("heroHurt");
    }

    // Update game state
    setGameState((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        health: Math.max(0, prev.hero.health - actualDamage),
      },
      whoseTurn: "hero",
    }));

    // Reset shield
    setShieldValue(0);
    setIsShieldActive(false);

    // Set timer for next question
    setIsTimerStarted(true);
  };

  function onSelectChoice(choice: number) {
    if (gameState.whoseTurn !== "hero") {
      console.log("Not your turn!");
      return;
    }
    if (!choices) return;
    const selectedAnswer = choices[choice];
    const isCorrect = selectedAnswer === answer;
    if (isCorrect) {
      setShowCorrectEffect(true);

      // Start hero attack animation
      performHeroAttack();
      // Prefetch the next question
      const questionId =
        levelData.question_ids[gameState.currentQuestionIndex + 1];
      fetchQuestion(questionId).then((question) => {
        if (question) {
          setGameState((prevState) => ({
            ...prevState,
            question,
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
          }));
        }
      });
      setGameState((prevState) => ({
        ...prevState,
        boss: {
          ...prevState.boss,
          health: prevState.boss.health - 10, // Example damage
        },
        whoseTurn: "boss",
      }));
      setIsTimerStarted(false);
      setTimeout(() => {
        // Update game state to reflect correct answer
        setIsTimerStarted(true);
        setShowCorrectEffect(false);
      }, 1500); // Wait for animation to complete
      // Handle correct answer (e.g., update game state, show success message)
    }
    if (!isCorrect) {
      setShowWrongEffect(true);

      // Shake the hero to indicate damage
      if (heroRef.current) {
        heroRef.current.classList.add("shake-animation");
        SoundManager.play("wrongAnswer");
        setTimeout(() => {
          if (heroRef.current) {
            heroRef.current.classList.remove("shake-animation");
          }
          setShowWrongEffect(false);

          // Update hero health on wrong answer
          setGameState((prevState) => ({
            ...prevState,
            hero: {
              ...prevState.hero,
              health: prevState.hero.health - 5, // Less damage for wrong answer
            },
            whoseTurn: "boss",
          }));
        }, 500);
      }
    }
  }

  function onTimeUp() {
    console.log("Time's up!");
    setShowWrongEffect(true);
    setGameState((prevState) => ({
      ...prevState,
      whoseTurn: "boss",
    }));
    setIsTimerStarted(false);
    // Handle time up (e.g., show message, update game state)
  }

  // Make sure our keyboard handler updates when relevant states change
  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [gameState]); // Add dependencies here

  useEffect(() => {
    const fetchData = async () => {
      const questionId = levelData.question_ids[gameState.currentQuestionIndex];
      const question = await fetchQuestion(questionId);
      if (question) {
        setGameState((prevState) => ({
          ...prevState,
          question,
        }));
      }
    };

    fetchData();
    featchHeroStats();

    console.log("levelData", gameState);
  }, [levelData]);

  useEffect(() => {
    if (gameState.whoseTurn === "boss") {
      // Reset shield
      setShieldValue(0);
      setIsShieldActive(false);

      // Give player time to raise shield before boss attacks
      const attackTimer = setTimeout(() => {
        handleBossAttack();
      }, 5000); // 5 seconds to raise shield

      return () => clearTimeout(attackTimer);
    }
  }, [gameState.whoseTurn]);

  useEffect(() => {
    return () => {
      if (heroAnimationRef.current) {
        cancelAnimationFrame(heroAnimationRef.current);
      }
      if (shieldTimeoutRef.current) {
        clearTimeout(shieldTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Preload all game sounds
    SoundManager.preload(
      "heroAttack",
      "https://s3.imjustin.dev/hackathon/hitHurt.wav",
      0.5
    );
    SoundManager.preload(
      "correctAnswer",
      "https://s3.imjustin.dev/hackathon/powerUp.wav",
      0.4
    );
    SoundManager.preload(
      "wrongAnswer",
      "https://s3.imjustin.dev/hackathon/explosion.wav",
      0.4
    );
    SoundManager.preload(
      "timeUp",
      "https://s3.imjustin.dev/hackathon/hitHurt.wav",
      0.5
    );

    // Cleanup on unmount
    return () => {
      // Nothing to clean up for audio preloading
    };
  }, []);

  let answer = gameState.question?.answer.split(",")[0];
  let choices = gameState.question?.answer.split(",").slice(1)[0].split("|");

  return (
    <div className="w-full h-full relative">
      <div className="w-full h-full flex flex-col justify-between items-center">
        <div className=" w-full h-20 flex justify-between items-start px-5">
          <div className="flex flex-col gap-2">
            <span className="text-white font-[Press_Start_2P] text-sm">
              Boss
            </span>
            <HealthBar
              value={gameState.boss.health}
              max={gameState.boss.maxHealth}
            />
          </div>
          <div className="w-40 relative aspect-square flex items-center justify-center">
            <Image
              src={signImage}
              alt="Level Sign"
              className="w-full h-full object-cover object-center absolute top-0 left-0 -z-[1] [image-rendering:pixelated]"
            />
            <div className="text-black font-[Press_Start_2P] text-lg  flex flex-col items-center">
              <span>Level</span>
              <span>{levelData.level}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-white font-[Press_Start_2P] text-sm">
              Hero
            </span>
            <HealthBar value={9} max={10} />
          </div>
        </div>

        <div className="flex justify-between w-full">
          {/* Monster section */}
          <div
            className={`relative ${showCorrectEffect ? "flash-correct" : ""}`}
          >
            <span className="bg-neutral-200/60 p-1 absolute left-10 right-10 backdrop-blur-sm">
              {levelData.boss_name}
            </span>
            <Image
              src={monsterImage}
              alt="monster"
              className="h-80 md:h-96 w-fit object-cover -scale-x-100 [image-rendering:pixelated]"
            />
          </div>
          {/* Hero section with dynamic positioning */}
          <div
            ref={heroRef}
            className={`relative ${showWrongEffect ? "flash-wrong" : ""}`}
            style={{
              transform: `translateX(${-heroPosition}px)`,
              transition: isHeroAttacking ? "none" : "transform 0.5s ease-out",
            }}
          >
            <span className="bg-neutral-200/60 p-1 absolute left-10 right-10 backdrop-blur-sm">
              User Name
            </span>
            <Image
              src={heroImage}
              alt="hero"
              className={`h-80 md:h-96 w-fit object-cover -scale-x-100 [image-rendering:pixelated] ${
                isHeroAttacking ? "animate-pulse" : ""
              }`}
            />
          </div>
        </div>
        {/* Overlay */}
        <div
          className={`absolute w-full h-full z-30 flex justify-center items-center pointer-events-none ${isHeroAttacking ? "hidden" : ""}`}
        >
          {gameState.whoseTurn === "hero" && (
            <div className="w-[40rem] h-[30rem] flex flex-col justify-center items-center rounded-lg relative">
              <Image
                src={signTallImage}
                alt="Button Sign"
                className="w-full h-full absolute  top-0 -z-[1] left-0 [image-rendering:pixelated]"
              />
              <h1 className="text-2xl font-bold mb-4">Question</h1>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="flex flex-col items-center">
                  <p className="text-lg">{gameState.question?.question}</p>
                  {choices && (
                    <div className="flex flex-col gap-2 mt-4">
                      {choices.map((choice, index) => (
                        <div className="relative w-full" key={index}>
                          <button
                            className="px-4 py-2 rounded relative text-black w-full z-10"
                            onClick={() => {
                              // Handle choice click
                              onSelectChoice(index);
                              console.log("Selected choice (click):", choice);
                            }}
                          >
                            {choice}
                          </button>
                          <Image
                            src={buttonImage}
                            alt="Button Sign"
                            className="w-full h-full absolute  top-0 left-0 [image-rendering:pixelated]"
                          ></Image>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {gameState.whoseTurn === "boss" && (
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
                <div className="shield-progress-container mb-4">
                  <div
                    className="shield-progress-bar"
                    style={{ width: `${shieldValue}%` }}
                  ></div>
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
            </div>
          )}
        </div>
      </div>
      {!loading && gameState.question && isTimerStarted && (
        <div className="fixed w-full z-50 flex justify-center items-center bottom-0">
          <GameTimer
            duration={gameState.question.time_countdown}
            handleTimeUp={() => {
              // Handle time up
              onTimeUp();
            }}
          />
        </div>
      )}
    </div>
  );
}
