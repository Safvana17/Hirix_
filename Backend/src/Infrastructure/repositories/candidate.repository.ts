import CandidateEntity from "../../Domain/entities/candidate.entity";
import ICandidateRepository from "../../Domain/repositoryInterface/iCandidate.repository";
import { candidateMapper } from "../../Application/Mappers/mapper.candidate";
import { candidateModel, ICandidate } from "../database/Model/candidate";
import { BaseRepository } from "./base.repository";
import { logger } from "../../utils/logging/loger";
import mongoose, { QueryFilter } from "mongoose";

export class CandidateRepository extends BaseRepository <CandidateEntity, ICandidate> implements ICandidateRepository {

    constructor(){
        super(candidateModel)
    }
    
    async findByEmail(email: string): Promise<CandidateEntity | null> {
        const candidate = await this._model.findOne({email})

        if(!candidate) return null

        return candidateMapper.toEntity(candidate)
    }

    async updatePassword(id: string, hashedPassword: string): Promise<void> {

          logger.info(`Reset password ID: ${id}`);
          logger.info(`Is valid ObjectId:${mongoose.Types.ObjectId.isValid(id)}`);
        await this._model.findByIdAndUpdate(
            id, 
            {$set: {password: hashedPassword}}
        )
    }

    // async updateToken(id: string, token: string): Promise<void> {
    //     await this._model.findByIdAndUpdate(id,
    //         {$push: {refreshToken: token}}
    //     )
    // }

    async updateGoogleId(email: string, googleId: string): Promise<CandidateEntity | null> {
       const document = await this._model.findOneAndUpdate({email}, {googleId})
       if(!document) return null
       return this.mapToEntity(document)
    }

    // async revokeRefreshToken(hashedToken: string): Promise<void> {
    //     await this._model.findOneAndUpdate(
    //         {refreshToken: hashedToken},
    //         {$pull: {refreshToken: hashedToken}}
    //     )
    // }

    async findAllFiltered(query: { search?: string; status?: string; page: number; limit: number; }): Promise<{ data: CandidateEntity[]; totalPages: number; totalCount: number; }> {
        const filter: QueryFilter<ICandidate> = {}
        if(query.search){
            filter.$or = [
                {name: { $regex: query.search, $options: 'i' } },
                { email: { $regex: query.search, $options: 'i' } }
            ]
        }
        if(query.status){
            filter.isBlocked = query.status === 'Blocked'
        }

        const skip = (query.page - 1) * query.limit
        const totalCount = await this._model.countDocuments(filter)
        const totalPages = Math.ceil(totalCount / query.limit)

        const document = await this._model.find(filter)
              .skip(skip)
              .limit(query.limit)
              .sort({createdAt: -1})

        return {
            data: document.map(doc => this.mapToEntity(doc)),
            totalCount,
            totalPages
        }
    }
    
    protected mapToEntity(doc: ICandidate): CandidateEntity {
        return candidateMapper.toEntity(doc)
    }

    protected mapToPersistance(entity: CandidateEntity): Partial<ICandidate> {
        return candidateMapper.toDocument(entity)
    }
}