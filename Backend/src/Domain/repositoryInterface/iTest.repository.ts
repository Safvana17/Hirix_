import { TestEntity } from "../entities/Test.entity";
import { IBaseRepository } from "./iBase.repository";

export interface ITestRepository extends IBaseRepository<TestEntity>{
    findByName(name: string): Promise<TestEntity | null>
    findByCompanyId(companyId: string): Promise<TestEntity | null>
    findByJobroleId(jobRoleId: string): Promise<TestEntity | null>
}