import { Types } from "mongoose";
import { SubscriptionEntity } from "../../Domain/entities/Subscription.entity";
import { ISubscription } from "../../Infrastructure/database/Model/Subscription";

export class SubscriptionMapper{
    static toEntity(doc: ISubscription): SubscriptionEntity {
        const subscription = new SubscriptionEntity(
            doc._id.toString(),
            doc.ownerType,
            doc.ownerId.toString(),
            doc.planId.toString(),
            doc.startDate,
            doc.endDate,
            doc.status,
            doc.isCurrent,
            doc.paymentId
        )

        return subscription
    }

    static toDocument(entity: SubscriptionEntity){
        return {
            ownerType: entity.ownerType,
            ownerId: new Types.ObjectId(entity.ownerId),
            planId: new Types.ObjectId(entity.planId),
            startDate: entity.startDate,
            endDate: entity.endDate,
            status: entity.status,
            isCurrent: entity.isCurrent,
            paymentId: entity.paymentId
        }
    }
}