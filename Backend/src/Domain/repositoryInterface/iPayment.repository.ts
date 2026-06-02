import { PaymentHistoryDTO } from "../../Application/admin/dtos/analytics/admin.getPaymentHistory.dto";
import { PaymentEntity } from "../entities/Payment.entity";
import { PaymentStatus } from "../enums/payment";
import { TargetType } from "../enums/subscription";
import { IBaseRepository } from "./iBase.repository";


// export interface PaymentList {
//     id: string
//     name: {
//         _id: string
//         name: string
//     }
//     plan: {
//         _id: string
//         planName: string
//     },
//     amount: number
//     date: Date
//     target: TargetType
//     status: PaymentStatus
// }

export interface IPaymentRepository extends IBaseRepository<PaymentEntity>{
    findByOrderId(orderId: string): Promise<PaymentEntity | null>
    findOrderByOwner(ownerId: string): Promise<PaymentEntity[] | null>
    findAllFiltered(query: {userId: string, status?: PaymentStatus, page: number, limit: number}): Promise<{data: PaymentEntity[], totalPages: number, totalCount: number}>
    getTotalRevenue(): Promise<number>
    getMonthlyRevenue(): Promise<number>
    getRevenueTrendByMonth(startDate: Date): Promise<{month: string; revenue: number}[]>
    getRevenueTrendByPlan(type?: TargetType): Promise<{plan: string; type: TargetType; revenue: number}[]>
    getHistory(query: {page: number, limit: number}): Promise<{data: PaymentHistoryDTO[]; totalPages: number; totalCount: number}>
}