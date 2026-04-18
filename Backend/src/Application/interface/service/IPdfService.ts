import { PaymentEntity } from "../../../Domain/entities/Payment.entity";
import { SubscriptionEntity } from "../../../Domain/entities/Subscription.entity";
import { SubscriptionPlanEntity } from "../../../Domain/entities/SubscriptionPlan.entity";
import UserEntity from "../../../Domain/entities/user.entity";


export interface IPdfService {
    generateInvoice(data: {user: UserEntity, payment: PaymentEntity, subscriptionPlan: SubscriptionPlanEntity, subscription: SubscriptionEntity}): Promise<Buffer>
}