import userRole from "../../../../Domain/enums/userRole.enum"

export interface EventRecipientDTO {
    recipientId?: string
    recipientType: userRole
    email?: string
}

export interface ProcessNotificationEventInputDTO {
    event: string
    recipients: EventRecipientDTO[]
    variables: Record<string, string>
    metaData?: Record<string, string>
}

export interface ProcessNotificationEventOutputDTO {
    success: boolean
}