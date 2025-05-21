"use server";

import { LevelData } from "@/types/level";

import { UpdateUserBody, User } from "@/types/user";

import { cookies } from "next/headers";

const API_URL =
  process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000/api/v1";

const RESOURCE_URL = process.env.NEXT_PUBLIC_RESOURCE_URL || "https://d24bh8xfes1923.cloudfront.net";

export async function getMyUser(): Promise<User | null> {
  try {
    // Get cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return null;
    }

    const response = await fetch(`${API_URL}/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data: User = (await response.json()).data;
    return data;
  } catch (_) {
    return null;
  }
}

export async function getLevelData({
  level,
}: {
  level: string;
}): Promise<LevelData | null> {
  try {
    // Get cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return null;
    }

    const response = await fetch(`${API_URL}/levels/levels/${level}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data: LevelData = await response.json();
    return data;
  } catch (_) {
    return null;
  }
}

export async function getAllUsers() {
  try {
    // Get cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return null;
    }

    const response = await fetch(`${API_URL}/users/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data: User[] = (await response.json()).data;
    return data;
  } catch (_) {
    return null;
  }
}

export function getImageURL(level : number) {
  let levelString = "0";
  if (level >= 10){
    levelString = "9";
  } else{
    levelString = (level - 1).toString();
  }
  return `${RESOURCE_URL}/character/character_${levelString}.png`;
}

export async function updateUser(updateUserData: UpdateUserBody) {
  try {
    // Get cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    const currentLevel = updateUserData.level_id || 1;
    updateUserData.user_image = getImageURL(currentLevel);

    if (!token) {
      return null;
    }

    const response = await fetch(`${API_URL}/users/update`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token.value}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateUserData),
    });

    if (!response.ok) {
      return null;
    }
    const data = (await response.json()).data;
    return data;
  } catch (_) {
    return null;
  }
}
