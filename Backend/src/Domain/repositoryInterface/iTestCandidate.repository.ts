import { TestCandidateEntity } from "../entities/TestCandidate.entity";
import { IBaseRepository } from "./iBase.repository";

export interface ITestCandidateRepository extends IBaseRepository<TestCandidateEntity>{
    findByTestId(testId: string): Promise<TestCandidateEntity | null>
    findByTestLink(testLink: string): Promise<TestCandidateEntity | null>
}