import { NotificationChannel } from "../../../../Domain/enums/notification";

export interface AdminCreateEmailTemplateInputDTO {
    key: string;
    name: string;
    channel: NotificationChannel;
    subject: string;
    title: string;
    body: string;
    footerText?: string;
    ctaText?: string
    ctaUrl?: string
    showOtpBox?: boolean
    otpLabel?: string
    expiryText?: string
    supportText?: string
}

export interface AdminCreateEmailTemplateOutputDTO {
    success: boolean
}