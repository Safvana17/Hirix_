import mongoose from 'mongoose';
import {env} from './env'
import { logger } from '../../utils/logging/loger';

export const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGO_URI)
        logger.info('Database connected')
    } catch (error) {
        logger.error('Failed to connect to database', error)
        process.exit(1)
    }
}