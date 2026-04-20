import { NotificationChannel } from "../enums/notification";

export class NotificationRuleEntity {
    id: string;
    event: string;
    channel: NotificationChannel;
    templateKey: string;
    isActive: boolean;
    isDeleted: boolean

    constructor(id: string, event: string, channel: NotificationChannel, templateKey: string, isActive: boolean, isDeleted: boolean) {
        this.id = id
        this.event = event
        this.channel = channel
        this.templateKey = templateKey
        this.isActive = isActive
        this.isDeleted = isDeleted
    }
}