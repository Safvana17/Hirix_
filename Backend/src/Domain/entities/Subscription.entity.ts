import { subscriptionStatus, TargetType } from "../enums/subscription";

export class SubscriptionEntity {
    id: string;
    ownerType: TargetType;
    ownerId: string;
    planId: string;
    startDate: Date;
    endDate: Date | null;
    status: subscriptionStatus;
    isTrial: boolean;
    isCurrent: boolean;
    paymentId?: string

    constructor(
        id: string,
        ownerType: TargetType,
        ownerId: string,
        planId: string,
        startDate: Date,
        endDate: Date | null,
        status: subscriptionStatus,
        isTrial: boolean,
        isCurrent: boolean,
        paymentId?: string
    ) {
        this.id = id;
        this.ownerType = ownerType;
        this.ownerId = ownerId;
        this.planId = planId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.isTrial = isTrial;
        this.isCurrent = isCurrent;
        this.paymentId = paymentId 
    }
}