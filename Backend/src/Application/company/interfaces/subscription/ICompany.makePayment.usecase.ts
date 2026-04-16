import { ComapnyMakePaymentInputDTO, ComapnyMakePaymentOutputDTO } from "../../dtos/subscription/company.makePayment.dto";

export interface ICompanyMakePaymentUsecase {
    execute(request: ComapnyMakePaymentInputDTO): Promise<ComapnyMakePaymentOutputDTO>
}