import dotenv from 'dotenv'
import { envSchema } from './env.validation'
import { logger } from '../../utils/logging/loger'
import { authMessages } from '../../Shared/constsnts/messages/authMessages'


dotenv.config()

const parsedEnv = envSchema.safeParse(process.env)

if(!parsedEnv.success){
    logger.error({error: parsedEnv.error.format()},authMessages.error.ENV_VALIDATION_FAILED)
    process.exit(1)
}


export const env = parsedEnv.data


// export const env = {
//     PORT: Number(process.env.PORT),
//     MONGO_URI: String(process.env.MONGODB_URI),
//     JWT_REFRESH_SECRET: String(process.env.JWT_REFRESH_SECRET),
//     JWT_ACCESS_SECRET: String(process.env.JWT_ACCESS_SECRET),
//     REDIS_URL: process.env.REDIS_URL as string,
//     NODEMAILER_USER: process.env.NODEMAILER_EMAIL,
//     NODEMAILER_PASS: process.env.NODEMAILER_PASSWORD,
//     HIRIX_EMAIL: process.env.HIRIX_EMAIL,
//     GOOGLE_ID: process.env.GOOGLE_CLIENT_ID,
//     REFRESH_TOKEN_MAX_AGE: Number(process.env.REFRESH_TOKEN_MAX_AGE),
//     ACCESS_TOKEN_MAX_AGE: Number(process.env.ACCESS_TOKEN_MAX_AGE)
// }