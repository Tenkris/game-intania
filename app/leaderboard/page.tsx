import Leaderboard from "@/components/leaderboard/Leaderboard";
import { getMyUser } from "@/utils/api/user";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function LeaderboardPage() {

    // Check if user is logged in
    const userInfo = await getMyUser();

    //const headerList = await headers();
    //const pathname = headerList.get("x-current-path");

    // If there is no user info, redirect to home page
    if (!userInfo) {
        redirect('/');
    }

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-5">
            <Leaderboard myUser={userInfo} />
        </div>
    );
}