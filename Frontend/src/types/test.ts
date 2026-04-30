import type { QuestionType, TestCase } from "./question"

export type TestStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
export type QuestionSource = 'ADMIN_LIBRARY' | 'COMPANY_LIBRARY' | 'TEST_ONLY'


export interface TestRules {
    timing: {
        durationInMinutes: number
        autoSubmissionOnTimeEnds: boolean
        warningBeforeEndInMinutes: number
    },
    navigation: {
        allowTabSwitch: boolean
        maxTabSwitchCount: number
        autoSubmissionOnTabViolation: boolean
        shuffleQuestion: boolean
        shuffleOptions: boolean
        allowBackNavigation: boolean
    },
    proctoring: {
        enableCamera: boolean
        captureSnapShots: boolean
        snapShotIntervalSeconds: number
        detectNoFace: boolean
        detectMultipleFace: boolean
        maxWarningsAllowed: number
        autoSubmissionOnMaxWarnings: boolean
    },
    behavior: {
        enforceFullScreen: boolean
        autoSubmissionFullScreenExit: boolean
        allowCopyPaste: boolean
        allowRightClick: boolean
        allowKeyboardShortcuts: boolean
    },
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