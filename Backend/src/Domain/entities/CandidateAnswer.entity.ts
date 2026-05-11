import QuestionType from "../enums/questionType"
import { CodingLanguage, ValuationStatus } from "../enums/Test"

export interface CodingAnswer {
    language: CodingLanguage
    code: string
    output?: string
}

export class CandidateAnswerEntity {
    id: string
    testQuestionId: string
    questionType: QuestionType
    timeTakenInSeconds: number
    selectedOptionIds?: string[]
    descriptiveAnswer?: string
    codingAnswer?: CodingAnswer
    isCorrect?: boolean
    marksObtained?: number
    totalMarks?: number
    evaluationStatus?: ValuationStatus
    aiFeedback?: string

    constructor (
        id: string,
        testQuestionId: string,
        questionType: QuestionType,
        timeTakenInSeconds: number,
        selectedOptionIds?: string[],
        descriptiveAnswer?: string,
        codingAnswer?: CodingAnswer,
        isCorrect?: boolean,
        marksObtained?: number,
        totalMarks?: number,
        evaluationStatus?: ValuationStatus,
        aiFeedback?: string
    ) {
        this.id = id
        this.testQuestionId = testQuestionId
        this.questionType = questionType
        this.timeTakenInSeconds = timeTakenInSeconds
        this.selectedOptionIds = selectedOptionIds
        this.descriptiveAnswer = descriptiveAnswer
        this.codingAnswer = codingAnswer
        this.isCorrect = isCorrect
        this.marksObtained = marksObtained
        this.totalMarks = totalMarks
        this.aiFeedback = aiFeedback
        this.evaluationStatus = evaluationStatus
    }
}