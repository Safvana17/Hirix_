import { PaymentEntity } from "../entities/Payment.entity";
import { PaymentStatus } from "../enums/payment";
import { IBaseRepository } from "./iBase.repository";

export interface IPaymentRepository extends IBaseRepository<PaymentEntity>{
    findByOrderId(orderId: string): Promise<PaymentEntity | null>
    findOrderByOwner(ownerId: string): Promise<PaymentEntity[] | null>
    findAllFiltered(query: {userId: string, status?: PaymentStatus, page: number, limit: number}): Promise<{data: PaymentEntity[], totalPages: number, totalCount: number}>
}