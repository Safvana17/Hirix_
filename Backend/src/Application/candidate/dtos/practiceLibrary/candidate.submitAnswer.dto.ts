import QuestionType from "../../../../Domain/enums/questionType"
import { CodingLanguage } from "../../../../Domain/enums/Test"

export interface CandidateSubmitAnswerInputDTO {
    candidateId: string
    questionId: string
    questionType: QuestionType
    selectedOption?: string[]
    descriptiveAnswer?: string
    codingAnswer?: {
        language?: CodingLanguage
        sourceCode: string
        // input?: string
    }
}

export interface CandidateSubmitAnswerOutputDTO {
    isCorrect: boolean
    correctAnswer?: string | string[]
    feedback?: string | null
    hasDetailedExplanation: boolean
}