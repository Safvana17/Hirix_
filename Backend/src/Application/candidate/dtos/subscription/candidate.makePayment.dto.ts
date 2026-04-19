export interface CandidateMakePaymentInputDTO {
    candidateId: string
    planId: string
}

export interface CandidateMakePaymentOutputDTO {
    orderId: string
    amount: number
    currency: string
}