import winston from "winston";
import 'winston-daily-rotate-file'

const isProduction = process.env.NODE_ENV === 'production'
const transport = new winston.transports.DailyRotateFile({
    filename: 'logs/app-%DATE%-log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d'
})

export const logger = winston.createLogger({
    level: isProduction ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        transport,
        ...(isProduction ? [] : [new winston.transports.Console()])
    ]
})