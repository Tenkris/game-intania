"use client";
import signTallImage from "@/app/assets/hud/sign-tall.webp";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UpdateUserBody, User } from "@/types/user";
import { updateUser, getMyUser } from "@/utils/api/user";

const mockUpgradables = [
  { label: "+ 20 ATK", attribute: "attack", value: 20 },
  { label: "+ 20 DEF", attribute: "defense", value: 20 },
  { label: "+ 20 SPD", attribute: "speed", value: 20 },
  { label: "+ 20% Crit", attribute: "critical", value: 20 },
];
const LevelComplete = ({ LevelCompleted }: { LevelCompleted: boolean }) => {
  const router = useRouter();
  const [showNext, setShowNext] = useState<boolean>(false);
  const handleUpdateUser = async (field: keyof User, value: number) => {
    const me = await getMyUser();

    if (me) {
      console.log(me);
      if (typeof me[field] === "number") {
        const updateData: UpdateUserBody = {
          [field]: me[field] + value,
        };
        const response = await updateUser(updateData);
        console.log(response);
        if (response) {
          //   router.push("/end");
          setShowNext(true);
        }
      } else {
        console.error(`Field '${field}' is not a number or is undefined`);
      }
    }
  };
  if (LevelCompleted && !showNext)
    return (
      <div className="w-[40rem] h-[30rem] flex flex-col justify-center items-center rounded-lg relative">
        <Image
          src={signTallImage}
          alt="Button Sign"
          className="w-full h-full absolute  top-0 -z-[1] left-0 [image-rendering:pixelated]"
        />
        <h1 className="text-2xl font-bold mb-4">You Win!</h1>
        <h1 className="text-center pb-3 m-3 text-xl">Choose your power up</h1>
        <div className="grid grid-cols-2 gap-4">
          {mockUpgradables.map((item) => (
            <Button
              key={item.attribute}
              className="flex"
              variant={"default"}
              size={"lg"}
              onClick={() =>
                handleUpdateUser(item.attribute as keyof User, item.value)
              }
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    );
  if (LevelCompleted && showNext)
    return (
      <div className="w-[40rem] h-[30rem] flex flex-col justify-center items-center rounded-lg relative">
        <Image
          src={signTallImage}
          alt="Button Sign"
          className="w-full h-full absolute  top-0 -z-[1] left-0 [image-rendering:pixelated]"
        />
        <h1 className="text-2xl font-bold mb-4">Next Level?</h1>
        <div className="flex flex-row gap-5 p-4">
          <Button onClick={() => router.push("/")}>Home</Button>
          <Button onClick={() => router.push("/game")}>Next Level</Button>
        </div>
      </div>
    );
  if (!LevelCompleted)
    return (
      <div className="w-[30rem] h-[20rem] flex flex-col justify-center items-center rounded-lg relative">
        <Image
          src={signTallImage}
          alt="Button Sign"
          className="w-full h-full absolute  top-0 -z-[1] left-0 [image-rendering:pixelated]"
        />
        <h1 className="text-2xl font-bold mb-4">You Lose!</h1>
        <div className="flex flex-row gap-5 p-4">
          <Button onClick={() => router.push("/")}>Home</Button>
          <Button
            onClick={() => {
              if (window.location.pathname === "/game") {
                window.location.reload();
              } else {
                router.push("/game");
              }
            }}
          >
            Try Again?
          </Button>
        </div>
      </div>
    );
};

export default LevelComplete;
