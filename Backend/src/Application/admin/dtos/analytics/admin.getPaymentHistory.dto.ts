
import { PaymentStatus } from "../../../../Domain/enums/payment"
import { TargetType } from "../../../../Domain/enums/subscription"

export interface AdminGetPaymentHistoryInputDTO{
    page: number
    limit: number
}

export interface PaymentHistoryDTO {
    id: string
    target: TargetType
    name: string
    plan: string
    amount: number
    date: string
    status: PaymentStatus
}

export interface AdminGetPaymentHistoryOutputDTO {
    history: PaymentHistoryDTO[],
    totalPages: number
    totalCount: number
}