import { TemplateEntity, TemplateField } from "../../../../Domain/entities/Template.entity";
import { NotificationChannel } from "../../../../Domain/enums/notification";

export interface AdminEditTemplateInputDTO {
    id: string;
    key: string;
    channel: NotificationChannel;
    name: string;
    fields: TemplateField[]
    values: Record<string, unknown>
}

export interface AdminEditTemplateOutputDTO {
    template: TemplateEntity
}