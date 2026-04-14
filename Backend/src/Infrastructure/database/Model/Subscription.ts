import mongoose, { Types, Document, Schema, Model } from "mongoose";
import { TargetType } from "../../../Domain/enums/subscription";
import { ref } from "node:process";

export interface ISubscription extends Document {
    id: Types.ObjectId
    ownerType: TargetType
    ownerId: Types.ObjectId
    planId: Types.ObjectId
    startDate: Date
    enddate: Date
    isActive: boolean
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
    enddate: {
        type: Date
    },
    isActive: {
        type: Boolean
    },
    paymentId: {
        type: String
    }
}, {
    timestamps: true
})

export const SubscriptionModel: Model<ISubscription> = mongoose.model('Subscription', SubscriptionSchema)