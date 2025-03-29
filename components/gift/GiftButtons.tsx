"use client";
import { Button } from "@/components/ui/button";
import { UpdateUserBody, User } from "@/types/user";
import { updateUser, getMyUser } from "@/utils/api/user";
import { useRouter } from "next/navigation";

const mockUpgradables = [
  { label: "+ 20 ATK", attribute: "attack", value: 20 },
  { label: "+ 20 DEF", attribute: "defense", value: 20 },
  { label: "+ 20 HP", attribute: "hp", value: 20 },
  // { label: "+ 20% Critical", attribute: "critical", value: 20 },
];
const GiftButtons = () => {
  const router = useRouter();

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

  }

  return (
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
      <Button
          className="flex"
          variant={"default"}
          size={"lg"}
          onClick={gambling}
        >
        Gambling
      </Button>
    </div>
  );
};

export default GiftButtons;
