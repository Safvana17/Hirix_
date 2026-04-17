import { CompanyPaymentFailureInputDTO, CompanyPaymentFailureOutputDTO } from "../../dtos/subscription/company.paymentFailure.dto";

export interface ICompanyPaymentFailureUsecase{
    execute(request: CompanyPaymentFailureInputDTO): Promise<CompanyPaymentFailureOutputDTO>
}