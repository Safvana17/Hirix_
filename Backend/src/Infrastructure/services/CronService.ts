import { IMarkExpiredUsecase } from "../../Application/common/interfaces/IMarkExpired.usecase";
import { ISendExpireSubscriptionReminderUsecase } from "../../Application/common/interfaces/ISendExpireReminder.usecase";
import { ISendTrialEndReminderUsecase } from "../../Application/common/interfaces/ISendTrialEndReminder.usecase";
import { ICronService } from "../../Application/interface/service/ICronService";

export class CronService implements ICronService {
  constructor(
    private _reminderUseCase: ISendExpireSubscriptionReminderUsecase,
    private _expireUseCase: IMarkExpiredUsecase,
    private _triaEndReminder: ISendTrialEndReminderUsecase,
  ) {}

  async sendReminder(): Promise<void> {
    await this._reminderUseCase.execute();
  }

  async markExpired(): Promise<void> {
    await this._expireUseCase.execute();
  }

  async sendTrialEndReminder(): Promise<void> {
    await this._triaEndReminder.execute()
  }
}