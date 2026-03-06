import { IHashService } from "../../Application/interface/service/IHashService";
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { env } from "../config/env";

export class HashService implements IHashService{
    async hash(password: string): Promise<string> {
        const saltRounds = env.BCRYPT_sALT_ROUNDS
        return await bcrypt.hash(password, saltRounds)
    }

    async compare(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword)
    }

    hashToken(token: string):string {
        return crypto.createHash('sha256').update(token).digest("hex")
    }
}