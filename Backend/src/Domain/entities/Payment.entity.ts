import { PaymentStatus } from "../enums/payment";
import { TargetType } from "../enums/subscription";

export class PaymentEntity {
    id: string;
    subscriptionId: string;
    ownerType: TargetType;
    ownerId: string;
    planId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    orderId: string;
    paymentId: string;
    signature: string;
    description: string;
    invoiceUrl: string;
    failureRason?: string;
    paymentDate: Date; 

    constructor (
        id: string,
        subscriptionId: string,
        ownerType: TargetType,
        ownerId: string,
        planId: string,
        amount: number,
        currency: string,
        status: PaymentStatus,
        orderId: string,
        paymentId: string,
        signature: string,
        description: string,
        invoiceUrl: string,
        paymentDate: Date,
    ) {
        this.id = id;
        this.subscriptionId = subscriptionId;
        this.ownerType = ownerType;
        this.ownerId = ownerId;
        this.planId = planId
        this.amount = amount;
        this.currency = currency;
        this.status = status;
        this.orderId = orderId;
        this.paymentId = paymentId;
        this.signature = signature;
        this.description = description;
        this.invoiceUrl = invoiceUrl;
        this.paymentDate = paymentDate;
    }
}