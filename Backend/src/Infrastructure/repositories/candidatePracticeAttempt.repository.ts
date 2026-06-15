import { CandidatePracticeAttemptMapper } from "../../Application/Mappers/mapper.candidatePracticeAttempt";
import { CandidatePracticeAttemptEntity } from "../../Domain/entities/CandidatePracticeAttempt.entity";
import { ICandidatePracticeAttemptRepository } from "../../Domain/repositoryInterface/ICandidatePracticeAttempt.repository";
import { CandidatePracticeAttemptModel, ICandidatePracticeAttempt } from "../database/Model/CandidatePracticeAttempt";
import { BaseRepository } from "./base.repository";

export class CandidatePracticeAttemptRepository extends BaseRepository<CandidatePracticeAttemptEntity, ICandidatePracticeAttempt> implements ICandidatePracticeAttemptRepository {
    constructor () {
        super(CandidatePracticeAttemptModel)
    }

    async findAttemptedQuestionIds(candidateId: string): Promise<string[]> {
        const attempts = await this._model.find({candidateId}).select("questionId")
        return attempts.map((attempt) => attempt.questionId.toString())
    }

    async findByQuestionId(questionId: string, candidateId: string): Promise<CandidatePracticeAttemptEntity | null> {
        const document = await this._model.findOne({questionId, candidateId})
        if(!document) return null
        return this.mapToEntity(document)
    }
    
    protected mapToEntity(doc: ICandidatePracticeAttempt): CandidatePracticeAttemptEntity {
        return CandidatePracticeAttemptMapper.mapToEntity(doc)
    }

    protected mapToPersistance(entity: CandidatePracticeAttemptEntity): Partial<ICandidatePracticeAttempt> {
        return CandidatePracticeAttemptMapper.mapToPersistence(entity)
    }

}