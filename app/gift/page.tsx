"use client";
import { Button } from "@/components/ui/button";
import { UpdateUserBody } from "@/types/user";
import { updateUser } from "@/utils/api/user";
import { useRouter } from "next/navigation";
const mockUpgradables = [
  { label: "+ 20 ATK", attribute: "attack", value: 20 },
  { label: "+ 20 DEF", attribute: "defense", value: 20 },
  { label: "+ 20 SPD", attribute: "speed", value: 20 },
  { label: "+ 20% Critical", attribute: "critical", value: 20 },
];
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
          {mockUpgradables.map((item) => (
            <Button
              key={item.attribute}
              className="flex"
              variant={"default"}
              size={"lg"}
              onClick={() => handleUpdateUser({ [item.attribute]: item.value })}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gift;
