import { IMailService } from "../../Application/interface/service/IMailService";
import { otpEmailTemplate } from "../emailTemplates/OtpTemplate";
import { mailTransporter } from "../config/mail.config";
import { env } from "../config/env";

export class MailService implements IMailService{
    async sentOtp(email: string, otp: string): Promise<void> {
       
        await mailTransporter.sendMail({
            from: `"Hirix" <${env.HIRIX_EMAIL}>`,
            to: email,
            subject: 'Your OTP Code',
            html: otpEmailTemplate(otp)
        })
    }
}