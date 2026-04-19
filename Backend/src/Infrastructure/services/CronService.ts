import { IMarkExpiredUsecase } from "../../Application/common/interfaces/IMarkExpired.usecase";
import { ISendExpireSubscriptionReminderUsecase } from "../../Application/common/interfaces/ISendExpireReminder.usecase";
import { ICronService } from "../../Application/interface/service/ICronService";

export class CronService implements ICronService {
  constructor(
    private reminderUseCase: ISendExpireSubscriptionReminderUsecase,
    private expireUseCase: IMarkExpiredUsecase
  ) {}

  async sendReminder(): Promise<void> {
    await this.reminderUseCase.execute();
  }

  async markExpired(): Promise<void> {
    await this.expireUseCase.execute();
  }
}