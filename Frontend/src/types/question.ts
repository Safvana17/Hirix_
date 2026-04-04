import type { UserRole } from "../constants/role";

export type ModalMode = 'create' | 'edit' | 'view'


export type QuestionDifficulty = 'easy' | 'medium' | 'hard'
export type QuestionType = 'mcq' | 'descriptive' | 'coding'
export type QuestionVisibility = 'free' | 'pro'

export type TestCase = {
   input: string;
   expectedOutput: string;
   explanation?: string;
   isHidden?: boolean;
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
    createdBy: UserRole
    createdById?: string | null;
    visibility: QuestionVisibility;
    isPremium: boolean;
    isPractice: boolean;
    isDeleted: boolean;
    answer: string
}

export type QuestionFormData = {
  title: string;
  description: string;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  categoryId: string;
  options: string[];
  answer: string;
  testCases: TestCase[];
  isPremium: boolean;
  isPractice: boolean;
  createdBy: UserRole
};