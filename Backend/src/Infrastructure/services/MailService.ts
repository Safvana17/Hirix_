// import { IMailService } from "../../Application/interface/service/IMailService";
// import { otpEmailTemplate } from "../emailTemplates/OtpTemplate";
// import { mailTransporter } from "../config/mail.config";
// import { env } from "../config/env";
// import { CompanyRegisterApprovalEmailTemplate } from "../emailTemplates/CompanyRegisterApprovalTemplate";
// import { CompanyRegisterRejectionEmailTemplate } from "../emailTemplates/CompanyRegisterRejectionTemplate";
// import { CompanyVerificationLinkTemplate } from "../emailTemplates/CompanyVerificationTemplate";
// import { accountDeletionEmailTemplate } from "../emailTemplates/AccountDeleteionTemplate";
// import { companyRestoreAccountTemplate } from "../emailTemplates/RestoreAccountEmailTemplate";
// import { subscriptionReminderTemplate } from "../emailTemplates/SubscriptionReminderTemplate";
// import { logger } from "../../utils/logging/loger";

import { BuildEmailLayoutInput, IMailService, SendMailDTO } from "../../Application/interface/service/IMailService";
import { env } from "../config/env";
import { mailTransporter } from "../config/mail.config";

// export class MailService implements IMailService{
//     async sentOtp(email: string, otp: string): Promise<void> {
//        console.log('from mail service')
//         await mailTransporter.sendMail({
//             from: `"Hirix" <${env.HIRIX_EMAIL}>`,
//             to: email,
//             subject: 'Your OTP Code',
//             html: otpEmailTemplate(otp)
//         })
//     }

//     async sendApprovalEmail(email: string, companyName: string): Promise<void> {
//         await mailTransporter.sendMail({
//             from: `"Hirix <${env.HIRIX_EMAIL}>`,
//             to: email,
//             subject: 'Congratulations! Your Hirix account is approved',
//             html: CompanyRegisterApprovalEmailTemplate(companyName)
//         })
//     }

//     async sendRejectionEmail(email: string, companyName: string, reason: string, link: string): Promise<void> {
//         await mailTransporter.sendMail({
//             from: `"Hirix <${env.HIRIX_EMAIL}>`,
//             to: email,
//             subject: 'Update on your Hirix Registration',
//             html: CompanyRegisterRejectionEmailTemplate(companyName, reason, link)
//         })
//     }

//     async sendCompanyVerificationEmail(email: string, companyName: string, verificationLink: string): Promise<void> {
//         await mailTransporter.sendMail({
//             from: `"Hirix <${env.HIRIX_EMAIL}>`,
//             to: email,
//             subject: 'Email Verification - Hirix Login',
//             html: CompanyVerificationLinkTemplate(companyName, verificationLink)
//         })
//     }

//     async sendAccountDeletionEmail(email: string, companyName: string): Promise<void> {
//         await mailTransporter.sendMail({
//             from: `"Hirix" <${env.HIRIX_EMAIL}>`,
//             to: email,
//             subject: 'Your Account is Scheduled for deletion',
//             html: accountDeletionEmailTemplate(companyName)
//         })
//     }
//     async sendAccountRestoreEmail(email: string, companyName: string, restoreLink: string): Promise<void> {
//         await mailTransporter.sendMail({
//             from: `"Hirix" <${env.HIRIX_EMAIL}>`,
//             to: email,
//             subject: 'Your Account is Scheduled for deletion',
//             html: companyRestoreAccountTemplate(companyName, restoreLink)
//         })
//     }
//     async sendSubscriptionReminder(email: string, name: string, planName: string, endDate: string): Promise<void> {
//         await mailTransporter.sendMail({
//             from: `"Hirix" <${env.HIRIX_EMAIL}>`,
//             to: email,
//             subject: 'Important: Your Hirix subscription expires in 3 days',
//             html: subscriptionReminderTemplate(name, planName, endDate)
//         })
//         logger.info('mail sent')
//     }
// }


export class MailService implements IMailService {
    async send(dto: SendMailDTO): Promise<void> {
        await mailTransporter.sendMail({
            from: `"Hirix" <${env.HIRIX_EMAIL}>`,
            to: dto.to,
            subject: dto.subject,
            html: dto.html
        })
    }
 build(input: BuildEmailLayoutInput): string {
    const otpSection = input.showOtpBox && input.otpCode
        ? `<div style="text-align:center; margin: 30px 0 20px 0;">
            ${ input.otpLabel ? `<p style="margin: 0 0 10px 0; font-size: 14px; color: #4b5563;">${input.otpLabel}</p>` : ''}
            <span style="display:inline-block; font-size:32px; font-weight:bold; letter-spacing:8px; padding:12px 24px; background:#f3f4f6; border-radius:8px; border:1px dashed #9ca3af; color:#111827;">
              ${input.otpCode}
            </span>
          </div>
            ${ input.expiryText ? `<p style="font-size:14px; color:#6b7280; text-align:center; margin: 0 0 20px 0;">${input.expiryText}</p>` : '' }` 
        : '';
    const ctaSection = input.ctaText && input.ctaUrl
        ? `<div style="text-align:center; margin: 24px 0;">
            <a
              href="${input.ctaUrl}"
              style="display:inline-block; padding:12px 22px; background:#2563eb; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:600; font-size:14px;"
            >
              ${input.ctaText}
            </a>
          </div>`
        : '';
    const footerTextSection = input.footerText
        ? `<p style="font-size:14px; color:#6b7280; margin: 24px 0 0 0;">${input.footerText}</p>` : '';
    const supportSection = input.supportEmail
        ? ` <p style="font-size:14px; color:#4b5563; margin: 24px 0 0 0;">
              ${input.supportText ?? 'Need help? Contact us at'}
              <a href="mailto:${input.supportEmail}" style="color:#2563eb; text-decoration:none; margin-left:4px;">
                ${input.supportEmail}
              </a>
            </p>`
        : '';
    return `
        <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 30px 16px;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e5e7eb;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <h2 style="margin: 0; font-size: 24px; color: #111827;">${input.title}</h2>
                </div>
                <div style="font-size: 15px; color: #374151; line-height: 1.8;">
                    ${input.body}
                </div> 
                ${otpSection}
                ${ctaSection}
                ${footerTextSection}
                ${supportSection}
                <div style="margin-top: 28px; padding-top: 18px; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; font-size: 14px; color: #6b7280;">
                        Thanks,<br />
                        The ${input.platformName} Team
                    </p>
                </div>
            </div>
        </div>`
    }
}
