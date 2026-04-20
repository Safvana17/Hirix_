import { NotificationRuleEntity } from "../entities/notificationRule.entity";
import { IBaseRepository } from "./iBase.repository";

export interface INotificationRuleRepository extends IBaseRepository<NotificationRuleEntity> {
    findByEvent(event: string): Promise<NotificationRuleEntity[]>
}