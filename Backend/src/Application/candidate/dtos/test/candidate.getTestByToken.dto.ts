import { TestCandidateEntity } from "../../../../Domain/entities/TestCandidate.entity"
import { TestQuestionEntity } from "../../../../Domain/entities/TestQuestion.entity"
import { TestStatus } from "../../../../Domain/enums/Test"
import { TestRules } from "../../../../Domain/valueObjects/test.rules"

export interface CandidateGetTestByTokenInputDTO {
    token: string
    clientSessionToken?: string
}

export interface CandidateGetTestByTokenOutputDTO {
    test: {
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
    },
    candidate: TestCandidateEntity
}