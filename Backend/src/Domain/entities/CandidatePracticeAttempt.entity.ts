export class CandidatePracticeAttemptEntity {
    id: string
    candidateId: string
    questionId: string
    isCorrect: boolean

    constructor (
        id: string, candidateId: string, questionId: string, isCorrect: boolean
    ) {
        this.id = id
        this.candidateId = candidateId
        this.questionId = questionId
        this.isCorrect = isCorrect
    }
}