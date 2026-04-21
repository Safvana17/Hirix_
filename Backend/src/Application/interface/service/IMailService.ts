// export interface IMailService {
//     sentOtp(email: string, otp: string): Promise<void>
//     sendApprovalEmail(email: string, companyName: string): Promise<void>
//     sendRejectionEmail(email: string, companyName: string, reason: string, link: string): Promise<void>
//     sendCompanyVerificationEmail(email: string, companyName: string, verificationLink: string): Promise<void>
//     sendAccountDeletionEmail(email: string, companyName: string): Promise<void>
//     sendAccountRestoreEmail(email: string, companyName: string, restoreLink: string): Promise<void>
//     sendSubscriptionReminder(email: string, name: string, planName: string, endDate: string): Promise<void>
// }

export interface SendMailDTO {
  to: string
  subject: string
  html: string
}

export interface IMailService {
  send(dto: SendMailDTO): Promise<void>
}