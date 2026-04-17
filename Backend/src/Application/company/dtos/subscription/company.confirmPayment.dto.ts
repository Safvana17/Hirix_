export interface CompanyConfirmPaymentInputDTO{
    companyId: string
    planId: string
    orderId: string
    paymentId: string
    signature: string
}

export interface CompanyConfirmPaymentOutputDTO {
    success: boolean
}