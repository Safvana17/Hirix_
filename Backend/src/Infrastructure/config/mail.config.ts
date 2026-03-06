import nodemailer from 'nodemailer'
import { env } from './env'


export const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    port: env.NODEMAILER_PORT,
    secure: false,
    auth: {
        user: env.NODEMAILER_EMAIL,
        pass: env.NODEMAILER_PASSWORD
    } 
})