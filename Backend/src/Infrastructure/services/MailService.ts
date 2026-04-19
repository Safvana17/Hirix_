import { IMailService } from "../../Application/interface/service/IMailService";
import { otpEmailTemplate } from "../emailTemplates/OtpTemplate";
import { mailTransporter } from "../config/mail.config";
import { env } from "../config/env";
import { CompanyRegisterApprovalEmailTemplate } from "../emailTemplates/CompanyRegisterApprovalTemplate";
import { CompanyRegisterRejectionEmailTemplate } from "../emailTemplates/CompanyRegisterRejectionTemplate";
import { CompanyVerificationLinkTemplate } from "../emailTemplates/CompanyVerificationTemplate";
import { accountDeletionEmailTemplate } from "../emailTemplates/AccountDeleteionTemplate";
import { companyRestoreAccountTemplate } from "../emailTemplates/RestoreAccountEmailTemplate";
import { subscriptionReminderTemplate } from "../emailTemplates/SubscriptionReminderTemplate";

export class MailService implements IMailService{
    async sentOtp(email: string, otp: string): Promise<void> {
       console.log('from mail service')
        await mailTransporter.sendMail({
            from: `"Hirix" <${env.HIRIX_EMAIL}>`,
            to: email,
            subject: 'Your OTP Code',
            html: otpEmailTemplate(otp)
        })
    }

    async sendApprovalEmail(email: string, companyName: string): Promise<void> {
        await mailTransporter.sendMail({
            from: `"Hirix <${env.HIRIX_EMAIL}>`,
            to: email,
            subject: 'Congratulations! Your Hirix account is approved',
            html: CompanyRegisterApprovalEmailTemplate(companyName)
        })
    }

    async sendRejectionEmail(email: string, companyName: string, reason: string, link: string): Promise<void> {
        await mailTransporter.sendMail({
            from: `"Hirix <${env.HIRIX_EMAIL}>`,
            to: email,
            subject: 'Update on your Hirix Registration',
            html: CompanyRegisterRejectionEmailTemplate(companyName, reason, link)
        })
    }

    async sendCompanyVerificationEmail(email: string, companyName: string, verificationLink: string): Promise<void> {
        await mailTransporter.sendMail({
            from: `"Hirix <${env.HIRIX_EMAIL}>`,
            to: email,
            subject: 'Email Verification - Hirix Login',
            html: CompanyVerificationLinkTemplate(companyName, verificationLink)
        })
    }

    async sendAccountDeletionEmail(email: string, companyName: string): Promise<void> {
        await mailTransporter.sendMail({
            from: `"Hirix" <${env.HIRIX_EMAIL}>`,
            to: email,
            subject: 'Your Account is Scheduled for deletion',
            html: accountDeletionEmailTemplate(companyName)
        })
    }
    async sendAccountRestoreEmail(email: string, companyName: string, restoreLink: string): Promise<void> {
        await mailTransporter.sendMail({
            from: `"Hirix" <${env.HIRIX_EMAIL}>`,
            to: email,
            subject: 'Your Account is Scheduled for deletion',
            html: companyRestoreAccountTemplate(companyName, restoreLink)
        })
    }
    async sendSubscriptionReminder(email: string, name: string, planName: string, endDate: string): Promise<void> {
        await mailTransporter.sendMail({
            from: `"Hirix" <${env.HIRIX_EMAIL}>`,
            to: email,
            subject: 'Important: Your Hirix subscription expires in 3 days',
            html: subscriptionReminderTemplate(name, planName, endDate)
        })
    }
}

