import { IMailService } from "../../Application/interface/service/IMailService";
import { otpEmailTemplate } from "../emailTemplates/OtpTemplate";
import { mailTransporter } from "../config/mail.config";
import { env } from "../config/env";
import { CompanyRegisterApprovalEmailTemplate } from "../emailTemplates/CompanyRegisterApprovalTemplate";
import { CompanyRegisterRejectionEmailTemplate } from "../emailTemplates/CompanyRegisterRejectionTemplate";
import { CompanyVerificationLinkTemplate } from "../emailTemplates/CompanyVerificationTemplate";

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

    async sendRejectionEmail(email: string, companyName: string, reason: string): Promise<void> {
        await mailTransporter.sendMail({
            from: `"Hirix <${env.HIRIX_EMAIL}>`,
            to: email,
            subject: 'Update on your Hirix Registration',
            html: CompanyRegisterRejectionEmailTemplate(companyName, reason)
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
}

