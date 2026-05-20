import type { UserRole } from "../constants/role";
import type { CodingLanguage } from "./test";

export type ModalMode = 'create' | 'edit' | 'view'


export type QuestionDifficulty = 'easy' | 'medium' | 'hard'
export type QuestionType = 'mcq' | 'descriptive' | 'coding'
export type QuestionVisibility = 'free' | 'pro'

export type TestCase = {
   input: string[];
   expectedOutput: string;
}

export interface Question {
    id: string;
    title: string;
    description: string;
    type: QuestionType;
    options?: string[];
    testCases?: TestCase[];
    difficulty: QuestionDifficulty;
    categoryId: string;
    categoryName: string;
    createdBy: UserRole
    createdById?: string | null;
    visibility: QuestionVisibility;
    functionName?: string
    starterCode?: string
    isPremium: boolean;
    isPractice: boolean;
    isDeleted: boolean;
    answer: string[]
}

export interface PracticeQuestion {
  id: string
  title: string
  description: string
  type: QuestionType
  options?: string[]
  testCase?: TestCase[]
  starterCode?: string
  functionName?: string
  difficulty: QuestionDifficulty
  categoryId: string
  categoryName: string
  isPremium: boolean
}

export interface PracticeResultResponse {
  isCorrect: boolean
  feedBack?: string
}

export interface PracticeSubmitAnswerData {
  questionType: QuestionType
  selectedOption?: string[]
  descriptiveAnswer?: string
  codingAnswer?: {
    language?: CodingLanguage
    sourceCode?: string
    input?: string[]
  }
}
export type QuestionFormData = {
  id: string;
  title: string;
  description: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  categoryId: string;
  categoryName: string;
  options: string[];
  answer: string[];
  testCases: TestCase[];
  starterCode: string
  functionName: string
  isPremium: boolean;
  isPractice: boolean;
};

export interface getAllQuestionsResponse {
  questions: Question[],
  totalCount: number;
  totalPages: number
}

export interface getAllQuestionsParams {
  search?: string;
  category?: string;
  type?: QuestionType;
  difficulty?: QuestionDifficulty;
  page?: number;
  limit?: number;
}

export interface getQuestionsForTestParams {
  category?: string;
  type?: QuestionType;
  difficulty?: QuestionDifficulty;
}

export interface editQuestionPaylod {
  id: string

}