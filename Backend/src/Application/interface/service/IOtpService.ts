export interface IOtpService {
    generate(): string;
    hash(otp: string): Promise<string>;
    compare(EnteredOtp: string, hashedOtp: string) : Promise<boolean>;
}