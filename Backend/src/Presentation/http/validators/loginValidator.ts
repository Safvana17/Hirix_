import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, 'Email is required')
        .email('Invalid email'),
    password: z
         .string()
         .trim()
        .min(6, 'Password must contain atleast 6 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@$%*&?])[a-zA-Z\d!@$%*&?]{6,}$/)
})
export const googleLoginSchema = z.object({
    token: z
        .string()
        .trim()
        .min(1, 'Token is missing')
})

export const refreshTokenSchema = z.object({
    token: z
       .string()
       .trim()
       .min(1, 'Refresh token is missing')
})