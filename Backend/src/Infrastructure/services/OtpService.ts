import { IOtpService } from "../../Application/interface/service/IOtpService";
import bcrypt from 'bcrypt'
import { logger } from "../../utils/logging/loger";
import { env } from "../config/env";

export class OtpService implements IOtpService{
    generate(): string {
        const otp = Math.floor(100000 + Math.random() * 900000)
        logger.info({OTP: otp}, 'Your OTP')
        return otp.toString()
    }

    async hash(otp: string): Promise<string> {
        const saltRounds = env.BCRYPT_sALT_ROUNDS
        return await bcrypt.hash(otp, saltRounds)
    }

    async compare(EnteredOtp: string, hashedOtp: string): Promise<boolean>{
        return await bcrypt.compare(EnteredOtp, hashedOtp)
    }
}