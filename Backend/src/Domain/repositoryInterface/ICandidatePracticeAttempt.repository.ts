import { CandidatePracticeAttemptEntity } from "../entities/CandidatePracticeAttempt.entity";
import { IBaseRepository } from "./iBase.repository";

export interface ICandidatePracticeAttemptRepository extends IBaseRepository<CandidatePracticeAttemptEntity> {
    findAttemptedQuestionIds(candidateId: string): Promise<string[]>
    findByQuestionId(questionId: string, candidateId: string): Promise<CandidatePracticeAttemptEntity | null>
}