export interface ICronService {
    sendReminder(): Promise<void>
    markExpired(): Promise<void>
}