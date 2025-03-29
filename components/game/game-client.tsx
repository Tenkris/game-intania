"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import heroImage from "@/app/assets/character/hero.png";
import monsterImage from "@/app/assets/character/monster.png";
import HealthBar from "@/components/health/health-bar";
import signImage from "@/app/assets/hud/sign.webp";
import { LevelData, QuestionData } from "@/types/level";

const API_URL =
  process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000/api/v1";

export default function GamePage({
  levelData,
  cookie,
}: {
  levelData: LevelData;
  cookie: string;
}) {
  const [loading, setLoading] = useState(true);

  const [gameState, setGameState] = useState<{
    hero: { health: number; maxHealth: number };
    boss: { health: number; maxHealth: number };
    question: QuestionData | null;
    currentQuestionIndex: number;
    whoseTurn: "hero" | "boss";
  }>({
    hero: {
      health: 80,
      maxHealth: 100,
    },
    boss: {
      health: levelData.boss_hp,
      maxHealth: levelData.boss_hp,
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
      console.log("Space key pressed");
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

  function onSelectChoice(choice: number) {
    console.log("choices select: ", choices);
    if (!choices) return;
    console.log("Selected answer:", choices[choice]);
    const selectedAnswer = choices[choice];
    const isCorrect = selectedAnswer === answer;
    console.log("Is correct:", isCorrect);
    if (isCorrect) {
      console.log("Correct answer!");
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
      // Update game state to reflect correct answer
      setGameState((prevState) => ({
        ...prevState,
        boss: {
          ...prevState.boss,
          health: prevState.boss.health - 10, // Example damage
        },
      }));
      console.log("Boss health:", gameState.boss.health);
      // Handle correct answer (e.g., update game state, show success message)
    }
    if (!isCorrect) {
      console.log("Wrong answer!");

      // Handle wrong answer (e.g., update game state, show error message)
    }
  }

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

    console.log("levelData", gameState);
  }, [levelData]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [gameState]);

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
          <div className="relative">
            <span className="bg-neutral-200/60 p-1 absolute left-10 right-10 backdrop-blur-sm">
              {levelData.boss_name}
            </span>
            <Image
              src={monsterImage}
              alt="background"
              className="h-80 md:h-96 w-fit object-cover -scale-x-100 [image-rendering:pixelated]"
            />
          </div>
          <div className="relative">
            <span className="bg-neutral-200/60 p-1 absolute left-10 right-10 backdrop-blur-sm">
              User Name
            </span>
            <Image
              src={heroImage}
              alt="background"
              className="h-80 md:h-96 w-fit object-cover -scale-x-100 [image-rendering:pixelated]"
            />
          </div>
        </div>
        {/* Overlay */}
        <div className="absolute w-full h-full z-30 flex justify-center items-center">
          <div className="bg-white/80 w-1/2 h-1/2 flex flex-col justify-center items-center rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Question</h1>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-lg">{gameState.question?.question}</p>
                {choices && (
                  <div className="flex flex-col gap-2 mt-4">
                    {choices.map((choice, index) => (
                      <button
                        key={index}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => {
                          onSelectChoice(index);
                          // Handle choice click
                        }}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
