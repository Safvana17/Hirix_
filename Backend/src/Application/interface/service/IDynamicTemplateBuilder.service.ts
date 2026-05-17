import { TemplateEntity } from "../../../Domain/entities/Template.entity";


export interface BuilEmailTemplate {
    subject: string
    html: string
}

export interface BuildNotificationTemplate {
    title: string
    message: string
}
export interface IDynamicEmailBuilderService {
    buildEmail(template: TemplateEntity, variables: Record<string, string>): BuilEmailTemplate
    buildNotification(template: TemplateEntity, variables: Record<string, string>): BuildNotificationTemplate
}