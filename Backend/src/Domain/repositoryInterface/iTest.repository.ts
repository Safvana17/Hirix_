import { TestEntity } from "../entities/Test.entity";
import { TestStatus } from "../enums/Test";
import { IBaseRepository } from "./iBase.repository";


export interface CompanyTestList{
    id: string
    name: string
    jobRole: {
        id: string
        name: string
    }
    startTime: Date
    endTime: Date
    testStatus: TestStatus
    isDeleted: boolean
}
export interface ITestRepository extends IBaseRepository<TestEntity>{
    findByName(name: string, companyId: string): Promise<TestEntity | null>
    findByCompanyId(companyId: string): Promise<TestEntity | null>
    findByJobroleId(jobRoleId: string, companyId: string): Promise<TestEntity | null>
    findAllFiltered(query: {companyId: string, search?: string, status?: TestStatus, page: number, limit: number}): Promise<{data: CompanyTestList[], totalPages: number, totalCount: number}>
    CountTestInMonth(companyId: string, startOfMonth: Date, endOfMonth: Date): Promise<number>
}