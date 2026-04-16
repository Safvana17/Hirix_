import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { TargetType } from "../../../Domain/enums/subscription";
import { PaymentStatus } from "../../../Domain/enums/payment";

export interface IPayment extends Document {
    id: Types.ObjectId;
    subscriptionId: Types.ObjectId;
    ownerType: TargetType;
    ownerId: Types.ObjectId;
    planId: Types.ObjectId;
    amount: number;
    currency: string;
    status: PaymentStatus;
    orderId: string;
    paymentId: string;
    signature: string;
    description: string;
    invoiceUrl: string;
    failureReason: string;
    paymentDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const paymentSchema: Schema<IPayment> = new Schema({
    subscriptionId: {
        type: Types.ObjectId,
        ref: 'Subscription'
    },
    ownerType: {
        type: String
    },
    ownerId: {
        type: Types.ObjectId,
    },
    planId: {
        type: Types.ObjectId,
        ref: 'SubscriptionPlan'
    },
    amount: {
        type: Number
    },
    currency: {
        type: String
    },
    status: {
        type: String,
        default: PaymentStatus.PENDING
    },
    orderId: {
        type: String
    },
    paymentId: {
        type: String
    },
    signature: {
        type: String
    },
    description: {
        type: String
    },
    invoiceUrl: {
        type: String
    },
    failureReason: {
        type: String
    },
    paymentDate: {
        type: Date
    }
}, {
    timestamps: true
})

export const PaymentModel: Model<IPayment> = mongoose.model<IPayment>('Payment', paymentSchema)