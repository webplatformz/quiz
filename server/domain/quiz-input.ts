import {QuestionInput} from "./question-input";

export interface QuizInput {
    id: string;
    name: string;
    questions: QuestionInput[];
}