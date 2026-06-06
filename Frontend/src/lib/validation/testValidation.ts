import { z } from 'zod'

const QuestionSourceSchema = z.enum([
  'ADMIN_LIBRARY',
  'COMPANY_LIBRARY',
  'TEST_ONLY',
])

const QuestionTypeSchema = z.enum(['mcq', 'coding', 'descriptive'])

const TestCaseSchema = z.object({
  input: z.array(z.unknown()).min(1, "Test case input is required"),
  expectedOutput: z.string().min(1, 'Expected output is required'),
})

const CreateTestQuestionSchema = z
  .object({
    source: QuestionSourceSchema,
    type: QuestionTypeSchema,
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
    if (q.type === 'mcq') {
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

    if (q.type === 'coding') {
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
  warningBeforeEndInMinutes: z.number().min(0),
})

const NavigationRulesSchema = z.object({
  allowTabSwitch: z.boolean(),
  // shuffleQuestions: z.boolean(),
  // shuffleOptions: z.boolean(),
  allowBackNavigation: z.boolean(),
})

const ProctoringRulesSchema = z.object({
  enableCamera: z.boolean(),
  movementDetection: z.boolean(),
  // captureSnapshots: z.boolean(),
  // snapshotIntervalSeconds: z.number().min(0),
  // detectNoFace: z.boolean(),
  // detectMultipleFaces: z.boolean(),
})

const BehaviorRulesSchema = z.object({
  enforceFullScreen: z.boolean(),
  allowCopyPaste: z.boolean(),
  allowRightClick: z.boolean(),
  allowKeyboardShortcuts: z.boolean(),
})

const AutoSaveRulesSchema = z.object({
  enabled: z.boolean(),
  intervalInSeconds: z.number().min(0),
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
    description: z.string().min(1, 'Description is required'),
    startTime: z.coerce.date({message: 'Start time is required'}),
    endTime: z.coerce.date({message: 'End time is required' }),
    questions: z.array(CreateTestQuestionSchema).optional(),
    candidates: z.array(CreateTestCandidateSchema).optional(),
    rules: CreateTestRulesSchema.optional(),
  })
  // .superRefine((data, ctx) => {
  //   // if (data.startTime >= data.endTime) {
  //   //   ctx.addIssue({
  //   //     code: z.ZodIssueCode.custom,
  //   //     message: 'Start time must be before end time',
  //   //     path: ['startTime'],
  //   //   })
  //   // }

  //   const emails = data.candidates.map((c) => c.email.toLowerCase())
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

export type CreateTestFormInput = z.infer<typeof createTestValidator>