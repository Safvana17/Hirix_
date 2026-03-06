import { CompanyMapper } from "../../Application/Mappers/mapper.company";
import CompanyEntity from "../../Domain/entities/company.entity";
import ICompanyRepository from "../../Domain/repositoryInterface/iCompany.repository";
import { companyModel, ICompany } from "../database/Model/company";
import { BaseRepository } from "./base.repository";

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