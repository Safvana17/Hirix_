import { QueryFilter } from "mongoose";
import { NotificationRuleMapper } from "../../Application/Mappers/mapper.notificationRule";
import { NotificationRuleEntity } from "../../Domain/entities/notificationRule.entity";
import { INotificationRuleRepository } from "../../Domain/repositoryInterface/iNotificationRule.repository";
import { INotificationRule, NotificationRuleModel } from "../database/Model/NotificationRule";
import { BaseRepository } from "./base.repository";
import { NotificationChannel } from "../../Domain/enums/notification";

export class NotificationRuleRepository extends BaseRepository<NotificationRuleEntity, INotificationRule> implements INotificationRuleRepository {
    constructor(){
        super(NotificationRuleModel)
    }

    async findByEvent(event: string): Promise<NotificationRuleEntity[]> {
        const documents = await this._model.find({event, isActive: true})
        return documents.map(d => this.mapToEntity(d))
    }   

    async findAllFiltered(query: {search?: string, channel?: NotificationChannel, page: number; limit: number; }): Promise<{ data: NotificationRuleEntity[]; totalPages: number; totalCount: number; }> {
        const filter: QueryFilter<INotificationRule> = {
            isDeleted: false
        }
        if(query.search){
            filter.$or = [
                {event: { $regex: query.search, $options: "i"}},
                {templateKey: { $regex: query.search, $options: "i"}}
            ]
        }
        if(query.channel){
            filter.channel = query.channel
        }

        const skip = (query.page - 1) * (query.limit)
        const totalCount = await this._model.countDocuments(filter)
        const totalPages = Math.ceil(totalCount/query.limit)

        const documents = await this._model.find(filter)
                .sort({createdAt: -1})
                .skip(skip)
                .limit(query.limit)

        return {
            data: documents.map(d => this.mapToEntity(d)),
            totalCount,
            totalPages
        }

    }
    protected mapToEntity(doc: INotificationRule): NotificationRuleEntity {
        return NotificationRuleMapper.toEntity(doc)
    }
    protected mapToPersistance(entity: NotificationRuleEntity): Partial<INotificationRule> {
        return NotificationRuleMapper.toDocument(entity)
    }

}