import { PaymentEntity } from "../entities/Payment.entity";
import { PaymentStatus } from "../enums/payment";
import { TargetType } from "../enums/subscription";
import { IBaseRepository } from "./iBase.repository";

export interface IPaymentRepository extends IBaseRepository<PaymentEntity>{
    findByOrderId(orderId: string): Promise<PaymentEntity | null>
    findOrderByOwner(ownerId: string): Promise<PaymentEntity[] | null>
    findAllFiltered(query: {userId: string, status?: PaymentStatus, page: number, limit: number}): Promise<{data: PaymentEntity[], totalPages: number, totalCount: number}>
    getTotalRevenue(): Promise<number>
    getMonthlyRevenue(): Promise<number>
    getRevenueTrendByMonth(startDate: Date): Promise<{month: string; revenue: number}[]>
    getRevenueTrendByPlan(type?: TargetType): Promise<{plan: string; type: TargetType; revenue: number}[]>
}