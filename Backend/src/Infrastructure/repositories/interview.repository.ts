import { InterviewMapper } from "../../Application/Mappers/mapper.interview";
import { InterviewEntity } from "../../Domain/entities/Interview";
import { IInterviewRepository } from "../../Domain/repositoryInterface/iInterview.repository";
import { IInterview, InterviewModel } from "../database/Model/Interview";
import { BaseRepository } from "./base.repository";

export class InterviewRepository extends BaseRepository<InterviewEntity, IInterview> implements IInterviewRepository {
    constructor() {
        super(InterviewModel)
    }
    async findByToken(token: string): Promise<InterviewEntity | null> {
        const document = await this._model.findOne({candidateToken: token})
        if(!document) return null
        return this.mapToEntity(document)
    }
    protected mapToEntity(doc: IInterview): InterviewEntity {
        return InterviewMapper.mapToEntity(doc)
    }
    protected mapToPersistance(entity: InterviewEntity): Partial<IInterview> {
        return InterviewMapper.mapToPersistance(entity)
    }
}