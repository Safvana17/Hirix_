import z from "zod";
import { QuestionSource, TestStatus } from "../../../Domain/enums/Test";
import QuestionType from "../../../Domain/enums/questionType";
import QuestionDifficulty from "../../../Domain/enums/questionDifficulty";


const TestCaseSchema = z.object({
  input: z.array(z.unknown()).min(1, "Test case input is required"),
  expectedOutput: z.string().min(1, "Expected output is required"),
})

const CreateTestQuestionSchema = z.object({
    source: z.nativeEnum(QuestionSource),
    type: z.nativeEnum(QuestionType),
    title: z.string().min(1, 'Question title is required'),
    order: z.number().min(1),
    questionId: z.string().optional(),
    description: z.string().optional(),
    functionName: z.string().optional(),
    starterCode: z.string().optional(),
    options: z.array(z.string()).optional(),
    answer: z.array(z.string()).optional(),
    testCase: z.array(TestCaseSchema).optional(),
  })
  .superRefine((q, ctx) => {
    if (q.type === QuestionType.MCQ) {
      if (!q.options || q.options.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'MCQ must have at least 2 options',
          path: ['options'],
        })
      }
      if (!q.answer || q.answer.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'MCQ must have an answer',
          path: ['answer'],
        })
      }
    }
    if (q.type === QuestionType.CODING) {
      if (!q.testCase || q.testCase.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Coding question must have test cases',
          path: ['testCase'],
        })
      }
    }
  })

const CreateTestCandidateSchema = z.object({
  email: z.string().email('Invalid email format'),
})

const TimingRulesSchema = z.object({
  autoSubmitOnTimeEnd: z.boolean(),
  warningBeforeEndInMinutes: z.number().min(1),
})

const NavigationRulesSchema = z.object({
  allowTabSwitch: z.boolean(),
  shuffleQuestions: z.boolean(),
  shuffleOptions: z.boolean(),
  allowBackNavigation: z.boolean(),
})

const ProctoringRulesSchema = z.object({
  enableCamera: z.boolean(),
  captureSnapshots: z.boolean(),
  snapshotIntervalSeconds: z.number().min(1),
  detectNoFace: z.boolean(),
  detectMultipleFaces: z.boolean(),
})

const BehaviorRulesSchema = z.object({
  enforceFullScreen: z.boolean(),
  allowCopyPaste: z.boolean(),
  allowRightClick: z.boolean(),
  allowKeyboardShortcuts: z.boolean(),
})

const AutoSaveRulesSchema = z.object({
  enabled: z.boolean(),
  intervalInSeconds: z.number().min(1),
  saveOnEveryAnswer: z.boolean(),
})
const WarningRuleSchema = z.object({
    maxWarningCount: z.number().min(0),
    autoSubmitOnMaxWarnings: z.boolean(),
})

const CreateTestRulesSchema = z.object({
  timing: TimingRulesSchema,
  navigation: NavigationRulesSchema,
  proctoring: ProctoringRulesSchema,
  behavior: BehaviorRulesSchema,
  autoSave: AutoSaveRulesSchema,
  warning: WarningRuleSchema
})

export const createTestValidator = z.object({
  jobRoleId: z.string().min(1, 'Job role is required'),
  name: z.string().min(1, 'Test name is required'),
  description: z.string().min(1, 'Test description is required'),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  questions: z.array(CreateTestQuestionSchema).optional(),
  candidates: z.array(CreateTestCandidateSchema).optional(),
  rules: CreateTestRulesSchema.optional(),
})

export const editTestValidator = z.object({
  jobRoleId: z.string().min(1, 'Job role is required'),
  name: z.string().min(1, 'Test name is required'),
  description: z.string().min(1, 'Description is required'),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  questions: z.array(CreateTestQuestionSchema).min(1, 'Minimum one question is required'),
  candidates: z.array(CreateTestCandidateSchema).min(1, 'Minimum one candidate is required'),
  rules: CreateTestRulesSchema,
})
  // .superRefine((data, ctx) => {
  //   if (data.startTime >= data.endTime) {
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.custom,
  //       message: 'Start time must be before end time',
  //       path: ['startTime'],
  //     })
  //   }
  //   const emails = data.candidates.map((c) => c.email)
  //   const uniqueEmails = new Set(emails)

  //   if (emails.length !== uniqueEmails.size) {
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.custom,
  //       message: 'Duplicate candidate emails found',
  //       path: ['candidates'],
  //     })
  //   }
  //   const orders = data.questions.map((q) => q.order)
  //   const uniqueOrders = new Set(orders)

  //   if (orders.length !== uniqueOrders.size) {
  //     ctx.addIssue({
  //       code: z.ZodIssueCode.custom,
  //       message: 'Question order must be unique',
  //       path: ['questions'],
  //     })
  //   }
  // })
// export type CreateTestInput = z.infer<typeof createTestValidator>

export const CompanyGetQuestionsForTestSchema = z.object({
  difficulty: z.nativeEnum(QuestionDifficulty).optional(),
  type: z.nativeEnum(QuestionType).optional(),
  category: z.string().optional(),
})
export type GetQuestionsForTestQuery = z.infer<typeof CompanyGetQuestionsForTestSchema>

export const CompanyGetAllTestSchema = z.object({
  search: z.string().optional(),
  status: z.enum(TestStatus).optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10)
})
export type GetAllTestQuery = z.infer<typeof CompanyGetAllTestSchema>

export const TestParamsSchema = z.object({
  testId: z.string().regex(/^[0-9a-fA-F]{24}$/)
})
export type testParams = z.infer<typeof TestParamsSchema>

export const CancelTestSchema = z.object({
  reason: z.string().min(15, 'Reason is required')
})

export const ResheduleTestSchema = z.object({
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
})

export const TestTokenSchema = z.object({
  token: z.string()
})
export type TestTokenParams = z.infer<typeof TestTokenSchema>

export const TestCandidateLoginSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email().min(1, 'email is required')
})

export const CandidateRunCodeSchema = z.object({
    language: z.enum(['javascript', 'python']),
    sourceCode: z.string().min(1, 'Source code is required'),
    questionId: z.string().regex(/^[0-9a-fA-F]{24}$/)
})

export const codingAnswerSchema = z.object({
    language: z.string().min(1, "Language is required"),
    code: z.string().min(1, "Code is required"),
    output: z.string().optional()
})

export const candidateAnswerSchema = z.object({
    testQuestionId: z.string({message: "Question id is required"}),
    questionType: z.nativeEnum(QuestionType),
    timeTakenInSeconds: z.number().min(0, "Time taken cannot be negative"),
    selectedOptionIds: z.array(z.string()).optional(),
    descriptiveAnswer: z.string().optional(),
    codingAnswer: codingAnswerSchema.optional(),
})

export const saveAnswerSchema = z.object({
  answer: z.array(candidateAnswerSchema)
})
export const submitTestSchema = z.object({
    answer: z.array(candidateAnswerSchema),
    warningCount: z.number().min(0)
})

export const ShortlistCandidateSchema = z.object({
     candidateId: z.string().regex(/^[0-9a-fA-F]{24}$/)
})