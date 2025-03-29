"use server";

import { HTTPInvalidResponse } from "@/types/common";
import { LevelWithQuestions } from "@/types/level";
import { cookies } from "next/headers";


const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000/api/v1";


export async function getHistory(): Promise<LevelWithQuestions[] | null> {
    try {
        // Get cookie
        const cookieStore = await cookies()
        const token = cookieStore.get('token')

        if (!token) {
            return null
        }
    
        const response = await fetch(`${API_URL}/levels/levels/history`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token.value}`
            },
        });
    
        if (!response.ok) {
            return null
        }
    
        const data: LevelWithQuestions[] = await response.json();
        return data;
    } catch (_) {
        return null
    }
}