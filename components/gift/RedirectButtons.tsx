'use client'
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ButtonImage from "@/components/common/ButtonImage";

const RedirectButton = () => {
  const router = useRouter();
  return (
    <div className="flex flex-row w-full items-center justify-center gap-4">
      {/* might need to fix the game path later (get user level -> level+1?) */}
      {/* <Button onClick={() => router.push("/")}>Home</Button>
      <Button onClick={() => router.push("/game")}>Next Level</Button> */}
      <ButtonImage onClick={() => router.push("/")}>Home</ButtonImage>
      <ButtonImage>
        <Link href="/game">Continue</Link>
      </ButtonImage>
    </div>
  );
};

export default RedirectButton;
