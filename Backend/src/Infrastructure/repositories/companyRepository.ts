import { CompanyMapper } from "../../Application/Mappers/mapper.company";
import CompanyEntity from "../../Domain/entities/company.entity";
import ICompanyRepository from "../../Domain/repositoryInterface/iCompany.repository";
import { companyModel, ICompany } from "../database/Model/company";
import { BaseRepository } from "./base.repository";
import type { QueryFilter } from "mongoose";

export class CompanyRepository extends BaseRepository<CompanyEntity, ICompany> implements ICompanyRepository {

    constructor(){
        super(companyModel)
    }
    async findByEmail(email: string): Promise<CompanyEntity | null> {
        const company = await this._model.findOne({email})
        if(!company) return null
        return CompanyMapper.toEntity(company)
    }

    async updatePassword(id: string, hashedPassword: string): Promise<void> {
        await this._model.findByIdAndUpdate(
            id,
            {$set: {password: hashedPassword}}
        )
    }

    async updateGoogleId(email: string, googleId: string): Promise<CompanyEntity | null> {
        const document = await this._model.findOneAndUpdate(
            {
                email,
                googleId: { $exists: false}
            }, 
            {
                $set: {googleId}
            },
            {new: true}
        )

        if(!document) return null
        return this.mapToEntity(document)
    }

    async findAllFiltered(query: { search?: string; status?: string; page: number; limit: number; }): Promise<{ data: CompanyEntity[]; totalPages: number; totalCount: number; }> {
        const filter: QueryFilter<ICompany> = {}
        if(query.search){
            filter.$or = [
                {name: {$regex: query.search, $options: 'i'} },
                {email: {$regex: query.search, $options: 'i'} }
            ]
        }
        if (query.status) {

            if (query.status === "blocked") {
            filter.isBlocked = true
            }

            else if (query.status === "active") {
            filter.status = "active"
            filter.isBlocked = false
            }

            else if (query.status === "pending") {
            filter.status = "pending"
            filter.isBlocked = false
            }

            else if (query.status === "rejected") {
            filter.status = "rejected"
            }
        }

        const skip = (query.page - 1) * query.limit
        const totalCount = await this._model.countDocuments(filter)
        const totalPages =Math.ceil(totalCount / query.limit)

        const documents = await this._model.find(filter)
              .skip(skip)
              .limit(query.limit)
              .sort({createdAt: -1})

        return {
            data: documents.map(doc => this.mapToEntity(doc)),
            totalPages,
            totalCount
        }
    }

    // async revokeRefreshToken(hashedToken: string): Promise<void> {
    //     await this._model.findOneAndUpdate(
    //         {refreshToken: hashedToken},
    //         {$pull: {refreshToken: hashedToken}}
    //     )
    // }

    protected mapToEntity(doc: ICompany): CompanyEntity {
        return CompanyMapper.toEntity(doc)
    }

    protected mapToPersistance(entity: CompanyEntity): Partial<ICompany> {
        return CompanyMapper.toDocument(entity)
    }
}