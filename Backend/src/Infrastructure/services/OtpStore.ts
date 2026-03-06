import Redis from 'ioredis'
import { IOtpStore } from '../../Application/interface/service/IOtpStore'

export class OtpRepository implements IOtpStore{
    constructor(private redis: Redis) {}

    async saveOtp(key: string, otp: string, ttlSeconds: number): Promise<void> {
        await this.redis.set(key, otp,"EX", ttlSeconds)
    }

    async getOtp(key: string): Promise<string | null> {
        return await this.redis.get(key)
    }

    async deleteOtp(key: string): Promise<void> {
        await this.redis.del(key)
    }
}