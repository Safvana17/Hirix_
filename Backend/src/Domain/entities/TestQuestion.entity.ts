import QuestionType from "../enums/questionType"
import { QuestionSource } from "../enums/Test"

export class TestQuestionEntity {
    id: string
    source: QuestionSource
    type: QuestionType
    title: string
    order: number
    mark: number
    questionId?: string
    description?: string
    options?: string[]
    answer?: string
    testCase?: string[]

    constructor(
        id: string,
        source: QuestionSource,
        type: QuestionType,
        title: string,
        order: number,
        mark: number,
        questionId?: string,
        description?: string,
        options?: string[],
        answer?: string,
        testCase?: string[]
    ) {
        this.id = id
        this.source = source
        this.type = type
        this.title = title
        this.order = order
        this.mark = mark
        this.questionId = questionId
        this.description = description
        this.options = options
        this.answer = answer
        this.testCase = testCase
    }
}