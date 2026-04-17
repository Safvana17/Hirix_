import { PaymentEntity } from "../../../../Domain/entities/Payment.entity"
import { PaymentStatus } from "../../../../Domain/enums/payment"

export interface CompanyGetBillingHistoryInputDTO {
    userId: string
    status?: PaymentStatus
    page: number
    limit: number
}

export interface CompanyGetBillingHistoryOutputDTO {
    payments: PaymentEntity[]
    totalPages: number
    totalCount: number
}