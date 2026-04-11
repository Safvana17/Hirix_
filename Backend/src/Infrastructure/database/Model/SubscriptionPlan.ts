import mongoose, { Document, Model, Schema, Types } from "mongoose";
import targetType from "../../../Domain/enums/subscription";

export interface ISubscriptionPlan extends Document {
    _id: Types.ObjectId;
    planName: string;
    price: number;
    target: targetType;
    billingCycle: string;
    durationDays: number;
    maxTestsPerMonth: number;
    maxCandidates: number;
    features: string[];
    isActive: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date
}

const subscriptionPlanSchema: Schema<ISubscriptionPlan> = new Schema ({
    planName: {
        type: String
    },
    price: {
        type: Number,
        default: 0
    },
    target: {
        type: String,
        default: targetType.ALL
    },
    billingCycle: {
        type: String
    },
    durationDays: {
        type: Number
    },
    maxTestsPerMonth: {
        type: Number,
    },
    maxCandidates: {
        type: Number
    },
    features: {
        type: [String]
    },
    isActive: {
        type: Boolean
    },
    isDeleted: {
        type: Boolean
    }
}, {
    timestamps: true
})

export const SubscriptionPlanModel: Model<ISubscriptionPlan> = mongoose.model('SubscriptionPlan', subscriptionPlanSchema)