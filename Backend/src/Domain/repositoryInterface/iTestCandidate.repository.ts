import { TestCandidateEntity } from "../entities/TestCandidate.entity";
import { CandidatePipelineStatus } from "../enums/Test";
import { IBaseRepository } from "./iBase.repository";

export interface ITestCandidateRepository extends IBaseRepository<TestCandidateEntity>{
    findByTestId(testId: string): Promise<TestCandidateEntity[] | null>
    findByToken(token: string): Promise<TestCandidateEntity | null>
    findByTestLink(testLink: string): Promise<TestCandidateEntity | null>
    countByTestIds(testId: string): Promise<number>
    findByEmail(email: string): Promise<TestCandidateEntity | null>
    getCandidateActivity(startDate: Date): Promise<{attendedCandidates: number; notAttendedCandidates: number; month: string}[]>
    getHiredCandidatesByCompany(companyId: string): Promise<number>
    getTestTrendByCompany(companyId: string, startDate: Date): Promise<{month: string; attendedCandidates: number}[]>
    getCandidateStatusDistribution(companyId: string, startDate: Date): Promise<{status: CandidatePipelineStatus; count: number}[]>
    getTotalTestAttended(email: string): Promise<number>
}