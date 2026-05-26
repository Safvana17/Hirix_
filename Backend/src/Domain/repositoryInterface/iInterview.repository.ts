import { InterviewEntity } from "../entities/Interview";
import { IBaseRepository } from "./iBase.repository";

export interface IInterviewRepository extends IBaseRepository<InterviewEntity> {
    findByToken(token: string): Promise<InterviewEntity | null>
    findScheduledInterview(testCandidateId: string, round: number): Promise<InterviewEntity | null>    
}