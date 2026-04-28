import { CandidateTestStatus } from "../enums/Test"
import { CandidateAnswerEntity } from "./CandidateAnswer.entity"

export class TestCandidateEntity {
    id: string
    testId: string
    email: string
    testLink: string
    candidateTestStatus: CandidateTestStatus
    warningCount: number
    candidateAnswers: CandidateAnswerEntity[]
    aiRank?: number
    startedAt?: Date
    submittedAt?: Date

    constructor(
        id: string,
        testId: string,
        email: string,
        testLink: string,
        candidateTestStatus: CandidateTestStatus,
        warningCount: number,
        candidateAnswers: CandidateAnswerEntity[],
        aiRank?: number,
        startedAt?: Date,
        submittedAt?: Date
    ) {
        this.id = id
        this.testId = testId
        this.email = email
        this.testLink = testLink
        this.candidateTestStatus = candidateTestStatus
        this.warningCount = warningCount
        this.candidateAnswers = candidateAnswers
        this.aiRank = aiRank
        this.startedAt = startedAt
        this.submittedAt = submittedAt
    }
}