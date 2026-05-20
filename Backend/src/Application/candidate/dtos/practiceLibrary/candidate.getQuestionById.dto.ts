import QuestionDifficulty from "../../../../Domain/enums/questionDifficulty"
import QuestionType from "../../../../Domain/enums/questionType"


export interface CandidateGetQuestionInputDTO {
    candidateId: string
    questionId: string
}

export interface CandidateGetQuestionOutputDTO {
    id: string
    type: QuestionType
    category: string
    difficulty: QuestionDifficulty
    title: string
    description: string
    isPremium: boolean
    starterCode?: string
    testCases?: {
        input?: string[]
        expectedOutput?: string
    }[]
    options?: string[]

}