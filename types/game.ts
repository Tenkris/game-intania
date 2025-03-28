export interface EntityState{
    name: string;
    attack: number;
    defense: number;
    currentHP: number;
    maxHP: number;
    image: string;
}


export interface PlayerState extends EntityState{
    level: number;
    speed: number;
}
export interface BossState extends EntityState{

}

export enum turnState {
    playerTurn = "playerTurn",
    bossTurn = "bossTurn",
}

export interface GameState {
    player: PlayerState;
    boss: BossState;
    turn: turnState;
    gameOver: boolean;
    
}

export type LevelData = {
    boss_name: string;
    boss_image_s3: string;
    boss_hp: number;
    boss_attack: number;
    question_id: string[];
    level: number;
}