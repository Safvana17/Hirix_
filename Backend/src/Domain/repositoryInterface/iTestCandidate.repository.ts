import { TestLogDTO } from "../../Application/admin/dtos/analytics/admin.testLog.dto";
import { TestHistoryDTO } from "../../Application/candidate/dtos/analytics/candidate.testHistory.dto";
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
    getCandidateHistory(query: {email: string, page: number, limit: number}): Promise<{history: TestHistoryDTO[]; totalPages: number; totalCount: number}>
    getTestLog(query: { page: number, limit: number}): Promise<{test: TestLogDTO[]; totalCount: number; totalPages: number}>
    getCandidateParticipationTrend(startDate: Date): Promise<{month: string, totalCandidates: number, passedCount: number, rejectedCount: number}[]>
}