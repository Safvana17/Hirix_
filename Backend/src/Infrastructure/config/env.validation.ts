import z from "zod";

export const envSchema = z.object({
    PORT: z.coerce.number().positive(),
    MONGO_URI: z.string().min(1),
    JWT_REFRESH_SECRET: z.string().min(32),
    JWT_ACCESS_SECRET: z.string().min(32),
    RESET_TOKEN_SECRET:z.string().min(32),
    RESTORE_ACCOUNT_SECRET:z.string().min(32),
    REDIS_URL: z.string(),
    NODEMAILER_EMAIL: z.string(),
    NODEMAILER_PASSWORD: z.string(),
    REFRESH_TOKEN_MAX_AGE: z.coerce.number(),
    ACCESS_TOKEN_MAX_AGE: z.coerce.number(),
    HIRIX_EMAIL: z.string().email().min(1),
    GOOGLE_CLIENT_ID: z.string(),
    REFRESH_TOKEN_TTL: z.coerce.number(),
    ACCESS_TOKEN_TTL: z.coerce.number(),
    RESTORE_ACCOUNT_TTL:z.coerce.number(),
    RESET_TOKEN_TTL:z.coerce.number(),
    NODEMAILER_PORT: z.coerce.number(),
    BCRYPT_sALT_ROUNDS: z.coerce.number().int().min(8).max(15),
    FRONTEND_URL:z.string().min(1),
    RAZORPAY_API_KEY:z.string().min(1),
    RAZORPAY_API_SECRET: z.string().min(1)
})