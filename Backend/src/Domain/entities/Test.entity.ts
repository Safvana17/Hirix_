import { TestStatus } from "../enums/Test"
import { TestRules } from "../valueObjects/test.rules"
import { TestQuestionEntity } from "./TestQuestion.entity"

export class TestEntity {
    id: string
    name: string
    companyId: string
    jobRoleId: string
    description: string
    startTime: Date
    endTime: Date
    rules: TestRules
    questions: TestQuestionEntity[]
    testStatus: TestStatus

    constructor (
        id: string,
        name: string,
        companyId: string,
        jobRoleId: string,
        description: string,
        startTime: Date,
        endTime: Date,
        rules: TestRules,
        questions: TestQuestionEntity[],
        testStatus: TestStatus
    ) {
        this.id = id
        this.name = name
        this.companyId = companyId
        this.jobRoleId = jobRoleId
        this.description = description
        this.startTime = startTime
        this.endTime = endTime
        this.rules = rules
        this.questions = questions
        this.testStatus = testStatus
    }
}