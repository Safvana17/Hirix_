import { CandidateSelectionStatus, CandidateTestStatus } from "../enums/Test"
import { CandidateAnswerEntity } from "./CandidateAnswer.entity"

export class TestCandidateEntity {
    id: string
    testId: string
    name?: string
    email: string
    testToken: string
    candidateTestStatus: CandidateTestStatus
    warningCount: number
    candidateAnswers: CandidateAnswerEntity[]
    selectionStatus?: CandidateSelectionStatus
    totalMarks?: number
    totalQuestionsCount?: number
    aiRank?: number
    marksObtained?: number
    correctAnswerCount?: number
    startedAt?: Date
    submittedAt?: Date
    evaluatedAt?: Date

    constructor(
        id: string,
        testId: string,
        email: string,
        testToken: string,
        candidateTestStatus: CandidateTestStatus,
        warningCount: number,
        candidateAnswers: CandidateAnswerEntity[],
        totalMarks?: number,
        totalQuestionCount?: number,
        aiRank?: number,
        marksObtained?: number,
        correctAnswerCount?: number,
        selectionStatus?: CandidateSelectionStatus,
        startedAt?: Date,
        submittedAt?: Date,
        evaluatedAt?: Date,
    ) {
        this.id = id
        this.testId = testId
        this.email = email
        this.testToken = testToken
        this.candidateTestStatus = candidateTestStatus
        this.warningCount = warningCount
        this.candidateAnswers = candidateAnswers
        this.selectionStatus = selectionStatus
        this.aiRank = aiRank
        this.totalMarks = totalMarks
        this.marksObtained = marksObtained
        this.totalQuestionsCount = totalQuestionCount
        this.correctAnswerCount = correctAnswerCount
        this.startedAt = startedAt
        this.submittedAt = submittedAt
        this.evaluatedAt = evaluatedAt
    }
}