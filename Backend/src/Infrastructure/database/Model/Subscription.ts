import mongoose, { Types, Document, Schema, Model } from "mongoose";
import { subscriptionStatus, TargetType } from "../../../Domain/enums/subscription";

export interface ISubscription extends Document {
    id: Types.ObjectId
    ownerType: TargetType
    ownerId: Types.ObjectId
    planId: Types.ObjectId
    startDate: Date
    endDate: Date | null
    status: subscriptionStatus
    isCurrent: boolean
    paymentId: string
    createdAt: Date
    updatedAt: Date
}

const SubscriptionSchema: Schema<ISubscription> = new Schema ({
    ownerType: {
        type: String,
    },
    ownerId: {
        type: Types.ObjectId
    },
    planId: {
        type: Types.ObjectId,
        ref: 'SubscriptionPlan'
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date,
        default: null
    },
    status: {
        type: String
    },
    isCurrent: {
        type: Boolean
    },
    paymentId: {
        type: String
    }
}, {
    timestamps: true
})

export const SubscriptionModel: Model<ISubscription> = mongoose.model('Subscription', SubscriptionSchema)