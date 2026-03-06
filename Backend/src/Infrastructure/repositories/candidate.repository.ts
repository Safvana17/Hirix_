import CandidateEntity from "../../Domain/entities/candidate.entity";
import ICandidateRepository from "../../Domain/repositoryInterface/iCandidate.repository";
import { candidateMapper } from "../../Application/Mappers/mapper.candidate";
import { candidateModel, ICandidate } from "../database/Model/candidate";
import { BaseRepository } from "./base.repository";
import { logger } from "../../utils/logging/loger";
import mongoose from "mongoose";

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
    
    protected mapToEntity(doc: ICandidate): CandidateEntity {
        return candidateMapper.toEntity(doc)
    }

    protected mapToPersistance(entity: CandidateEntity): Partial<ICandidate> {
        return candidateMapper.toDocument(entity)
    }

    // async findById(id: string): Promise<CandidateEntity | null> {
    //     const candidate = await candidateModel.findById({id})
    //     if(!candidate) return null
    //     return candidateMapper.toEntity(candidate)
    // }

    // async save(candidate: CandidateEntity): Promise<CandidateEntity | null> {
    //     const candidateData = candidateMapper.toDocument(candidate)

    //     const updatedCandidate = await candidateModel.findByIdAndUpdate(
    //         candidate.getId(),
    //         candidateData,
    //         {new: true}
    //     )

    //     if(!updatedCandidate){
    //         throw new Error ('Candidate not found')
    //     }
    // }

 // async createCandidate(candidate: CandidateEntity): Promise<CandidateEntity> {
    //     const candidateData = candidateMapper.toDocument(candidate)
    //     const savedCandidate = await candidateModel.create(candidateData)
    //     return candidateMapper.toEntity(savedCandidate)
    // }
}