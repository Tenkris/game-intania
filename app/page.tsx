import MusicPlayer from "@/components/sound/music-player";
import { logout } from "@/utils/api/auth";
import { getMyUser } from "@/utils/api/user";
import Image from "next/image";
import Link from "next/link";
import longButtonImg from "@/app/assets/button/long_button.png";
import ButtonImage from "@/components/common/ButtonImage";

export default async function HomePage() {
  // Check if user is logged in
  const userInfo = await getMyUser();

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5">
      <div className="flex flex-col gap-3 w-96 items-center justify-center">

        {
          userInfo ? (
            <ButtonImage><Link href="/game" className="w-full text-center block">Play</Link></ButtonImage>
          ) : (
            <>
              <ButtonImage><Link href="/login" className="w-full text-center block">Login</Link></ButtonImage>
              <ButtonImage><Link href="/register" className="w-full text-center block">Register</Link></ButtonImage>
            </>
            
          )
        }
        
        
        {
          userInfo && (
            <>
              <ButtonImage><Link href="/tutorial" className="w-full text-center block">Tutorial</Link></ButtonImage>
              <ButtonImage><Link href="/profile" className="w-full text-center block">Profile</Link></ButtonImage>
              <ButtonImage><Link href="/leaderboard" className="w-full text-center block">Leaderboard</Link></ButtonImage>
              <ButtonImage ><Link href="/history" className="w-full text-center block">History</Link></ButtonImage>
              
              <ButtonImage onClick={logout} alt="Log Out" type = "button" >
                Log Out
              </ButtonImage>
              {/* <button className="button w-full text-center" onClick={logout}>Log Out</button> */}
            </>
          )
        }
        

      </div>
      <MusicPlayer src="https://s3.imjustin.dev/hackathon/2020-03-22_-_A_Bit_Of_Hope_-_David_Fesliyan.mp3" />
    </div>
  );
}
