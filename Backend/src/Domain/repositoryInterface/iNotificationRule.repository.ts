import { NotificationRuleEntity } from "../entities/notificationRule.entity";
import { NotificationChannel } from "../enums/notification";
import { IBaseRepository } from "./iBase.repository";

export interface INotificationRuleRepository extends IBaseRepository<NotificationRuleEntity> {
    findByEvent(event: string): Promise<NotificationRuleEntity[]>
    findAllFiltered(query: {search?: string, channel? :NotificationChannel, page: number, limit: number}): Promise<{data: NotificationRuleEntity[], totalPages: number, totalCount: number}>
}