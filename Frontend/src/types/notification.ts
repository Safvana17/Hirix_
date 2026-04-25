import type { UserRole } from "../constants/role";

export type NotificationChannel = 'EMAIL' | 'IN_APP'

export interface NotificationRuleBase {
    id: string;
    event: string;
    channel: NotificationChannel;
    templateKey: string
    isActive: boolean
}
export interface NotificationRule extends NotificationRuleBase{
    id: string
}

export type CreateNotificationRulePayload = NotificationRuleBase
    

export interface UpdateNotificationRulePayload {
    id: string
    templateKey?: string
    isActive?: boolean
}

export interface Notification {
    id: string;
    recipientId: string;
    recipientType: UserRole;
    event: string;
    title: string;
    message: string;
    isRead: boolean;
    metaData: Record<string, string>;
}

export interface GetAllNotificationRuleParams {
    search?: string
    channel?: NotificationChannel
    page: number
    limit: number
}

export interface GetAllNotificationRuleResponse {
    rules: NotificationRule[]
    totalPages: number
    totalCount: number
}
