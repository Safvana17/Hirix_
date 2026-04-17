import { CompanyConfirmPaymentInputDTO, CompanyConfirmPaymentOutputDTO } from "../../dtos/subscription/company.confirmPayment.dto";

export interface ICompanyConfirmPaymentUsecase {
    execute(request: CompanyConfirmPaymentInputDTO): Promise<CompanyConfirmPaymentOutputDTO>
}