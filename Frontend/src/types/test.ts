import type { QuestionType, TestCase } from "./question"

export type TestStatus = 'DRAFT' | 'PUBLISHED' | 'COMPLETED' | 'CANCELLED' | 'DELETED'
export type QuestionSource = 'ADMIN_LIBRARY' | 'COMPANY_LIBRARY' | 'TEST_ONLY'
export type CandidateStatus = 'DRAFT' | 'VERIFIED' | 'INVITED' | 'IN_PROGRESS'| 'SUBMITTED'| 'EXPIRED'| 'DISQUALIFIED' | 'TERMINATED'
export type CandidateSelectionStatus = 'PENDING' | 'SHORTLISTED' | 'TEST_REJECTED' | 'INTERVIEW_SELECTED' | 'INTERVIEW_REJECTED' | 'INTERVIEW_SCHEDULED' | 'OFFER_SENT'
export type ModalMode = 'create' | 'edit' | 'reschedule'
export type CandidateTestGateStep = 'LOADING' | 'NOT_STARTED' | 'DETAILS' | 'INSTRUCTIONS' | 'EXPIRED' | 'READY' | 'LOGIN' | 'QUESTIONS' | 'SUBMITTED' | 'TERMINATED' | 'DISQUALIFIED' | 'EXPIRED'
export type CodingLanguage = 'javascript' | 'python'
export type ViolationType = 'TAB_SWITCH' | 'FULLSCREEN_EXIT' 
export type EvaluationStatus = "NOT_EVALUATED" | "EVALUATING" | "EVALUATED" | "FAILED"

export const QuestionMark = {
    mcq: 2,
    coding: 5,
    descriptive: 5
}

export interface TestCandidateAnswer {
    testQuestionId: string
    questionType: QuestionType
    selectedOptionIds?: string[]
    descriptiveAnswer?: string
    codingAnswer?: {
        language: CodingLanguage
        code: string
        output?: string
    }
    isMarkedForReview?: boolean
    timeTakenInSeconds: number
    totalMarks?: number
    visited?: boolean
    answeredAt?: string
    aiFeedback?: string
    evaluationStatus?: EvaluationStatus
}

export interface TestCandidate {
    id: string
    email: string
    token: string
    name: string
    testId: string
    candidateTestStatus: CandidateStatus
    selectionStatus: CandidateSelectionStatus
    evaluationStatus: EvaluationStatus
    warningCount: number
    candidateAnswers: {
        id: string
        testQuestionId: string
        questionType: QuestionType
        timeTakenInSeconds: number
        selectedOptionIds?: string[]
        descriptiveAnswer?: string
        codingAnswer?: {
            language: CodingLanguage
            code: string
            output?: string
        }
        isCorrect?: boolean
        marksObtained?: number
        totalMarks: number
        aiFeedback?: string
        evaluationStatus?: EvaluationStatus
    }[],
    aiRank: number
    totalMarks: number
    totalQuestions: number
    correctAnswerCount: number
    marksObtained: number
    startedAt: string
    submittedAt: string
    evaluatedAt?: string | Date
    currentInterviewRound?: number
    lastInterviewId?: string
}

export interface TestRules {
  timing: {
    autoSubmitOnTimeEnd: boolean
    warningBeforeEndInMinutes: number
  }

  navigation: {
    allowTabSwitch: boolean
    // maxTabSwitchCount: number
    // autoSubmitOnTabViolation: boolean
    shuffleQuestions: boolean
    shuffleOptions: boolean
    allowBackNavigation: boolean
  }

  proctoring: {
    enableCamera: boolean
    // movementDetection: boolean
    captureSnapshots: boolean
    targetSnapshotCount: number
    // detectNoFace: boolean
    // detectMultipleFaces: boolean
    // maxWarningsAllowed: number
    // autoSubmitOnMaxWarnings: boolean
  }

  behavior: {
    enforceFullScreen: boolean
    // autoSubmitOnFullScreenExit: boolean
    allowCopyPaste: boolean
    allowRightClick: boolean
    allowKeyboardShortcuts: boolean
  }

  autoSave: {
    enabled: boolean
    intervalInSeconds: number
    saveOnEveryAnswer: boolean
  }
  warning: {
    maxWarningCount: number
    autoSubmitOnMaxWarnings: boolean
  }
}

export interface TestQuestions {
   id: string
   source: QuestionSource
   type: QuestionType
   title: string
   order: number
   mark?: number
   questionId?: string
   description?: string
  starterCode?: string
  functionName?: string
   options?: string[]
   answer?: string[]
   testCase?: TestCase[]
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

// export interface editTestPayload {
//     jobRoleId: string
//     name: string
//     description: string
//     startTime: string
//     endTime: string
//     questions: TestQuestions[]
//     candidates: CreateTestCandidatePayload[]
//     rules: TestRules
//     status: TestStatus
// }
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

export interface CodeRunnerArgs {
    questionId: string
    language: CodingLanguage
    sourceCode: string
    input?: string
}

export interface CodeRunnerResponse {
    // stdout: string
    // stderr: string
    // error: string | null
    // exitCode: number | null
    feedback: string
}

export interface SubmitTestPayload {
  answers: TestCandidateAnswer[]
}

export interface UploadSnpshotResponse {
    uploadUrl: string
    key: string
}

export interface Snapshots {
    url: string
    capturedAt: Date
}