import { QueryFilter } from "mongoose";
import { SubscriptionMapper } from "../../Application/Mappers/mapper.subscription";
import { SubscriptionEntity } from "../../Domain/entities/Subscription.entity";
import { subscriptionStatus, TargetType } from "../../Domain/enums/subscription";
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
            status: subscriptionStatus.ACTIVE,
            isTrial: false
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
            status: subscriptionStatus.ACTIVE
        })

        if(!documents) return null
        return documents.map(d => this.mapToEntity(d))
    }

    async findTrialByUserAndPlan(userId: string, planId: string): Promise<SubscriptionEntity | null> {
        const document = await this._model.findOne({
            ownerId: userId,
            planId,
            isTrial: true
        })
        if(!document) return null
        return this.mapToEntity(document)

    }

    async findTrialEndSoon(expiringDate: Date): Promise<SubscriptionEntity[] | null> {
        const documents = await this._model.find({
            endDate: {
                $gt: expiringDate.setHours(0, 0, 0),
                $lt: expiringDate.setHours(23, 59, 59)
            },
            status: subscriptionStatus.ACTIVE,
            isTrial: true
        })
        if(!documents) return null
        return documents.map(d => this.mapToEntity(d))
    }

    async getActiveSubscribers(): Promise<number> {
        return this._model.countDocuments({status: subscriptionStatus.ACTIVE})
    }

    async getTotalSubscribers(): Promise<number> {
        return await this._model.countDocuments()
    }

    async getSubscriptionDistribution(type?: TargetType): Promise<{ plan: string; type: TargetType; count: number; }[]> {
        const filter: QueryFilter<ISubscription> = {
            status: { $ne: subscriptionStatus.PENDING}
        }
        if(type){
            filter.ownerType = type
        }
        return this._model.aggregate([
            {
                $match: filter
            }, 
            {
                $group: {
                    _id: {
                        plan: "$planId",
                        type: "$ownerType"
                    },
                    count: { $sum: 1}
                }
            },
            {
                $lookup: {
                    from: "subscriptionplans",
                    localField: "_id.plan",
                    foreignField: "_id",
                    as: 'plan'
                }
            },
            {
                $unwind: "$plan"
            },
            {
                $project: {
                    _id: 0,
                    plan: "$plan.planName",
                    type: "$_id.type",
                    count: 1
                }
            }
        ])
    }

    protected mapToEntity(doc: ISubscription): SubscriptionEntity {
        return SubscriptionMapper.toEntity(doc)
    }

    protected mapToPersistance(entity: SubscriptionEntity): Partial<ISubscription> {
        return SubscriptionMapper.toDocument(entity)
    }
}