import { QueryFilter } from "mongoose";
import { InterviewMapper } from "../../Application/Mappers/mapper.interview";
import { InterviewEntity } from "../../Domain/entities/Interview";
import { InterviewStatus } from "../../Domain/enums/interview";
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

    async findScheduledInterview(testCandidateId: string, round: number): Promise<InterviewEntity | null> {
        const document = await this._model.findOne({
            testCandidateId, 
            round, 
            interviewStatus : {$ne: InterviewStatus.CANCELLED}
        })
        if(!document) return null
        return this.mapToEntity(document)
    }

    async findAllFiltered(query: {companyId: string, search?: string; status?: InterviewStatus; page: number; limit: number; }): Promise<{ data: InterviewEntity[]; totalCount: number; totalPages: number; }> {
        const filter: QueryFilter<IInterview> = {
            companyId: query.companyId
        }

        if(query.search){
            filter.$or = [
                {name: { $regex: query.search, $options: "i"}},
                {interviewerName: { $regex: query.search, $options: "i"}},
                {candidateName: {$regex: query.search, $options: "i"}}
            ]
        }
        if(query.status){
            filter.interviewStatus = query.status
        }

        const skip = (query.page - 1) * query.limit
        const totalCount = await this._model.countDocuments(filter)
        const totalPages = Math.ceil(totalCount/ query.limit)

        const documents = await this._model.find(filter)
                .sort({createdAt: -1})
                .skip(skip)
                .limit(query.limit)

        return {
            data: documents.map(d => this.mapToEntity(d)),
            totalCount,
            totalPages
        }
    }

    async findByRoomId(roomId: string): Promise<InterviewEntity | null> {
        const document = await this._model.findOne({roomId})
        if(!document) return null
        return this.mapToEntity(document)
    }

    async getTotalInterviewsByCompany(companyId: string): Promise<number> {
        return this._model.countDocuments({companyId, interviewStatus: { $ne: InterviewStatus.CANCELLED}})
    }
    
    protected mapToEntity(doc: IInterview): InterviewEntity {
        return InterviewMapper.mapToEntity(doc)
    }
    protected mapToPersistance(entity: InterviewEntity): Partial<IInterview> {
        return InterviewMapper.mapToPersistance(entity)
    }
}