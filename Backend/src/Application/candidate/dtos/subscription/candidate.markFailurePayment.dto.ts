export interface CandidatePaymentFailureInputDTO {
    candidateId: string
    orderId: string
}

export interface CandidatePaymentFailureOutputDTO {
    success: boolean
}