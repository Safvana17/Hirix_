import { TestCandidateEntity } from "../entities/TestCandidate.entity";
import { IBaseRepository } from "./iBase.repository";

export interface ITestCandidateRepository extends IBaseRepository<TestCandidateEntity>{
    findByTestId(testId: string): Promise<TestCandidateEntity[] | null>
    findByToken(token: string): Promise<TestCandidateEntity | null>
    findByTestLink(testLink: string): Promise<TestCandidateEntity | null>
    countByTestIds(testId: string): Promise<number>
    findByEmail(email: string): Promise<TestCandidateEntity | null>
}