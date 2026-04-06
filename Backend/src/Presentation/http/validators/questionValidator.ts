import { z } from "zod";
import QuestionType from "../../../Domain/enums/questionType";
import QuestionDifficulty from "../../../Domain/enums/questionDifficulty";



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
    categoryId: z.string().min(1, "Category is required"),
    isPremium: z.boolean(),
    isPractice: z.boolean(),
    answer: z.string().optional(),
    options: z.array(z.string().min(1)).optional(),
    testCases: z.array(testCaseSchema).optional()
})
.superRefine((data, ctx) => {
    if (data.type === QuestionType.MCQ) {
        if (!data.options || data.options.length < 2) {
            ctx.addIssue({
                path: ["options"],
                message: "At least 2 options are required for MCQ",
                code: z.ZodIssueCode.custom
            });
        }

        if (!data.answer || data.answer.trim() === "") {
            ctx.addIssue({
                path: ["answer"],
                message: "Answer is required for MCQ",
                code: z.ZodIssueCode.custom
            });
        }
    }
    if (data.type === QuestionType.CODING ) {
        if (!data.testCases || data.testCases.length === 0) {
            ctx.addIssue({
                path: ["testCases"],
                message: "Test cases are required for coding questions",
                code: z.ZodIssueCode.custom
            });
        }
    }
});

export const getAllQuestionSchema = z.object({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(10),
    difficulty: z.nativeEnum(QuestionDifficulty).optional(),
    type: z.nativeEnum(QuestionType).optional(),
    category: z.string().optional(),
    search: z.string().optional()
})

export type getAllQuestionQuery = z.infer<typeof getAllQuestionSchema>


export const editQuestionSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    type: z.nativeEnum(QuestionType),
    difficulty: z.nativeEnum(QuestionDifficulty),
    categoryId: z.string().min(1, "Category is required"),
    isPremium: z.boolean(),
    isPractice: z.boolean(),
    answer: z.string().optional(),
    options: z.array(z.string().min(1)).optional(),
    testCases: z.array(testCaseSchema).optional()
})
.superRefine((data, ctx) => {
    if (data.type === QuestionType.MCQ) {
        if (!data.options || data.options.length < 2) {
            ctx.addIssue({
                path: ["options"],
                message: "At least 2 options are required for MCQ",
                code: z.ZodIssueCode.custom
            });
        }

        if (!data.answer || data.answer.trim() === "") {
            ctx.addIssue({
                path: ["answer"],
                message: "Answer is required for MCQ",
                code: z.ZodIssueCode.custom
            });
        }
    }
    if (data.type === QuestionType.CODING ) {
        if (!data.testCases || data.testCases.length === 0) {
            ctx.addIssue({
                path: ["testCases"],
                message: "Test cases are required for coding questions",
                code: z.ZodIssueCode.custom
            });
        }
    }
});