"use client";
import { Button } from "@/components/ui/button";
import { UpdateUserBody } from "@/types/user";
import { updateUser } from "@/utils/api/user";
import { useRouter } from "next/navigation";

const Gift = () => {
  const router = useRouter();
  const handleUpdateUser = async (updateData: UpdateUserBody) => {
    const response = await updateUser(updateData);
    if (response) {
      router.push("/end");
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center ">
      <div className="bg-white shadow-md rounded-lg p-4 opacity-80 w-96 items-center justify-center ">
        <h1 className="text-center pb-3 m-3 text-xl">Choose your power up</h1>
        <div className="grid grid-cols-2 gap-4">
          <Button
            className="flex "
            variant={"default"}
            size={"lg"}
            onClick={() => handleUpdateUser({ attack: 20 })}
          >
            + 20 ATK
          </Button>
          <Button
            className="flex "
            variant={"default"}
            size={"lg"}
            onClick={() => handleUpdateUser({ defense: 20 })}
          >
            + 20 DEF
          </Button>
          <Button
            className="flex "
            variant={"default"}
            size={"lg"}
            onClick={() => handleUpdateUser({ speed: 20 })}
          >
            + 20 SPD
          </Button>
          <Button
            className="flex "
            variant={"default"}
            size={"lg"}
            onClick={() => handleUpdateUser({ critical: 20 })}
          >
            + 20% Armor pierce
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Gift;
