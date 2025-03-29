import BackButton from "@/components/common/BackButton";
import HistoryBoard from "@/components/history/HistoryBoard";
import { getMyUser } from "@/utils/api/user";
import { Mail, UserRound } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import userImage from "@/app/assets/icons/user.png";
import mailImage from "@/app/assets/icons/mail.png";
import attackImage from "@/app/assets/icons/attack.png";
import defenseImage from "@/app/assets/icons/defense.png";
import hpImage from "@/app/assets/icons/hp.png";

export default async function ProfilePage() {

    // Check if user is logged in
    const userInfo = await getMyUser();

    const headerList = await headers();
    const pathname = headerList.get("x-current-path");

    // If there is no user info, redirect to home page
    if (!userInfo) {
        redirect('/');
    }

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-5">
            <div className="card w-11/12 lg:w-1/2 items-center justify-center text-xs">
                <div className="flex justify-between items-center w-full p-2 lg:p-4">
                    <BackButton href="/" />
                    <h1 className="text-lg font-bold">My Profile</h1>
                    <div className="w-6 h-6"></div>
                </div>
                <div className="w-full space-y-4 px-3 py-3 text-xs">
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <div className="flex items-center gap-3">
                            <Image src={userImage} alt="Name" className="w-8 h-8" />
                            <p><span className="font-semibold">Name:</span> {userInfo.name}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Image src={mailImage} alt="Mail" className="w-8 h-8" />
                            <p><span className="font-semibold">Email:</span> {userInfo.email}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <p>You currently are in level {userInfo.level_id}</p>
                    </div>
                    <div className="w-full rounded-xl border border-gray-400 flex flex-col p-3 gap-4">
                        <p className="font-bold">Character Status</p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                            <div className="flex items-center gap-3">
                                <Image src={attackImage} alt="Attack" className="w-8 h-8" />
                                <p><span className="font-semibold">Attack:</span> {userInfo.attack}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Image src={defenseImage} alt="Defense" className="w-8 h-8" />
                                <p><span className="font-semibold">Defense:</span> {userInfo.defense}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Image src={hpImage} alt="HP" className="w-8 h-8" />
                                <p><span className="font-semibold">HP:</span> {userInfo.hp}</p>
                            </div>
                        </div>
                    </div>
                    
                        
                    
                </div>
            </div>
        </div>
    );
}