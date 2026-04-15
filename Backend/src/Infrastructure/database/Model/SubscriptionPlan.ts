import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { BillingCycle, TargetType } from "../../../Domain/enums/subscription";


export interface ISubscriptionPlan extends Document {
    _id: Types.ObjectId;
    planName: string;
    price: number;
    target: TargetType;
    billingCycle: BillingCycle;
    durationDays: number | null;
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
        default: TargetType.COMPANY
    },
    billingCycle: {
        type: String,
        default: BillingCycle.MONTHLY
    },
    durationDays: {
        type: Number,
        default: null
    },
    canCreateCustomQuestions: {
        type: Boolean
    },
    canUseAdminQuestions: {
        type: Boolean
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