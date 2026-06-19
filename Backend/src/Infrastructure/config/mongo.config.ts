import mongoose from 'mongoose';
import {env} from './env'
import { logger } from '../../utils/logging/loger';

export const connectDB = async () => {
    try {      
        await mongoose.connect(env.MONGO_URI )
        logger.info('Database connected')
    } catch (error) {
        logger.error({Error: error}, 'Database connection failed')
        console.log(" database connection failed", error)
        process.exit(1)
    }
}
