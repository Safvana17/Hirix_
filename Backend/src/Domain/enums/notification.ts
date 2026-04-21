export type NotificationChannel = 'EMAIL' | 'IN_APP'

export type EmailLayoutType = 'COMMON'


export const NotificationEvents = {
    REGISTER_OTP_REQUESTED: 'REGISTER_OTP_REQUESTED',
    COMPANY_PROFILE_UPDATED: 'COMPANY_PROFILE_UPDATED',
    COMPANY_APPROVED: 'COMPANY_APPROVED',
    COMPANY_REJECTED: 'COMPANY_REJECTED',
    RESET_PASSWORD_OTP_REQUESTED: 'RESET_PASSWORD_OTP_REQUESTED',
    SUBSCRIPTION_REMINDER: 'SUBSCRIPTION_REMINDER',
    ACCOUNT_DELETED: 'ACCOUNT_DELETED',
    ACCOUNT_RESTORE: 'ACCOUNT_RESTORE',   
} as const

export type NotificationEvent = (typeof NotificationEvents)[keyof typeof NotificationEvents]


export const NotificationChannels = {
  EMAIL: 'EMAIL',
  IN_APP: 'IN_APP'
} as const

// export type NotificationChannel =
//   (typeof NotificationChannels)[keyof typeof NotificationChannels]