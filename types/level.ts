import { Question } from "./question";

export interface Level {
    level: 7,
    boss_name: string,
    boss_image_s3: string,
    boss_hp: number,
    boss_attack: number,
    question_ids: string[],
    created_at: string,
    updated_at: string,
}

export interface LevelWithQuestions extends Level {
    questions: Question[],
}

