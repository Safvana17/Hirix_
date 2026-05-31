import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import { env } from '../Infrastructure/config/env';
import { logger } from '../utils/logging/loger';
import app from './app';
import { SubscriptionCron } from '../Infrastructure/cron/subscription.cron'
import { markSubscriptionExpired, sendSubscriptionEndReminder, sendTrialEndReminder } from './http/controllers/factory'
import { initializeSocket } from '../Infrastructure/socket/socketServer';


const PORT = env.PORT || 4000;

SubscriptionCron(
    sendSubscriptionEndReminder,
    markSubscriptionExpired,
    sendTrialEndReminder
)

const server = http.createServer(app)

initializeSocket(server)

server.listen(PORT, () => {
    logger.info({port: PORT}, 'Server connected.')  
})