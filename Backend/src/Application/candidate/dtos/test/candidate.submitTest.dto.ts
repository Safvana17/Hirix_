import QuestionType from "../../../../Domain/enums/questionType"

export interface CandidateSubmitAnswerDTO {
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
}
export interface CandidateSubmitTestInputDTO{
    token: string
    answer: CandidateSubmitAnswerDTO[]
}

export interface CandidateSubmitTestOutputDTO {
    success: boolean
}