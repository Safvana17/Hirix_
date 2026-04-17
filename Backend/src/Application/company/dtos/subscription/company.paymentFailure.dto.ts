export interface CompanyPaymentFailureInputDTO {
    companyId: string
    orderId: string
}

export interface CompanyPaymentFailureOutputDTO {
    success: boolean
}