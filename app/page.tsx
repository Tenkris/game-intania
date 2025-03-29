import MusicPlayer from "@/components/sound/music-player";
import { logout } from "@/utils/api/auth";
import { getMyUser } from "@/utils/api/user";
import Image from "next/image";
import Link from "next/link";
import longButtonImg from "@/app/assets/button/long_button.png";

export default async function HomePage() {
  // Check if user is logged in
  const userInfo = await getMyUser();

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5">
      <div className="card w-96 items-center justify-center">
        {userInfo ? (
          <Link href="/game" className="button">
            Play
          </Link>
        ) : (
          <>
            <Link href="/login" className="button">
              Login
            </Link>
            <Link href="/register" className="button">
              Register
            </Link>
          </>
        )}

        <Link href="/leaderboard" className="button">
          Leaderboard
        </Link>
        {userInfo && (
          <>
            <Link href="/history" className="button">
              History
            </Link>
            <button className="button" onClick={logout}>
              Log Out
            </button>
          </>
        )}
      </div>
      <MusicPlayer src="https://s3.imjustin.dev/hackathon/2020-03-22_-_A_Bit_Of_Hope_-_David_Fesliyan.mp3" />
    </div>
  );
}
