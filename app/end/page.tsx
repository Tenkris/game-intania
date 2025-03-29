"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const End = () => {
  const router = useRouter();
  return (
    <div className="w-full h-full flex justify-center items-center ">
      <div className="card gap-4 w-80 items-center justify-center">
        <h1 className="text-center  text-xl">Play again?</h1>
        <div className="flex flex-row w-full items-center justify-center gap-4">
          <Button onClick={() => router.push("/")}>Home</Button>
          {/* might need to fix the game path later (get user level -> level+1?) */}
          <Button onClick={() => router.push("/game")}>Next Level</Button> 
        </div>
      </div>
    </div>
  );
};

export default End;
