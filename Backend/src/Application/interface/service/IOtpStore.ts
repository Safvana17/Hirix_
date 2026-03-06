export interface IOtpStore {
    saveOtp(userId: string, hashedOtp: string, ttlSeconds: number): Promise<void>
    getOtp(userId: string): Promise<string | null >
    deleteOtp(userId: string): Promise<void>
}