import { QueryFilter } from "mongoose";
import { TemplateMapper } from "../../Application/Mappers/mapper.template";
import { TemplateEntity } from "../../Domain/entities/Template.entity";
import { ITemplateRepository } from "../../Domain/repositoryInterface/iTemplate.repository";
import { ITemplate, TemplateModel } from "../database/Model/Template";
import { BaseRepository } from "./base.repository";

export class TemplateRepository extends BaseRepository<TemplateEntity, ITemplate> implements ITemplateRepository {
    constructor(){
        super(TemplateModel)
    }

    async findByKey(key: string): Promise<TemplateEntity | null> {
        const document = await this._model.findOne({key})
        if(!document) return null
        return this.mapToEntity(document)
    }
    async findAllFiltered(query: { page: number; limit: number; isActive?: boolean; }): Promise<{ data: TemplateEntity[]; totalPages: number; totalCount: number; }> {
        const filter: QueryFilter<ITemplate> = {
            isDeleted: false
        }

        if(query.isActive){
            filter.isActive = query.isActive
        }

        const skip = (query.page - 1) * query.limit
        const totalCount = await this._model.countDocuments(filter)
        const totalPages = Math.ceil(totalCount / query.limit)

        const documents = await this._model.find(filter)
              .sort({createdAt: -1})
              .skip(skip)
              .limit(query.limit)

        return {
            data: documents.map(d => this.mapToEntity(d)),
            totalPages,
            totalCount
        }
    }

    protected mapToEntity(doc: ITemplate): TemplateEntity {
        return TemplateMapper.toEntity(doc)
    }
    protected mapToPersistance(entity: TemplateEntity): Partial<ITemplate> {
        return TemplateMapper.toDocument(entity)
    }
}