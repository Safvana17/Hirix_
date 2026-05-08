import type { QuestionType, TestCase } from "./question"

export type TestStatus = 'DRAFT' | 'PUBLISHED' | 'COMPLETED' | 'CANCELLED' | 'DELETED'
export type QuestionSource = 'ADMIN_LIBRARY' | 'COMPANY_LIBRARY' | 'TEST_ONLY'
export type CandidateStatus = 'DRAFT' | 'VERIFIED' | 'INVITED' | 'IN_PROGRESS'| 'SUBMITTED'| 'EXPIRED'| 'DISQUALIFIED' | 'TERMINATED'
export type CandidateSelectionStatus = 'PENDING' | 'SHORTLISTED' | 'REJECTED'
export type ModalMode = 'create' | 'edit'
export type CandidateTestGateStep = 'LOADING' | 'NOT_STARTED' | 'DETAILS' | 'INSTRUCTIONS' | 'EXPIRED' | 'READY' | 'LOGIN' | 'QUESTIONS' | 'SUBMITTED' | 'TERMINATED' | 'DISQUALIFIED' | 'EXPIRED'


export interface TestCandidate {
    id: string
    email: string
    token: string
    testId: string
    candidateTestStatus: CandidateStatus
    selectionStatus: CandidateSelectionStatus
    warningCount: number
    candidateAnswers: {
        id: string
        testQuestionId: string
        questionType: QuestionType
        timeTakenInSeconds: number
        selectedOptionIds?: string[]
        descriptiveAnswer?: string
        codingAnswer?: {
            language: string
            code: string
            output?: string
        }
        isCorrect?: boolean
        marksObtained?: number
        totalMarks: number
    }[],
    aiRank: number
    totalMarks: number
    totalQuestions: number
    correctAnswerCount: number
    marksObtained: number
    startedAt: string
    submittedAt: string
}

export interface TestRules {
  timing: {
    durationInMinutes: number
    autoSubmitOnTimeEnd: boolean
    warningBeforeEndInMinutes: number
  }

  navigation: {
    allowTabSwitch: boolean
    maxTabSwitchCount: number
    autoSubmitOnTabViolation: boolean
    shuffleQuestions: boolean
    shuffleOptions: boolean
    allowBackNavigation: boolean
  }

  proctoring: {
    enableCamera: boolean
    captureSnapshots: boolean
    snapshotIntervalSeconds: number
    detectNoFace: boolean
    detectMultipleFaces: boolean
    maxWarningsAllowed: number
    autoSubmitOnMaxWarnings: boolean
  }

  behavior: {
    enforceFullScreen: boolean
    autoSubmitOnFullScreenExit: boolean
    allowCopyPaste: boolean
    allowRightClick: boolean
    allowKeyboardShortcuts: boolean
  }

  autoSave: {
    enabled: boolean
    intervalInSeconds: number
    saveOnEveryAnswer: boolean
  }
}

export interface TestQuestions {
   id: string
   source: QuestionSource
   type: QuestionType
   title: string
   order: number
   mark: number
   questionId?: string
   description?: string
   options?: string[]
   answer?: string
   testCase: TestCase[]
}

export interface CreateTestCandidatePayload {
  email: string
}
export interface Test {
    id: string
    name: string
    companyId: string
    jobRoleId: string
    description: string
    startTime: Date
    endTime: Date
    rules: TestRules
    questions: TestQuestions[]
    testStatus: TestStatus
    isDeleted: boolean
}

export interface CreateTestPayload {
    jobRoleId: string
    name: string
    description: string
    startTime: string
    endTime: string
    questions: TestQuestions[]
    candidates: CreateTestCandidatePayload[]
    rules: TestRules
}

export interface GetAllTestParams {
    search?: string
    status?: TestStatus
    page: number
    limit: number
}

export interface CompanyTestList{
    id: string
    name: string
    jobRole: string
    startTime: Date
    endTime: Date
    durationInMinutes: number
    testStatus: TestStatus
    candidatesCount: number
    isDeleted: boolean
}

export interface GetAllTestResponse {
    tests: CompanyTestList[]
    totalPages: number
    totalCount: number
    featureLocked: boolean
}

export interface CancelTestArgs {
    id: string
    reason: string
}

export interface ResheduleTestArgs {
    startTime: string
    endTime: string
    id: string
}

export interface SelectedTest {
    id: string
    name: string
    description: string
    jobRoleId: string
    jobrole: string
    startTime: string
    endTime: string
    companyName: string
    rules: TestRules
    questions: TestQuestions[]
    testStatus: TestStatus
    candidates: TestCandidate[]
}

export interface CandidateTest {
    id: string
    name: string
    description: string
    jobrole: string
    startTime: Date
    endTime: Date
    companyName: string
    rules: TestRules
    questions: TestQuestions[]
    testStatus: TestStatus
}

export interface TestCandidateResponse {
    candidate: TestCandidate
    test: CandidateTest
}