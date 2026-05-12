import QuestionType from "../../../../Domain/enums/questionType"
import { CodingLanguage } from "../../../../Domain/enums/Test"

export interface CandidateAnswerDTO {
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
}

export interface CandidateTerminateTestInputDTO {
    token: string
    warningCount: number
    answer: CandidateAnswerDTO[]
}

export interface CandidateTerminateTestOutputDTO {
    success: boolean
}