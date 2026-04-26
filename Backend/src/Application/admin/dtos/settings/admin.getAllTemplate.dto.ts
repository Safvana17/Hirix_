import { TemplateEntity } from "../../../../Domain/entities/Template.entity"
import { NotificationChannel } from "../../../../Domain/enums/notification"

export interface AdminGetAllTemplatesInputDTO {
    page: number
    limit?: number
    search?: string
    channel?: NotificationChannel
}

export interface AdminGetAllTemplatesOutputDTO {
    templates: TemplateEntity[]
    totalPages: number
    totalCount: number
}