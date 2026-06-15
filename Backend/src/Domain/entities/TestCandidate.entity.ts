import { CandidatePipelineStatus, CandidateTestStatus, ValuationStatus } from "../enums/Test"
import { CandidateAnswerEntity } from "./CandidateAnswer.entity"

export interface OptionOrder {
    questionId: string
    order: number[]
}

export class TestCandidateEntity {
    id: string
    testId: string
    name?: string
    email: string
    testToken: string
    questionOrder?: string[]
    mcqOptionsOrder?: OptionOrder[]
    selectionStatus?: CandidatePipelineStatus
    candidateTestStatus: CandidateTestStatus
    warningCount: number
    candidateAnswers: CandidateAnswerEntity[]
    evaluationStatus?: ValuationStatus
    totalMarks?: number
    totalQuestionsCount?: number
    aiRank?: number
    marksObtained?: number
    correctAnswerCount?: number
    totalTimeTakenInSeconds?: number
    startedAt?: Date
    submittedAt?: Date
    evaluatedAt?: Date
    currentInterviewRound?: number
    lastInterviewId?: string

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
        selectionStatus?: CandidatePipelineStatus,
        evaluationStatus?: ValuationStatus,
        totalTimeTakenInSeconds?: number,
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
        this.evaluationStatus = evaluationStatus
        this.aiRank = aiRank
        this.totalMarks = totalMarks
        this.marksObtained = marksObtained
        this.totalQuestionsCount = totalQuestionCount
        this.correctAnswerCount = correctAnswerCount
        this.totalTimeTakenInSeconds = totalTimeTakenInSeconds
        this.startedAt = startedAt
        this.submittedAt = submittedAt
        this.evaluatedAt = evaluatedAt
    }
}