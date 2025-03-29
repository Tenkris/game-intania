export interface Question {
    question_id: string,
    question: string,
    type: QuestionType,
    time_countdown: number,
    answer: string,
    created_at: string,
    updated_at: string,
}

export enum QuestionType {
    MULTIPLE_CHOICE = "multiple_choice",
    SHORT_ANSWER = "short_answer",
}