import targetType from "../enums/subscription";

export class SubscriptionPlanEntity {
    id: string;
    planName: string;
    target: targetType;
    price: number;
    billingCycle: string;
    durationDays: number;
    maxTestsPerMonth: number;
    maxCandidates: number;
    features: string[];
    isActive: boolean;
    isDeleted: boolean;

    constructor(id: string, planName: string, target: targetType, price: number, billingCycle: string, durationDays: number, maxTestsPerMonth: number, maxCandidates: number, features: string[], isActive: boolean, isDeleted: boolean){
        this.id = id
        this.planName = planName
        this.target = target
        this.price = price
        this.billingCycle = billingCycle
        this.durationDays = durationDays
        this.maxTestsPerMonth = maxTestsPerMonth
        this.maxCandidates = maxCandidates
        this.features = features
        this.isActive = isActive
        this.isDeleted = isDeleted
    }
}