import { PaymentEntity } from "../entities/Payment.entity";
import { IBaseRepository } from "./iBase.repository";

export interface IPaymentRepository extends IBaseRepository<PaymentEntity>{
    findByOrderId(orderId: string): Promise<PaymentEntity | null>
    findOrderByOwner(ownerId: string): Promise<PaymentEntity[] | null>
}