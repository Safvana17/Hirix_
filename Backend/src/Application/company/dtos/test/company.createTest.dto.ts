import { TestEntity } from "../../../../Domain/entities/Test.entity"
import QuestionType from "../../../../Domain/enums/questionType"
import { CandidateTestStatus, QuestionSource, TestStatus } from "../../../../Domain/enums/Test"
import { TestCase } from "../../../../Domain/valueObjects/question.testCase"

export interface CreateTestQuestionInputDTO {
    source: QuestionSource
    type: QuestionType
    title: string
    order: number
    mark: number
    questionId?: string
    description?: string
    options?: string[]
    answer?: string
    testCase?: TestCase[]
}

export interface CreateTestCandiateInputDTO {
    email: string
    candidateTestStatus?: CandidateTestStatus
}

export interface TimingRulesDTO {
    durationInMinutes: number
    autoSubmitOnTimeEnd?: boolean
    warningBeforeEndInMinutes?: number
}

export interface NavigationRulesDTO {
    allowTabSwitch?: boolean
    maxTabSwitchCount?: number
    autoSubmitOnTabViolation?: boolean
    shuffleQuestions?: boolean
    shuffleOptions?: boolean
    allowBackNavigation?: boolean
}

export interface ProctoringRulesDTO {
    enableCamera?: boolean
    captureSnapshots?: boolean
    snapshotIntervalSeconds?: number
    detectNoFace?: boolean
    detectMultipleFaces?: boolean
    maxWarningsAllowed?: number
    autoSubmitOnMaxWarnings?: boolean
}

export interface BehaviorRulesDTO {
    enforceFullScreen?: boolean
    autoSubmitOnFullScreenExit?: boolean
    allowCopyPaste?: boolean
    allowRightClick?: boolean
    allowKeyboardShortcuts?: boolean
}

export interface AutoSaveRulesDTO {
    enabled?: boolean
    intervalInSeconds?: number
    saveOnEveryAnswer?: boolean
}

export interface CreateTestRulesDTO {
    timing: TimingRulesDTO
    navigation: NavigationRulesDTO
    proctoring: ProctoringRulesDTO
    behavior: BehaviorRulesDTO
    autoSave: AutoSaveRulesDTO
}

export interface CompanyCreateTestInputDTO {
    companyId: string
    jobRoleId: string
    name: string
    description: string
    startTime: Date
    endTime: Date
    questions: CreateTestQuestionInputDTO[]
    candidates: CreateTestCandiateInputDTO[]
    rules: CreateTestRulesDTO
}

export interface CompanyCreateTestOutputDTO {
    test: TestEntity
}