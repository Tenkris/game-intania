"use client";

import { getAllUsers } from "@/utils/api/user";
import BackButton from "../common/BackButton";
import { useEffect, useState } from "react";
import ReloadButton from "../common/ReloadButton";
import { User } from "@/types/user";
import { LevelWithQuestions } from "@/types/level";
import { getHistory } from "@/utils/api/level";
import HistoryAccordian from "./HistoryAccordian";

export default function HistoryBoard() {

    const [history, setHistory] = useState<LevelWithQuestions[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [activeAccordion, setActiveAccordion] = useState<number>(-1);

    function toggleAccordion(index: number) {
        if (activeAccordion === index) {
            setActiveAccordion(-1);
        } else {
            setActiveAccordion(index);
        }
    }

    useEffect(() => {
        console.log(activeAccordion)
    }, [activeAccordion])

    async function fetchHistory() {
        setIsLoading(true);

        const data: LevelWithQuestions[] | null = await getHistory();
        if (!data) {
            setIsLoading(false);
            alert("Failed to fetch history. Please try again later.");
            return;
        }

        // Sort the history by level_id in descending order
        data.sort((a, b) => b.level - a.level);

        setHistory(data);
        setIsLoading(false);
    }

    useEffect(() => {
        fetchHistory();
    }, [])

    return (
        <div className="card w-11/12 lg:w-2/5 items-center justify-center text-xs">
            <div className="flex justify-between items-center w-full p-2 lg:p-4">
                <BackButton href="/" />
                <h1 className="text-lg font-bold">History</h1>
                <div className="w-6 h-6"></div>
            </div>
            {
                isLoading && (
                    <div className="flex flex-col items-center justify-center w-full h-full p-4">
                        <p className="text-xs font-semibold">Loading...</p>
                        <div className="loader"></div>
                    </div>
                )
            }
            {
                (!isLoading && history.length === 0) && (
                    <div className="flex flex-col items-center justify-center w-full h-full p-4">
                        <p className="text-xs font-semibold">You haven't finished any levels!</p>
                    </div>
                )
            }
            {
                !isLoading && history.length > 0 && (
                    <div className="flex flex-col w-full max-h-[60vh] p-2 overflow-y-auto">
                        <div className="w-full flex flex-col">
                            {
                                history.map((level) => (
                                    <HistoryAccordian key={level.level} data={level} isActive={activeAccordion === level.level} onClick={() => toggleAccordion(level.level)} />
                                ))
                            }
                            
                        </div>
                        
                    </div>
                )
            }
            
        </div>
    );
}