import userRole from "../enums/userRole.enum";

export class NotificationEntity {
    id: string;
    recipientId: string;
    recipientType: userRole;
    event: string;
    title: string;
    message: string;
    isRead: boolean;
    metaData: Record<string, string>;

    constructor(id: string, recipientId: string, recipientType: userRole, event: string, title: string, message: string, isRead: boolean, metaData: Record<string, string>) {
        this.id = id
        this.recipientId = recipientId
        this.recipientType = recipientType
        this.event = event
        this.title = title
        this.message = message
        this.metaData = metaData
        this.isRead = isRead
    }
}