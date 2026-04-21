export type NotificationChannel = 'EMAIL' | 'IN_aPP'

export interface NotificationRule {
    id: string;
    event: string;
    channel: NotificationChannel;
    templateKey: string
    isActive: boolean
}

export interface CreateNotificationRulePayload {
    event: string;
    channel: NotificationChannel;
    templateKey: string;
    isActive: boolean
}

export interface UpdateNotificationRulePayload {
    id: string
    templateKey?: string
    isActive?: boolean
}
