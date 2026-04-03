import { z } from "zod";
import QuestionType from "../../../Domain/enums/questionType";
import QuestionDifficulty from "../../../Domain/enums/questionDifficulty";
import QuestionVisibility from "../../../Domain/enums/questionVisibility";


const testCaseSchema = z.object({
    input: z.string().min(1, "Test case input is required"),
    expectedOutput: z.string().min(1, "Expected output is required"),
    explanation: z.string().optional(),
    isHidden: z.boolean().optional()
});


export const createQuestionSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    type: z.nativeEnum(QuestionType),
    difficulty: z.nativeEnum(QuestionDifficulty),
    visibility: z.nativeEnum(QuestionVisibility),
    categoryId: z.string().min(1, "Category is required"),
    isPremium: z.boolean(),
    isPractice: z.boolean(),
    answer: z.string().min(1, "Answer is required"),
    options: z.array(z.string().min(1)).optional(),
    testCases: z.array(testCaseSchema).optional()
})
