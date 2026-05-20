import dotenv from 'dotenv';
dotenv.config();
import { env } from '../Infrastructure/config/env';
import { logger } from '../utils/logging/loger';
import app from './app';
import { SubscriptionCron } from '../Infrastructure/cron/subscription.cron'
import { markSubscriptionExpired, sendSubscriptionEndReminder, sendTrialEndReminder } from './http/controllers/factory'


const PORT = env.PORT || 4000;

    SubscriptionCron(
        sendSubscriptionEndReminder,
        markSubscriptionExpired,
        sendTrialEndReminder
    )

app.listen(PORT, () => {
    logger.info({port: PORT}, 'Server connected.')  
})