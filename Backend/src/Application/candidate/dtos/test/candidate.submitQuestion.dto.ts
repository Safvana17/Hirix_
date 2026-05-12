import QuestionDifficulty from "../../../../Domain/enums/questionDifficulty";
import QuestionType from "../../../../Domain/enums/questionType";
import userRole from "../../../../Domain/enums/userRole.enum";
import { TestCase } from "../../../../Domain/valueObjects/question.testCase";

export interface CandidateSubmitQuestionInputDTO {
    token: string
    title: string;
    description: string;
    difficulty: QuestionDifficulty;
    type: QuestionType;
    categoryId: string;
    isPremium: boolean;
    isPractice: boolean;
    // visibility: QuestionVisibility;
    answer?: string[];
    options?: string[];
    testCases?: TestCase[]
}

export interface CandidateSubmitQuestionOutputDTO {
    success: boolean
}