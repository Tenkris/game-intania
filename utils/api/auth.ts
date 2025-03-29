"use server";

import { HTTPInvalidResponse } from "@/types/common";
import { UserWithToken } from "@/types/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000/api/v1";


export async function login(email: string, password: string): Promise<void | HTTPInvalidResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
        return (await response.json())
    }

    const data: UserWithToken = (await response.json()).data;

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: 'strict',
    })

    return redirect('/')
}


export async function logout(): Promise<undefined> {
    const cookieStore = await cookies()
    cookieStore.delete('token')

    // Redirect to login page
    redirect('/login')
}


export async function register(email: string, password: string, name: string): Promise<void | HTTPInvalidResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
        return (await response.json())
    }

    const data: UserWithToken = (await response.json()).data;

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: 'strict',
    })

    return redirect('/')
}