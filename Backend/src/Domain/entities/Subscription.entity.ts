import { TargetType } from "../enums/subscription";

export class SubscriptionEntity {
    id: string;
    ownerType: TargetType;
    ownerId: string;
    planId: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    paymentId?: string

    constructor(
        id: string,
        ownerType: TargetType,
        ownerId: string,
        planId: string,
        startDate: Date,
        endDate: Date,
        isActive: boolean,
        paymentId?: string
    ) {
        this.id = id;
        this.ownerType = ownerType;
        this.ownerId = ownerId;
        this.planId = planId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.isActive = isActive;
        this.paymentId = paymentId 
    }
}