import { TestMapper } from "../../Application/Mappers/mapper.companyTest";
import { TestEntity } from "../../Domain/entities/Test.entity";
import { ITestRepository } from "../../Domain/repositoryInterface/iTest.repository";
import { ITest, TestModel } from "../database/Model/Test";
import { BaseRepository } from "./base.repository";

export class TestRepository extends BaseRepository<TestEntity, ITest> implements ITestRepository {
    constructor(){
       super(TestModel)
    }

    async findByCompanyId(companyId: string): Promise<TestEntity | null> {
        const document = await this._model.findOne({companyId})
        if(!document) return null
        return this.mapToEntity(document)
    }

    async findByName(name: string, companyId: string): Promise<TestEntity | null> {
        const document = await this._model.findOne({
            name, 
            companyId,
            testStatus: 'ACTIVE'
        })
        if(!document) return null
        return this.mapToEntity(document)
    }

    async findByJobroleId(jobRoleId: string, companyId: string): Promise<TestEntity | null> {
        const document = await this._model.findOne({jobRoleId, companyId, testStatus: 'ACTIVE'})
        if(!document) return null
        return this.mapToEntity(document)
    }

    protected mapToEntity(doc: ITest): TestEntity {
        return TestMapper.toEntity(doc)
    }

    protected mapToPersistance(entity: TestEntity): Partial<ITest> {
        return TestMapper.toPersistence(entity)
    }

}