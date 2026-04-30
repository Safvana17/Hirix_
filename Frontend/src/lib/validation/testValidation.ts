import { z } from 'zod'

const QuestionSourceSchema = z.enum([
  'ADMIN_LIBRARY',
  'COMPANY_LIBRARY',
  'TEST_ONLY',
])

const QuestionTypeSchema = z.enum(['mcq', 'coding', 'descriptive'])

const TestCaseSchema = z.object({
  input: z.string().min(1, 'Test case input is required'),
  expectedOutput: z.string().min(1, 'Expected output is required'),
  explanation: z.string().optional(),
  isHidden: z.boolean().optional(),
})

const CreateTestQuestionSchema = z
  .object({
    id: z.string().min(1),
    source: QuestionSourceSchema,
    type: QuestionTypeSchema,
    title: z.string().min(1, 'Question title is required'),
    order: z.number().min(1),
    mark: z.number().min(0),
    questionId: z.string().optional(),
    description: z.string().optional(),
    options: z.array(z.string()).optional(),
    answer: z.string().optional(),
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

      if (!q.answer) {
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
  durationInMinutes: z.number().min(1, 'Duration must be greater than 0'),
  autoSubmissionOnTimeEnds: z.boolean(),
  warningBeforeEndInMinutes: z.number().min(0),
})

const NavigationRulesSchema = z.object({
  allowTabSwitch: z.boolean(),
  maxTabSwitchCount: z.number().min(0),
  autoSubmissionOnTabViolation: z.boolean(),
  shuffleQuestion: z.boolean(),
  shuffleOptions: z.boolean(),
  allowBackNavigation: z.boolean(),
})

const ProctoringRulesSchema = z.object({
  enableCamera: z.boolean(),
  captureSnapShots: z.boolean(),
  snapShotIntervalSeconds: z.number().min(0),
  detectNoFace: z.boolean(),
  detectMultipleFace: z.boolean(),
  maxWarningsAllowed: z.number().min(0),
  autoSubmissionOnMaxWarnings: z.boolean(),
})

const BehaviorRulesSchema = z.object({
  enforceFullScreen: z.boolean(),
  autoSubmissionFullScreenExit: z.boolean(),
  allowCopyPaste: z.boolean(),
  allowRightClick: z.boolean(),
  allowKeyboardShortcuts: z.boolean(),
})

const AutoSaveRulesSchema = z.object({
  enabled: z.boolean(),
  intervalInSeconds: z.number().min(0),
  saveOnEveryAnswer: z.boolean(),
})

const CreateTestRulesSchema = z.object({
  timing: TimingRulesSchema,
  navigation: NavigationRulesSchema,
  proctoring: ProctoringRulesSchema,
  behavior: BehaviorRulesSchema,
  autoSave: AutoSaveRulesSchema,
})

export const createTestValidator = z
  .object({
    jobRoleId: z.string().min(1, 'Job role is required'),
    name: z.string().min(1, 'Test name is required'),
    description: z.string().min(1, 'Description is required'),

    startTime: z.coerce.date({
      message: 'Start time is required',
    }),
    endTime: z.coerce.date({
      message: 'End time is required',
    }),

    questions: z.array(CreateTestQuestionSchema).min(1, 'Select at least one question'),
    candidates: z.array(CreateTestCandidateSchema).min(1, 'Add at least one candidate'),

    rules: CreateTestRulesSchema,
  })
  .superRefine((data, ctx) => {
    if (data.startTime >= data.endTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Start time must be before end time',
        path: ['startTime'],
      })
    }

    if (
      data.rules.timing.warningBeforeEndInMinutes >=
      data.rules.timing.durationInMinutes
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Warning time must be less than duration',
        path: ['rules', 'timing', 'warningBeforeEndInMinutes'],
      })
    }

    const emails = data.candidates.map((c) => c.email.toLowerCase())
    const uniqueEmails = new Set(emails)

    if (emails.length !== uniqueEmails.size) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Duplicate candidate emails found',
        path: ['candidates'],
      })
    }

    const orders = data.questions.map((q) => q.order)
    const uniqueOrders = new Set(orders)

    if (orders.length !== uniqueOrders.size) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Question order must be unique',
        path: ['questions'],
      })
    }
  })

export type CreateTestFormInput = z.infer<typeof createTestValidator>