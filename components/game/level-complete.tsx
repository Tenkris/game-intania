"use client";
import signTallImage from "@/app/assets/hud/sign-tall.webp";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UpdateUserBody, User } from "@/types/user";
import { updateUser, getMyUser } from "@/utils/api/user";
import ButtonImage from "@/components/common/ButtonImage";
import GamblingCarousel from "../gift/Carousel";

const mockUpgradables = [
  { label: "+ 20 ATK", attribute: "attack", value: 20 },
  { label: "+ 20 DEF", attribute: "defense", value: 20 },
  { label: "+ 20 SPD", attribute: "speed", value: 20 },
  //   { label: "+ 20% Crit", attribute: "critical", value: 20 },
];
const LevelComplete = ({ LevelCompleted }: { LevelCompleted: boolean }) => {
  const router = useRouter();
  const [showNext, setShowNext] = useState<boolean>(false);
  const [showGambling, setShowGambling] = useState<boolean>(false);

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

  const gambling = async () => {
    setShowGambling(true);
  };

  async function onFinishGambling(field: keyof User, value: number) {
    await handleUpdateUser(field, value);
    setShowGambling(false);

  }

  if (LevelCompleted && !showNext && !showGambling)
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
            <ButtonImage
              key={item.label}
              onClick={() =>
                handleUpdateUser(item.attribute as keyof User, item.value)
              }
            >
              {item.label}
            </ButtonImage>
          ))}
          <ButtonImage onClick={gambling}>Gambling</ButtonImage>
        </div>
      </div>
    );
  
  if (LevelCompleted && !showNext && showGambling)
    return (
      <GamblingCarousel updateUser={onFinishGambling} />
    );

  if (LevelCompleted && showNext)
    return (
      <div className="w-[40rem] h-[30rem] flex flex-col justify-center items-center rounded-lg relative">
        <Image
          src={signTallImage}
          alt="Button Sign"
          className="w-full h-full absolute  top-0 -z-[1] left-0 [image-rendering:pixelated]"
        />
        <h1 className="text-2xl font-bold mb-4">Go to Level?</h1>
        <div className="flex flex-row gap-5 p-4">
          <ButtonImage onClick={() => router.push("/")}>Home</ButtonImage>
          <ButtonImage onClick={() => window.location.reload()}>
            Next Level
          </ButtonImage>
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
          <ButtonImage onClick={() => router.push("/")}>Home</ButtonImage>
          <ButtonImage onClick={() => window.location.reload()}>
            Try Again?
          </ButtonImage>
        </div>
      </div>
    );
};

export default LevelComplete;
