export interface IMailService {
    sentOtp(email: string, otp: string): Promise<void>
}