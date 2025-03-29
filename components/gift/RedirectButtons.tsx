'use client'
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const RedirectButton = () => {
  const router = useRouter();
  return (
    <div className="flex flex-row w-full items-center justify-center gap-4">
      <Button onClick={() => router.push("/")}>Home</Button>
      {/* might need to fix the game path later (get user level -> level+1?) */}
      <Button onClick={() => router.push("/game")}>Next Level</Button>
    </div>
  );
};

export default RedirectButton;
