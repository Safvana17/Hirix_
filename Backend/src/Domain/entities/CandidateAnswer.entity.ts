import QuestionType from "../enums/questionType"

export interface CodingAnswer {
    language: string
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

    constructor (
        id: string,
        testQuestionId: string,
        questionType: QuestionType,
        timeTakenInSeconds: number,
        selectedOptionIds?: string[],
        descriptiveAnswer?: string,
        codingAnswer?: CodingAnswer,
        isCorrect?: boolean,
        marksObtained?: number
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
    }
}