import cron from 'node-cron'
import { ISendExpireSubscriptionReminderUsecase } from '../../Application/common/interfaces/ISendExpireReminder.usecase'
import { IMarkExpiredUsecase } from '../../Application/common/interfaces/IMarkExpired.usecase'
import { ISendTrialEndReminderUsecase } from '../../Application/common/interfaces/ISendTrialEndReminder.usecase'
import { logger } from '../../utils/logging/loger'


export const SubscriptionCron = (
    sendReminder: ISendExpireSubscriptionReminderUsecase,
    markExpired: IMarkExpiredUsecase,
    sendTrialEndReminder: ISendTrialEndReminderUsecase
) => {
    cron.schedule("15 * * * *", async () => {
      try {
         logger.info("Running reminder job") 
         await sendReminder.execute()
      } catch (error) {
        logger.error(error, "Failed sending reminder")
      }
    })

    cron.schedule('15 * * * *', async () => {
      try {
         logger.info("Running mark expired job") 
         await markExpired.execute()
      } catch (error) {
        logger.error(error, "Failed sending reminder")
      }
    })

    cron.schedule("15 * * * *", async () => {
      try {
         logger.info("Running trial end reminder job") 
         await sendTrialEndReminder.execute()
      } catch (error) {
        logger.error(error, "Failed sending reminder")
      }
    })
}