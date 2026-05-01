import { TestCandidateMapper } from "../../Application/Mappers/mapper.testCandidate";
import { TestCandidateEntity } from "../../Domain/entities/TestCandidate.entity";
import { ITestCandidateRepository } from "../../Domain/repositoryInterface/iTestCandidate.repository";
import { ITestCandidate, TestCandidateModel } from "../database/Model/TestCandidate";
import { BaseRepository } from "./base.repository";

export class TestCandidateRepository extends BaseRepository<TestCandidateEntity, ITestCandidate> implements ITestCandidateRepository{
    constructor() {
        super(TestCandidateModel)
    }

    async findByTestLink(testLink: string): Promise<TestCandidateEntity | null> {
        const document = await this._model.findOne({testLink})
        if(!document) return null
        return this.mapToEntity(document)
    }

    async findByTestId(testId: string): Promise<TestCandidateEntity[] | null> {
        const documents = await this._model.find({testId})
        if(!documents) return null
        return documents.map( d => this.mapToEntity(d) )
    }

    async countByTestIds(testId: string): Promise<number> {
        return this._model.countDocuments({testId})
    }

    protected mapToEntity(doc: ITestCandidate): TestCandidateEntity {
        return TestCandidateMapper.toEntity(doc)
    }

    protected mapToPersistance(entity: TestCandidateEntity): Partial<ITestCandidate> {
        return TestCandidateMapper.toPersistence(entity)
    }
}