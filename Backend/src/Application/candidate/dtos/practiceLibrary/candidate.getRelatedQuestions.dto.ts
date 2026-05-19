import { QuestionEntity } from "../../../../Domain/entities/Question.entity"

export interface CandidateGetRelatedQuestionsInputDTO {
    candidateId: string
    questionId: string
}

export interface CandidateGetRelatedQuestionsOutputDTO {
    questions: QuestionEntity[]
}