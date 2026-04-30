import QuestionDifficulty from "../../../../Domain/enums/questionDifficulty";
import QuestionType from "../../../../Domain/enums/questionType";
import { TestCase } from "../../../../Domain/valueObjects/question.testCase";

export interface CompanyEditQuestionInputDTO {
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

export interface CompanyEditQuestionOutputDTO {
    id: string
}