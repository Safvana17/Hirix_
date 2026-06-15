import QuestionDifficulty from "../../../../Domain/enums/questionDifficulty"
import QuestionType from "../../../../Domain/enums/questionType"
import { TestCase } from "../../../../Domain/valueObjects/question.testCase"

export interface CandidateGetRelatedQuestionsInputDTO {
    candidateId: string
    questionId: string
}


export interface PracticeQuestionDTO {
    id: string
    title: string
    description: string
    type: QuestionType
    options?: string[]
    testCase?: TestCase[]
    starterCode?: string
    functionName?: string
    difficulty: QuestionDifficulty
    categoryId: string
    categoryName?: string
    isPremium: boolean
    isDeleted: boolean
    isAttended: boolean
}

export interface CandidateGetRelatedQuestionsOutputDTO {
    questions: PracticeQuestionDTO[]
}