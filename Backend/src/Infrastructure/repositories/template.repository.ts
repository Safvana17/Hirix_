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
    protected mapToEntity(doc: ITemplate): TemplateEntity {
        return TemplateMapper.toEntity(doc)
    }
    protected mapToPersistance(entity: TemplateEntity): Partial<ITemplate> {
        return TemplateMapper.toDocument(entity)
    }
}