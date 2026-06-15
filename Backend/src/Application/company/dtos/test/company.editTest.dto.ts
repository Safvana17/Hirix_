import { TestEntity } from "../../../../Domain/entities/Test.entity"
import QuestionType from "../../../../Domain/enums/questionType"
import { QuestionSource } from "../../../../Domain/enums/Test"
import { TestCase } from "../../../../Domain/valueObjects/question.testCase"

export interface EditTestQuestionInputDTO {
    id?: string
    source: QuestionSource
    type: QuestionType
    title: string
    order: number
    questionId?: string
    starterCode?: string,
    functionName?: string,
    description?: string
    options?: string[]
    answer?: string[]
    testCase?: TestCase[]
}

export interface EditTestCandiateInputDTO {
    email: string
}

export interface TimingRulesDTO {
    autoSubmitOnTimeEnd: boolean
    warningBeforeEndInMinutes: number
}

export interface NavigationRulesDTO {
    allowTabSwitch: boolean
    shuffleQuestions: boolean
    shuffleOptions: boolean
    allowBackNavigation: boolean
}

export interface ProctoringRulesDTO {
    enableCamera?: boolean
    movementDetection?: boolean
    captureSnapshots?: boolean
    snapshotIntervalSeconds?: number
    // detectNoFace?: boolean
    // detectMultipleFaces?: boolean
}

export interface BehaviorRulesDTO {
    enforceFullScreen?: boolean
    allowCopyPaste?: boolean
    allowRightClick?: boolean
    allowKeyboardShortcuts?: boolean
}

export interface AutoSaveRulesDTO {
    enabled?: boolean
    intervalInSeconds?: number
    saveOnEveryAnswer?: boolean
}
export interface WarningRuleDTO {
    maxWarningCount?: number
    autoSubmitOnMaxWarnings?: boolean
}

export interface EditTestRulesDTO {
    timing: TimingRulesDTO
    navigation: NavigationRulesDTO
    proctoring: ProctoringRulesDTO
    behavior: BehaviorRulesDTO
    autoSave: AutoSaveRulesDTO
    warning: WarningRuleDTO
}

export interface CompanyEditTestInputDTO {
    testId: string
    companyId: string
    jobRoleId: string
    name: string
    description: string
    startTime: Date
    endTime: Date
    questions: EditTestQuestionInputDTO[]
    candidates: EditTestCandiateInputDTO[]
    rules: EditTestRulesDTO
}

export interface CompanyEditTestOutputDTO {
    test: TestEntity
}