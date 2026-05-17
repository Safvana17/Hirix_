import { NotificationChannel, TemplateFieldPurpose, TemplateFieldType } from "../../../../Domain/enums/notification";

export interface TemplateFieldOptionsInputDTO {
    label: string
    value: string
}
export interface TemplateFieldInputDTO {
    name: string
    label: string
    type: TemplateFieldType
    required: boolean
    placeholder?: string
    purpose?: TemplateFieldPurpose
    order?: number
    options?: TemplateFieldOptionsInputDTO[]
}
export interface AdminCreateEmailTemplateInputDTO {
    key: string;
    name: string;
    channel: NotificationChannel;
    fields: TemplateFieldInputDTO[];
    values: Record<string, unknown>
}

export interface AdminCreateEmailTemplateOutputDTO {
    success: boolean
}