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

    async findExpiringSoon(expiringDate: Date): Promise<SubscriptionEntity[] | null> {
        const documents = await this._model.find({
            endDate: {
                $gte: new Date(expiringDate.setHours(0, 0, 0)),
                $lte: new Date(expiringDate.setHours(23, 59, 59))
            },
            status: 'active'
        })

        if(!documents) return null
        return documents.map(d => this.mapToEntity(d))
    }

    async findExpiredActive(): Promise<SubscriptionEntity[] | null> {
        const now = new Date()
        const documents = await this._model.find({
            endDate: {
                $lte: now
            },
            status: 'active'
        })

        if(!documents) return null
        return documents.map(d => this.mapToEntity(d))
    }

    protected mapToEntity(doc: ISubscription): SubscriptionEntity {
        return SubscriptionMapper.toEntity(doc)
    }

    protected mapToPersistance(entity: SubscriptionEntity): Partial<ISubscription> {
        return SubscriptionMapper.toDocument(entity)
    }
}