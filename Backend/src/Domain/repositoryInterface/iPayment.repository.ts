import { PaymentEntity } from "../entities/Payment.entity";

export interface IPaymentRepository {
    findByOrderId(orderId: string): Promise<PaymentEntity | null>
    findOrderByOwner(ownerId: string): Promise<PaymentEntity[] | null>
}