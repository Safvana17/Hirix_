import { TemplateEntity } from "../../../../Domain/entities/Template.entity";
import { NotificationChannel } from "../../../../Domain/enums/notification";

export interface AdminEditTemplateInputDTO {
    id: string;
    key: string;
    channel: NotificationChannel;
    name: string;
    subject: string;
    body: string
    title?: string
}

export interface AdminEditTemplateOutputDTO {
    template: TemplateEntity
}