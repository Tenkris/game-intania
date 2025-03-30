import { Question } from "./question";

export interface Level {
  level: number;
  boss_name: string;
  boss_image_s3: string;
  boss_hp: number;
  boss_attack: number;
  question_ids: string[];
  created_at: string;
  updated_at: string;
}

export interface LevelWithQuestions extends Level {
  questions: Question[];
}

export interface QuestionData {
  question: string;
  type: string;
  time_countdown: number;
  answer: string;
  question_id: string;
  created_at: string;
  updated_at: string;
}

export interface LevelData {
  boss_name: string;
  boss_image_s3: string;
  boss_hp: number;
  boss_attack: number;
  question_ids: any[];
  level: number;
  created_at: string;
  updated_at: string;
}
