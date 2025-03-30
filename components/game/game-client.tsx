"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import heroImage from "@/app/assets/character/hero.png";
import monsterImage from "@/app/assets/character/monster.png";
import HealthBar from "@/components/health/health-bar";
import signImage from "@/app/assets/hud/sign.webp";
import signTallImage from "@/app/assets/hud/sign-tall.webp";
import buttonImage from "@/app/assets/hud/button-wide.webp";
import { LevelData, QuestionData } from "@/types/level";
import GameTimer from "../timer/game-timer";
import "@/app/game.css";
import { redirect, useRouter } from "next/navigation";
import { UpdateUserBody, User } from "@/types/user";
import BossDefense from "./client-defense";
import { updateUser } from "@/utils/api/user";
import CriticalHit from "./critical-hit";

import LevelComplete from "./level-complete";

import PlayerStats from "./player-stats";

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
  userData,
}: {
  levelData: LevelData;
  cookie: string;
  userData: User;
}) {
  const [loading, setLoading] = useState(true);

  const [showCorrectEffect, setShowCorrectEffect] = useState(false);
  const [showWrongEffect, setShowWrongEffect] = useState(false);
  const [isTimerStarted, setIsTimerStarted] = useState(true);

  const [shieldValue, setShieldValue] = useState(0);
  const [isShieldActive, setIsShieldActive] = useState(false);

  // Hero animation reference
  const [heroPosition, setHeroPosition] = useState(0);
  const [isHeroAttacking, setIsHeroAttacking] = useState(false);
  const heroAnimationRef = useRef<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  interface EntityProperty {
    health: number;
    maxHealth: number;
    attack: number;
  }

  interface HeroProperty extends EntityProperty {
    defense: number;
  }

  interface BossProperty extends EntityProperty {}

  const [bossPosition, setBossPosition] = useState(0);
  const [isBossAttacking, setIsBossAttacking] = useState(false);
  const bossAnimationRef = useRef<number | null>(null);

  const bossRef = useRef<HTMLDivElement>(null);

  const [gameState, setGameState] = useState<{
    hero: HeroProperty;
    boss: BossProperty;
    question: QuestionData | null;
    currentQuestionIndex: number;
    whoseTurn: "hero" | "boss" | "gameOver";
  }>({
    hero: {
      defense: userData.defense,
      health: userData.hp,
      maxHealth: userData.hp,
      attack: userData.attack,
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

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  const countdownRef = useRef(gameState.question?.time_countdown);
  countdownRef.current = gameState.question?.time_countdown;

  const [countdownTime, setCountdownTime] = useState(
    ((gameState.question?.time_countdown ?? 10) * 1000) / 2
  );
  const router = useRouter();

  const [showCriticalHit, setShowCriticalHit] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [damageMultiplier, setDamageMultiplier] = useState(1.0);
  const [showDamageText, setShowDamageText] = useState(false);
  const [damageText, setDamageText] = useState("");

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

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      // Prevent default for game keys
      if (
        [
          "Space",
          "Enter",
          "Escape",
          "Digit1",
          "Digit2",
          "Digit3",
          "Digit4",
          "Digit5",
          "1",
          "2",
          "3",
          "4",
          "5",
        ].includes(event.code) ||
        ["1", "2", "3", "4", "5"].includes(event.key)
      ) {
        event.preventDefault();
      }

      // Log the keypress for debugging
      console.log(
        "Key pressed:",
        event.code,
        "Turn:",
        gameStateRef.current.whoseTurn,
        "Shield:",
        shieldValue
      );
      if (event.key === "1" || event.code === "Digit1") {
        onSelectChoice(0);
      } else if (event.key === "2" || event.code === "Digit2") {
        onSelectChoice(1);
      } else if (event.key === "3" || event.code === "Digit3") {
        onSelectChoice(2);
      } else if (event.key === "4" || event.code === "Digit4") {
        onSelectChoice(3);
      } else if (event.key === "5" || event.code === "Digit5") {
        onSelectChoice(4);
      } else if (event.key === "Escape") {
        // Handle escape key
        router.push("/");
      }
    },
    [gameState.whoseTurn]
  );

  const performHeroAttack = (multiplier = 1.0) => {
    setIsHeroAttacking(true);

    // Move hero forward
    const startPos = 0;
    const midPos = 200; // Distance to move forward
    const duration = 1000; // Total animation duration in ms
    const startTime = Date.now();

    // Player attack sound with volume adjusted for multiplier effect
    SoundManager.sounds["heroAttack"].volume = Math.min(
      0.8,
      0.5 + (multiplier - 1.0) * 0.3
    );
    SoundManager.play("heroAttack");

    // Calculate and show damage text
    const baseDamage = gameStateRef.current.hero.attack; // Base damage value
    const damage = Math.round(baseDamage * multiplier);
    setDamageText(`${damage} (${multiplier.toFixed(1)}x)`);
    setShowDamageText(true);

    // Hide damage text after animation completes
    setTimeout(() => {
      setShowDamageText(false);
    }, 1500);

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

  useEffect(() => {
    shieldValueRef.current = shieldValue;
  }, [shieldValue]);

  async function fetchHeroStats() {
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
      const data: User = (await response.json()).data;

      const heroStats: HeroProperty = {
        health: data.hp,
        attack: data.attack,
        maxHealth: data.hp,
        defense: data.defense,
      };

      setGameState((prevState) => ({
        ...prevState,
        hero: heroStats,
      }));
    } catch (error) {
      console.error("Error fetching hero stats:", error);
    }
  }

  const shieldValueRef = useRef(shieldValue);
  shieldValueRef.current = shieldValue;

  const handleBossAttack = (actualDamage: number) => {
    setIsBossAttacking(true);

    // Move hero forward
    const startPos = 0;
    const midPos = 200; // Distance to move forward
    const duration = 1000; // Total animation duration in ms
    const startTime = Date.now();

    SoundManager.play("bossAttack");

    // Cancel any existing animation
    if (bossAnimationRef.current) {
      cancelAnimationFrame(bossAnimationRef.current);
    }

    // Animation function
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Forward movement (0 to 0.4 of total time)
      if (progress < 0.4) {
        const forwardProgress = progress / 0.4;
        setBossPosition(startPos + forwardProgress * midPos);
      }
      // Attack pause (0.4 to 0.6 of total time)
      else if (progress < 0.6) {
        setBossPosition(midPos);
      }
      // Return movement (0.6 to 1.0 of total time)
      else {
        const returnProgress = (progress - 0.6) / 0.4;
        setBossPosition(midPos - returnProgress * midPos);
      }

      // Continue animation if not complete
      if (progress < 1) {
        bossAnimationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        setBossPosition(0);
        setIsBossAttacking(false);
      }
    };

    // Start animation
    heroAnimationRef.current = requestAnimationFrame(animate);

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

  const handleCriticalHitComplete = (multiplier: number) => {
    setDamageMultiplier(multiplier);
    setShowCriticalHit(false);

    // Now perform the hero attack with the multiplier
    performHeroAttack(multiplier);

    // Update game state with damage based on multiplier
    const baseDamage = gameStateRef.current.hero.attack; // Base damage value
    const damage = Math.round(baseDamage * multiplier);

    setGameState((prevState) => ({
      ...prevState,
      boss: {
        ...prevState.boss,
        health: Math.max(0, prevState.boss.health - damage),
      },
      whoseTurn: "boss",
    }));

    // Reset multiplier after a delay
    setTimeout(() => {
      setDamageMultiplier(1.0);
      setShowCorrectEffect(false);
    }, 1500);
  };

  function onSelectChoice(choice: number) {
    if (gameState.whoseTurn !== "hero") {
      console.log("Not your turn!");
      return;
    }
    if (!choices.current) return;
    const selectedAnswer = choices.current[choice];
    const isCorrect = selectedAnswer === answer.current;
    if (isCorrect) {
      setShowCorrectEffect(true);
      SoundManager.play("correctAnswer");

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

      // Show critical hit mini-game instead of immediately attacking
      setShowCriticalHit(true);
      setIsTimerStarted(false);
    }
    if (!isCorrect) {
      setShowWrongEffect(true);

      setIsTimerStarted(false);

      // Shake the hero to indicate damage
      if (heroRef.current) {
        heroRef.current.classList.add("shake-animation");
        SoundManager.play("wrongAnswer");
        setTimeout(() => {
          if (heroRef.current) {
            heroRef.current.classList.remove("shake-animation");
          }
          setShowWrongEffect(false);
        }, 500);
      }

      setGameState((prevState) => ({
        ...prevState,
        whoseTurn: "boss",
      }));
    }
  }

  useEffect(() => {
    if (gameState.whoseTurn === "boss") {
      setIsTimerStarted(true);
    } else if (gameState.whoseTurn === "hero") {
    }
  }, [gameState.whoseTurn]);

  function onTimeUp() {
    console.log("Time's up!");
    setShowWrongEffect(true);
    setGameState((prevState) => ({
      ...prevState,
      whoseTurn: "boss",
    }));
    setIsTimerStarted(false);
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

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
    fetchHeroStats();
  }, [levelData]);

  useEffect(() => {
    return () => {
      if (heroAnimationRef.current) {
        cancelAnimationFrame(heroAnimationRef.current);
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
      "bossAttack",
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
    SoundManager.preload(
      "shield",
      "https://s3.imjustin.dev/hackathon/shield.wav",
      0.1
    );
    SoundManager.preload(
      "criticalHit",
      "https://s3.imjustin.dev/hackathon/powerUp.wav",
      0.4
    );
    SoundManager.preload(
      "criticalPerfect",
      "https://s3.imjustin.dev/hackathon/confirmation1.wav",
      0.5
    );
    SoundManager.preload(
      "criticalGood",
      "https://s3.imjustin.dev/hackathon/confirmation2.wav",
      0.4
    );

    // Cleanup on unmount
    return () => {
      // Nothing to clean up for audio preloading
    };
  }, []);

  useEffect(() => {
    if (gameState.boss.health <= 0) {
      // Handle boss defeat
      console.log("Boss defeated!");

      const updatedUserData: UpdateUserBody = {
        ...userData,
        level_id: levelData.level + 1,
      };
      updateUser(updatedUserData).then(() => {
        setIsTimerStarted(false);
        // Show Level complete modal
        setShowLevelComplete(true);
        setCompleted(true);
      });

      // set whooseTurn to gameOver
      setGameState((prevState) => ({
        ...prevState,
        whoseTurn: "gameOver",
      }));

      // Show victory animation or message
      // Reset game state or redirect to another page
    } else if (gameState.hero.health <= 0) {
      // Handle hero defeat
      console.log("Hero defeated!");
      setIsTimerStarted(false);
      // Show defeat animation or message
      // Show Level complete modal
      setShowLevelComplete(true);

      // set whooseTurn to gameOver
      setGameState((prevState) => ({
        ...prevState,
        whoseTurn: "gameOver",
      }));
    }
  }, [gameState.boss.health, gameState.hero.health]);

  let answer = useRef(gameState.question?.answer.split(",")[0]);
  answer.current = gameState.question?.answer.split(",")[0];
  let choices = useRef(
    gameState.question?.answer.split(",").slice(1)[0].split("|")
  );
  choices.current = gameState.question?.answer
    .split(",")
    .slice(1)[0]
    .split("|");

  return (
    <div className="w-full h-full">
      {/* Overlay */}
      <div
        className={`absolute w-full h-full z-30 flex justify-center items-center ${isHeroAttacking ? "hidden" : ""}`}
      >
        {gameState.whoseTurn === "hero" &&
          !showCriticalHit &&
          !showLevelComplete && (
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
                  {choices.current && (
                    <div className="flex flex-col gap-2 mt-4">
                      {choices.current.map((choice, index) => (
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

        {/* Critical Hit Component */}
        {showCriticalHit && (
          <CriticalHit onComplete={handleCriticalHitComplete} />
        )}

        {showLevelComplete && <LevelComplete LevelCompleted={completed} />}

        {gameState.whoseTurn === "boss" && (
          <BossDefense
            onAttack={(damageReduction) => {
              // Calculate actual damage
              const baseDamage = levelData.boss_attack;
              const actualDamage = Math.round(
                baseDamage * (1 - damageReduction)
              );

              handleBossAttack(actualDamage);
            }}
            countdownTime={countdownTime}
            soundPlay={(soundId) => SoundManager.play(soundId)}
            heroRef={heroRef} // Pass the hero ref to BossDefense
          />
        )}
      </div>
      {/* Stats */}
      <div className="w-full h-full flex flex-col justify-between items-center">
        <div className=" w-full h-20 flex gap-24 justify-center items-start px-5">
          <div className="flex flex-col gap-2 pt-2 max-w-[32rem]">
            <span className="text-white font-[Press_Start_2P] text-sm">
              {levelData.boss_name}
            </span>
            <HealthBar
              value={gameState.boss.health}
              max={gameState.boss.maxHealth}
            />
          </div>
          <div className="w-full relative flex items-center justify-center">
            <div className="w-48 relative aspect-square flex items-center justify-center">
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
          </div>
          <div className="flex flex-col gap-2 pt-2 max-w-[32rem]">
            <span className="text-white font-[Press_Start_2P] text-sm">
              {userData.name}
            </span>
            <HealthBar
              value={gameState.hero.health}
              max={gameState.hero.maxHealth}
            />
          </div>
        </div>

        <div className="flex justify-between w-full">
          {/* Monster section */}
          <div
            ref={bossRef}
            className={`relative ${showCorrectEffect ? "flash-correct" : ""}`}
            style={{
              transform: `translateX(${bossPosition}px)`,
              transition: isBossAttacking ? "none" : "transform 0.5s ease-out",
            }}
          >
            <span className="bg-neutral-200/60 p-1 absolute left-10 right-10 backdrop-blur-sm text-center" >
              {levelData.boss_name}
            </span>

            {/* Add floating damage text */}
            {showDamageText && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-12 text-yellow-300 font-bold text-2xl animate-float-up">
                {damageText}
              </div>
            )}

            <Image
              src={monsterImage}
              alt="monster"
              className="h-80 md:h-96 w-fit object-cover -scale-x-100 [image-rendering:pixelated]"
            />
          </div>
          {/* Hero section with dynamic positioning */}
          <div
            ref={heroRef}
            className={`relative ${showWrongEffect ? "flash-wrong" : ""} ${isBossAttacking ? "flash-correct" : ""}`}
            style={{
              transform: `translateX(${-heroPosition}px)`,
              transition: isHeroAttacking ? "none" : "transform 0.5s ease-out",
            }}
          >
            <span className="bg-neutral-200/60 p-1 absolute left-10 right-10 backdrop-blur-sm w-fit">
              {userData.name}
            </span>

            {/* Add shield visual effect */}
            {isShieldActive && (
              <div
                className="absolute inset-0 border-4 border-cyan-400 opacity-40 rounded-full shield-active"
                style={{
                  opacity: Math.max(0.2, shieldValue / 150), // Min opacity of 0.2
                }}
              />
            )}
            <Image
              src={heroImage}
              alt="hero"
              className={`h-80 md:h-96 w-fit object-cover -scale-x-100 [image-rendering:pixelated] ${
                isHeroAttacking ? "animate-pulse" : ""
              }`}
            />
          </div>
        </div>
      </div>
      {!loading && gameState.question && isTimerStarted && (
        <div className="fixed w-full z-50 flex justify-center items-center bottom-0">
          {gameState.whoseTurn === "hero" && (
            <GameTimer
              duration={gameState.question.time_countdown}
              handleTimeUp={() => {
                onTimeUp();
              }}
            />
          )}
          {gameState.whoseTurn === "boss" && (
            <GameTimer
              duration={countdownTime / 1000}
              handleTimeUp={() => {}}
            />
          )}
        </div>
      )}
      <PlayerStats
        attack={gameState.hero.attack}
        defense={gameState.hero.defense}
      />
    </div>
  );
}
