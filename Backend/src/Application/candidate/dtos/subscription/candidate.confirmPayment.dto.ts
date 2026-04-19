export interface CandidateConfirmPaymentInputDTO{
    candidateId: string
    planId: string
    orderId: string
    paymentId: string
    signature: string
}

export interface CandidateConfirmPaymentOutputDTO {
    success: boolean
}