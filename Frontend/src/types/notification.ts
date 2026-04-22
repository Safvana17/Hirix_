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
