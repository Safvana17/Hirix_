import QuestionDifficulty from "../../../../Domain/enums/questionDifficulty";
import QuestionType from "../../../../Domain/enums/questionType";
import QuestionVisibility from "../../../../Domain/enums/questionVisibility";
import userRole from "../../../../Domain/enums/userRole.enum";
import { TestCase } from "../../../../Domain/valueObjects/question.testCase";

export interface AdminCreateQuestionInputDTO {
    title: string;
    description: string;
    difficulty: QuestionDifficulty;
    type: QuestionType;
    categoryId: string;
    isPremium: boolean;
    isPractice: boolean;
    // visibility: QuestionVisibility;
    answer?: string;
    options?: string[];
    testCases?: TestCase[]
    user: {
        id: string;
        role: userRole;
    }
}

export interface AdminCreateQuestionOutputDTO {
    id: string
    isPremium: boolean
    isPractice: boolean
    visibility: QuestionVisibility
}