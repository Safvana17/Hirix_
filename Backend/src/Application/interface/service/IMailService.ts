export interface IMailService {
    sentOtp(email: string, otp: string): Promise<void>
    sendApprovalEmail(email: string, companyName: string): Promise<void>
    sendRejectionEmail(email: string, companyName: string, reason: string): Promise<void>
    sendCompanyVerificationEmail(email: string, companyName: string, verificationLink: string): Promise<void>
    sendAccountDeletionEmail(email: string, companyName: string): Promise<void>
}