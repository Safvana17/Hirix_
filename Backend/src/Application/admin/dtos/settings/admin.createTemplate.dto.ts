import { NotificationChannel } from "../../../../Domain/enums/notification";

export interface AdminCreateEmailTemplateInputDTO {
    key: string;
    name: string;
    channel: NotificationChannel;
    subject: string;
    title: string;
    body: string
}

export interface AdminCreateEmailTemplateOutputDTO {
    success: boolean
}