import { TemplateEntity } from "../../../../Domain/entities/Template.entity"

export interface AdminGetAllTemplatesInputDTO {
    page: number
    limit?: number
    isActive?: boolean
}

export interface AdminGetAllTemplatesOutputDTO {
    templates: TemplateEntity[]
    totalPages: number
    totalCount: number
}