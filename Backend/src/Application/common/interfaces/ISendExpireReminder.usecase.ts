export interface ISendExpireSubscriptionReminderUsecase {
    execute(): Promise<void>
}