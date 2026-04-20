import { NotificationChannel } from "../enums/notification";

export class TemplateEntity {
    id: string;
    key: string;
    name: string;
    channel: NotificationChannel;
    subject: string | null;
    body: string;
    title: string | null;
    isActive: boolean;
    isDeleted: boolean;

    constructor(id: string, key: string, name: string, channel: NotificationChannel, subject: string | null, title: string | null, body: string,isActive: boolean, isDeleted: boolean) {
        this.id = id;
        this.key = key;
        this.name = name;
        this.channel = channel;
        this.subject = subject;
        this.body = body
        this.title = title;
        this.isActive = isActive;
        this.isDeleted = isDeleted
    }
}