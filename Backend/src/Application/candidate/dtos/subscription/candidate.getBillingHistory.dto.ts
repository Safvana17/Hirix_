import { PaymentEntity } from "../../../../Domain/entities/Payment.entity"
import { PaymentStatus } from "../../../../Domain/enums/payment"

export interface CandidateGetBillingHistoryInputDTO {
    userId: string
    status?: PaymentStatus
    page: number
    limit: number
}

export interface CandidateGetBillingHistoryOutputDTO {
    payments: PaymentEntity[]
    totalPages: number
    totalCount: number
}