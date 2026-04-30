import QuestionDifficulty from "../../../../Domain/enums/questionDifficulty";
import QuestionType from "../../../../Domain/enums/questionType";
import { TestCase } from "../../../../Domain/valueObjects/question.testCase";

export interface AdminEditQuestionInputDTO {
    id: string
    title: string;
    description: string;
    difficulty: QuestionDifficulty;
    type: QuestionType;
    categoryId: string;
    isPremium: boolean;
    isPractice: boolean;
    answer?: string;
    options?: string[];
    testCases?: TestCase[]
}

export interface AdminEditQuestionOutputDTO {
    id: string
}