import QuestionType from "../../../../Domain/enums/questionType"
import { CodingLanguage } from "../../../../Domain/enums/Test"

export interface CandidateSubmitAnswerDTO {
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
export interface CandidateSubmitTestInputDTO{
    token: string
    clientSessionToken?: string
    answer: CandidateSubmitAnswerDTO[]
    warningCount: number
}

export interface CandidateSubmitTestOutputDTO {
    success: boolean
}