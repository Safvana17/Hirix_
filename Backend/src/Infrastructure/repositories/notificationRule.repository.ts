import { NotificationRuleMapper } from "../../Application/Mappers/mapper.notificationRule";
import { NotificationRuleEntity } from "../../Domain/entities/notificationRule.entity";
import { INotificationRuleRepository } from "../../Domain/repositoryInterface/iNotificationRule.repository";
import { INotificationRule, NotificationRuleModel } from "../database/Model/NotificationRule";
import { BaseRepository } from "./base.repository";

export class NotificationRuleRepository extends BaseRepository<NotificationRuleEntity, INotificationRule> implements INotificationRuleRepository {
    constructor(){
        super(NotificationRuleModel)
    }

    async findByEvent(event: string): Promise<NotificationRuleEntity[]> {
        const documents = await this._model.find({event, isActive: true})
        return documents.map(d => this.mapToEntity(d))
    }   
    protected mapToEntity(doc: INotificationRule): NotificationRuleEntity {
        return NotificationRuleMapper.toEntity(doc)
    }
    protected mapToPersistance(entity: NotificationRuleEntity): Partial<INotificationRule> {
        return NotificationRuleMapper.toDocument(entity)
    }

}