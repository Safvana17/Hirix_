import { IOtpService } from "../../Application/interface/service/IOtpService";
import bcrypt from 'bcrypt'
import { logger } from "../../utils/logging/loger";
import { env } from "../config/env";

export class OtpService implements IOtpService{
    generate(): string {
        console.log('from otp service')
        const otp = Math.floor(100000 + Math.random() * 900000)
        console.log('your otp code is: ', otp)
        logger.info(`your otp is: ${otp}`)
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