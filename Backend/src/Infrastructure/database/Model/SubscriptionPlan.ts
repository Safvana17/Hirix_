import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { BillingCycle, TargetType } from "../../../Domain/enums/subscription";


export interface ISubscriptionPlan extends Document {
    _id: Types.ObjectId;
    planName: string;
    price: number;
    target: TargetType;
    billingCycle: BillingCycle;
    durationDays: number;
    canCreateCustomQuestions: boolean;
    canUseAdminQuestions: boolean;
    maxTestsPerMonth: number | null;
    maxCandidates: number | null;
    maxInterviewsPerMonth: number | null;
    maxJobRolesPerMonth: number | null;
    canAccessPremiumQuestions: boolean;
    maxPracticePerDay: number | null
    hasDetailedFeedback: boolean
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
        default: TargetType.ALL
    },
    billingCycle: {
        type: String,
        default: BillingCycle.MONTHLY
    },
    durationDays: {
        type: Number
    },
    canCreateCustomQuestions: {
        type: Boolean
    },
    canUseAdminQuestions: {
        TYPE: Boolean
    },
    maxTestsPerMonth: {
        type: Number,
        default: null
    },
    maxCandidates: {
        type: Number,
        default: null
    },
    maxInterviewsPerMonth: {
        type: Number,
        default: null
    },
    maxJobRolesPerMonth: {
        type: Number,
        default: null
    },
    canAccessPremiumQuestions: {
        type: Boolean
    },
    maxPracticePerDay: {
        type: Number,
        default: null
    },
    hasDetailedFeedback: {
        type: Boolean
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