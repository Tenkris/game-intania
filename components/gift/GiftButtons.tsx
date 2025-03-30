"use client";
import { Button } from "@/components/ui/button";
import { UpdateUserBody, User } from "@/types/user";
import { updateUser, getMyUser } from "@/utils/api/user";
import { useRouter } from "next/navigation";
import ButtonImage from "@/components/common/ButtonImage";
import GamblingCarousel from "./Carousel";
import { useEffect, useState } from "react";

const mockUpgradables = [
  { label: "+ 20 ATK", attribute: "attack", value: 20 },
  { label: "+ 20 DEF", attribute: "defense", value: 20 },
  { label: "+ 20 HP", attribute: "hp", value: 20 },
  // { label: "+ 20% Critical", attribute: "critical", value: 20 },
];
const GiftButtons = () => {
  const router = useRouter();

  const [isGambling, setIsGambling] = useState(false);

  const handleUpdateUser = async (field: keyof User, value: number) => {
    const me = await getMyUser();
    
    if (me) {
      console.log(me);
      if (typeof me[field] === "number") {
        const updateData: UpdateUserBody = {
          [field]: me[field] + value,
        };
        const response = await updateUser(updateData);
        console.log(response)
        if (response) {
          router.push("/end");
        }
      } else {
        console.error(`Field '${field}' is not a number or is undefined`);
      }
    }
  };

  const gambling = async () => {
    setIsGambling(true);
  }



  return (
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
      <ButtonImage
          onClick={gambling}
        >
        Gambling
      </ButtonImage>
      {
        (isGambling) && (
          <GamblingCarousel updateUser={handleUpdateUser} />
        )
      }
    </div>
  );
};

export default GiftButtons;
