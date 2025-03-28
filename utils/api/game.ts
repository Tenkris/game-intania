"use server";
import { BossState, GameState, PlayerState, turnState } from "@/types/game";
import { LevelData } from "@/types/game";
import { User } from "@/types/user";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000/api/v1";

export async function getLevelData(level: number) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')
    
    if (!token) {
        return null
    }
    const res = await fetch(`${API_URL}/levels/levels/${level}`, {
        method: "GET",
        
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token.value}`,
        },
    });
    if (!res.ok) {
        throw new Error("Failed to fetch level data");
    }
    //console.log(await res.json());
    return res.json();
}



export async function initGame(level: number,userData : User) : Promise<GameState | null> {
    const levelData: LevelData = await getLevelData(level);
    console.log(levelData);
    const playerData: PlayerState = {
        level: userData.level_id,
        name: userData.email,
        attack: userData.attack,
        defense: userData.defense,
        currentHP: userData.hp,
        maxHP: userData.hp,
        speed: userData.speed,
        image: userData.user_image,
    };
    const bossData: BossState = {
        name: levelData.boss_name,
        attack: levelData.boss_attack,
        defense: 0,
        currentHP: levelData.boss_hp,
        maxHP: levelData.boss_hp,
        image: levelData.boss_image_s3,
    }

    const gameState: GameState = {
        player: playerData,
        boss: bossData,
        turn: turnState.playerTurn,
        gameOver: false,
    };

    return gameState;
    
}