import { SubscriptionMapper } from "../../Application/Mappers/mapper.subscription";
import { SubscriptionEntity } from "../../Domain/entities/Subscription.entity";
import { ISubscriptionRepository } from "../../Domain/repositoryInterface/iSubscription.repository";
import { logger } from "../../utils/logging/loger";
import { ISubscription, SubscriptionModel } from "../database/Model/Subscription";
import { BaseRepository } from "./base.repository";

export class SubscriptionRepository extends BaseRepository<SubscriptionEntity, ISubscription> implements ISubscriptionRepository {
    constructor (){
        super(SubscriptionModel)
    }

    async findCurrentByUserId(userId: string): Promise<SubscriptionEntity | null> {
        logger.info(userId)
        const document = await this._model.findOne({
            ownerId: userId,
            isCurrent: true
        })
        if(!document) return null
        return this.mapToEntity(document)
    }

    protected mapToEntity(doc: ISubscription): SubscriptionEntity {
        return SubscriptionMapper.toEntity(doc)
    }

    protected mapToPersistance(entity: SubscriptionEntity): Partial<ISubscription> {
        return SubscriptionMapper.toDocument(entity)
    }
}