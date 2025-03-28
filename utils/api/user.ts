"use server";

import { User } from "@/types/user";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000/api/v1";


export async function getMyUser(): Promise<User | null> {
    try {
        // Get cookie
        const cookieStore = await cookies()
        const token = cookieStore.get('token')

        if (!token) {
            return null
        }
    
        const response = await fetch(`${API_URL}/users/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token.value}`
            },
        });
    
        if (!response.ok) {
            return null
        }
    
        const data: User = (await response.json()).data;
        return data;
    } catch (_) {
        return null
    }
    
}


export async function getAllUsers() {
    try {
        // Get cookie
        const cookieStore = await cookies()
        const token = cookieStore.get('token')

        if (!token) {
            return null
        }
    
        const response = await fetch(`${API_URL}/users`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token.value}`
            },
        });
    
        if (!response.ok) {
            return null
        }
    
        const data: User[] = (await response.json()).data;
        return data;
    } catch (_) {
        return null
    }
}