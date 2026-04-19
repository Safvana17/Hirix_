import cron from 'node-cron'
import { ISendExpireSubscriptionReminderUsecase } from '../../Application/common/interfaces/ISendExpireReminder.usecase'
import { IMarkExpiredUsecase } from '../../Application/common/interfaces/IMarkExpired.usecase'




export const subscriptionExpireReminder = (
    sendReminder: ISendExpireSubscriptionReminderUsecase,
    markExpired: IMarkExpiredUsecase
) => {
    cron.schedule("0 9 * * *", async () => {
       await sendReminder.execute()
    })

    cron.schedule('0 0 * * *', async () => {
        await markExpired.execute()
    })
}