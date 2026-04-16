export interface ComapnyMakePaymentInputDTO {
    companyId: string
    planId: string
}

export interface ComapnyMakePaymentOutputDTO {
    orderId: string
    amount: number
    currency: string
}