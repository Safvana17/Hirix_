import { TemplateEntity } from "../../Domain/entities/Template.entity";
import { ITemplate } from "../../Infrastructure/database/Model/Template";

export class TemplateMapper {
    static toEntity(doc: ITemplate): TemplateEntity {
        const template = new TemplateEntity (
            doc._id.toString(),
            doc.key,
            doc.name,
            doc.channel,
            doc.fields || [],
            doc.values || {},
            doc.isActive,
            doc.isDeleted
        )
        return template
    }

    static toDocument(entity: TemplateEntity){
        return {
            key: entity.key,
            name: entity.name,
            channel: entity.channel,
            fields: entity.fields,
            values: entity.values,
            isActive:  entity.isActive,
            isDeleted: entity.isDeleted
        }
    }
}