import { TemplateEntity } from "../../Domain/entities/Template.entity";
import { ITemplate } from "../../Infrastructure/database/Model/Template";

export class TemplateMapper {
    static toEntity(doc: ITemplate): TemplateEntity {
        const template = new TemplateEntity (
            doc._id.toString(),
            doc.key,
            doc.name,
            doc.channel,
            doc.subject,
            doc.title,
            doc.body,
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
            subject: entity.subject,
            title: entity.title,
            body: entity.body,
            isActive:  entity.isActive,
            isDeleted: entity.isDeleted
        }
    }
}