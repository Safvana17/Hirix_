import { TestCandidateEntity } from "../../../../Domain/entities/TestCandidate.entity"
import { TestQuestionEntity } from "../../../../Domain/entities/TestQuestion.entity"
import { TestStatus } from "../../../../Domain/enums/Test"
import { TestRules } from "../../../../Domain/valueObjects/test.rules"

export interface CompanyGetTestByIDInputDTO {
    companyId: string
    testId: string
}

export interface CompanyGetTestByIDOutputDTO {
        Test: {
            id: string
            name: string
            description: string
            jobRoleId: string
            jobrole: string
            startTime: Date
            endTime: Date
            companyName: string
            rules: TestRules
            questions: TestQuestionEntity[]
            testStatus: TestStatus
            candidates: TestCandidateEntity[]
        }
}