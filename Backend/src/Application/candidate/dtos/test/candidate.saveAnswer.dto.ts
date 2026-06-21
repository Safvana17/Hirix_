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
export interface CandidateSaveAnswerInputDTO{
    token: string
    clientSessionToken?: string
    answer: CandidateAnswerDTO[]
    warningCount: number
}

export interface CandidateSaveAnswerOutputDTO {
    success: boolean
}