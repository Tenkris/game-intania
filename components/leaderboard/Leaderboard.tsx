"use client";

import { getAllUsers } from "@/utils/api/user";
import BackButton from "../common/BackButton";
import { useEffect, useState } from "react";
import ReloadButton from "../common/ReloadButton";
import { User } from "@/types/user";

export default function Leaderboard({ myUser }: { myUser: User }) {

    const [users, setUsers] = useState<{ rank: number, user: User}[]>([]);
    const [myUserIndex, setMyUserIndex] = useState<number>(-1);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    async function fetchLeaderboard() {
        setIsLoading(true);

        const data: User[] | null = await getAllUsers();
        if (!data) {
            setIsLoading(false);
            alert("Failed to fetch leaderboard data. Please try again later.");
            return;
        }

        // Sort users by level in descending order
        data.sort((a, b) => {
            if (a.level_id > b.level_id) return -1;
            if (a.level_id < b.level_id) return 1;
            return 0;
        });

        // Add rank to each user, if there are multiple users with the same level, they will have the same rank
        let rank = 1;
        let prevLevel = data[0].level_id;
        const rankedUsers = data.map((user, index) => {
            if (user.level_id !== prevLevel) {
                rank = index + 1;
                prevLevel = user.level_id;
            }
            if (user.email === myUser.email) {
                setMyUserIndex(index);
            }
            return { rank: rank, user };
        });
        


        
        setUsers(rankedUsers);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchLeaderboard();
    }, [])

    return (
        <div className="card w-11/12 lg:w-2/5 items-center justify-center">
            <div className="flex justify-between items-center w-full p-2 lg:p-4">
                <BackButton href="/" />
                <h1 className="text-2xl font-bold">Leaderboard</h1>
                <ReloadButton onClick={fetchLeaderboard} />
            </div>
            {
                (!isLoading && myUserIndex !== -1) && (
                    <div className="flex flex-col justify-center w-full px-4 py-2 gap-2">
                        <span className="font-bold">My Ranking</span>
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th className="px-2 py-2 w-[15%]">Rank</th>
                                    <th className="px-2 py-2 w-[65%]">Email</th>
                                    <th className="px-2 py-2 w-[20%]">Level</th>
                                </tr>
                            </thead>
                            <tbody>
                                
                                <tr className="bg-blue-100">
                                    <td className="px-2 py-2 text-center">{users[myUserIndex].rank}</td>
                                    <td className="px-2 py-2">{( users[myUserIndex].user.name ? users[myUserIndex].user.name : "Anonymous")}</td>
                                    <td className="px-2 py-2 text-center">{users[myUserIndex].user.level_id}</td>
                                </tr>
                                    
                            </tbody>
                        </table>
                    </div>
                )
            }
            {
                (!isLoading) && (
                    <div className="w-full border-b border-gray-300"></div>
                )
            }
            {
                isLoading ? (
                    <div className="flex flex-col items-center justify-center w-full h-full p-4">
                        <p className="text-lg font-semibold">Loading...</p>
                        <div className="loader"></div>
                    </div>
                ) : (
                    <div className="w-full flex flex-col px-4 gap-2">
                        <span className="font-bold">Global Rankings</span>
                        <div className="flex flex-col w-full max-h-[48vh] p-2 overflow-y-auto">
                            <table className="table w-full">
                                <thead>
                                    <tr>
                                        <th className="px-2 py-2 w-[15%]">Rank</th>
                                        <th className="px-2 py-2 w-[65%]">Name</th>
                                        <th className="px-2 py-2 w-[20%]">Level</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        users.map((user, index) => (
                                            <tr key={user.user.email} className={`${user.user.email === myUser.email ? "bg-blue-100" : ""}`}>
                                                <td className="px-2 py-2 text-center">{user.rank}</td>
                                                <td className="px-2 py-2">{(user.user.name? user.user.name : "Anonymous")}</td>
                                                <td className="px-2 py-2 text-center">{user.user.level_id}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                )
            }
            
        </div>
    );
}