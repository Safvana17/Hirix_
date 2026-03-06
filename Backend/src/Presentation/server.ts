import { env } from '../Infrastructure/config/env';
import { logger } from '../utils/logging/loger';
import app from './app';
import dotenv from 'dotenv';

dotenv.config();
const PORT = env.PORT || 4000;


app.listen(PORT, () => {
    logger.info(`Server is started at port ${PORT}`)
})