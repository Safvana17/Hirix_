import { InterviewEntity } from "../entities/Interview";
import { InterviewStatus } from "../enums/interview";
import { IBaseRepository } from "./iBase.repository";

export interface IInterviewRepository extends IBaseRepository<InterviewEntity> {
    findByToken(token: string): Promise<InterviewEntity | null>
    findScheduledInterview(testCandidateId: string, round: number): Promise<InterviewEntity | null>  
    findAllFiltered(query: { companyId: string, search?: string, status?: InterviewStatus, page: number, limit: number}): Promise<{data: InterviewEntity[], totalCount: number, totalPages: number}>  
}