import { TestStatus } from "../enums/Test"

export class TestEntity {
    id: string
    name: string
    companyId: string
    jobRoleId: string
    description: string
    startTime: Date
    endTime: Date
    rules: string[]
    testStatus: TestStatus

    constructor (
        id: string,
        name: string,
        companyId: string,
        jobRoleId: string,
        description: string,
        startTime: Date,
        endTime: Date,
        rules: string[],
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
        this.testStatus = testStatus
    }
}