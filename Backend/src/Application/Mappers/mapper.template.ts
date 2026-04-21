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

        template.footerText = doc.footerText
        template.ctaText = doc.ctaText
        template.ctaUrl = doc.ctaUrl
        template.showOtpBox = doc.showOtpBox
        template.otpLabel = doc.otpLabel
        template.supportText = doc.supportText
        template.expiryText = doc.expiryText
        template.layOutType = doc.layOutType

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
            footerText: entity.footerText,
            ctaText: entity.ctaText,
            ctaUrl: entity.ctaUrl,
            otpLabel: entity.otpLabel,
            expiryText: entity.expiryText,
            supportText: entity.supportText,
            showOtpBox: entity.showOtpBox,
            layOutType: entity.layOutType,
            isActive:  entity.isActive,
            isDeleted: entity.isDeleted
        }
    }
}