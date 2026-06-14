import mongoose from 'mongoose';
import {env} from './env'
import { logger } from '../../utils/logging/loger';

export const connectDB = async () => {
    try {      
        await mongoose.connect(env.MONGO_URI )
        logger.info('Database connected')
    } catch (error) {
        logger.error({Error: error}, 'Database connection failed')
        process.exit(1)
    }
}

//mongodb+srv://safvana277_db_user:hirixbcr752025@hirixcluster.azh5b06.mongodb.net/?appName=HirixCluster