import { TestQuestionEntity } from "../../../../Domain/entities/TestQuestion.entity"
import { TestStatus } from "../../../../Domain/enums/Test"
import { TestRules } from "../../../../Domain/valueObjects/test.rules"

export interface CandidateGetTestByTokenInputDTO {
    token: string
}

export interface CandidateGetTestByTokenOutputDTO {
    id: string
    name: string
    description: string
    jobrole: string
    startTime: Date
    endTime: Date
    companyName: string
    rules: TestRules
    questions: TestQuestionEntity[]
    testStatus: TestStatus
}