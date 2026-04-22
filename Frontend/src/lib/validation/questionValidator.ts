import { z } from "zod";

const QuestionTypeEnum = z.enum(['mcq', 'descriptive', 'coding']);
const QuestionDifficultyEnum = z.enum(['easy', 'medium', 'hard']);

export const testCaseSchema = z.object({
  input: z.string().min(1, "Test case input is required"),
  expectedOutput: z.string().min(1, "Expected output is required"),
  explanation: z.string().optional(),
  isHidden: z.boolean().optional()
});

export const questionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  type: QuestionTypeEnum,
  difficulty: QuestionDifficultyEnum,
  categoryId: z.string().min(1, "Category is required"),
  isPremium: z.boolean(),
  isPractice: z.boolean(),
  answer: z.string().optional(),
  options: z.array(z.string().min(1)).optional(),
  testCases: z.array(testCaseSchema).optional()
})
.superRefine((data, ctx) => {
  if (data.type === 'mcq') {
    if (!data.options || data.options.length < 2) {
      ctx.addIssue({
        path: ['options'],
        message: "At least 2 options are required for MCQ",
        code: z.ZodIssueCode.custom
      });
    }

    if (!data.answer || data.answer.trim() === "") {
      ctx.addIssue({
        path: ['answer'],
        message: "Answer is required for MCQ",
        code: z.ZodIssueCode.custom
      });
    }

    if (data.options && !data.options.includes(data.answer!)) {
      ctx.addIssue({
        path: ['answer'],
        message: "Answer must be one of the options",
        code: z.ZodIssueCode.custom
      });
    }
  }

  if (data.type === 'coding') {
    if (!data.testCases || data.testCases.length === 0) {
      ctx.addIssue({
        path: ['testCases'],
        message: "At least one test case is required for coding questions",
        code: z.ZodIssueCode.custom
      });
    }
  }
});