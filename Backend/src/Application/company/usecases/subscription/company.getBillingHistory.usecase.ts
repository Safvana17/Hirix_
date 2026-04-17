import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { IPaymentRepository } from "../../../../Domain/repositoryInterface/iPayment.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CompanyGetBillingHistoryInputDTO, CompanyGetBillingHistoryOutputDTO } from "../../dtos/subscription/company.billingHistory.dto";
import { IGetCompanyBillingHistoryUsecase } from "../../interfaces/subscription/ICompany.getBillingHistory.usecase";

export class CompanyGetBillingHistoryUsecase implements IGetCompanyBillingHistoryUsecase {
    constructor (
        private _companyRepository: ICompanyRepository,
        private _paymentRepository: IPaymentRepository
    ) {}

    async execute(request: CompanyGetBillingHistoryInputDTO): Promise<CompanyGetBillingHistoryOutputDTO> {
        const company = await this._companyRepository.findById(request.userId)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const { data, totalCount, totalPages } = await this._paymentRepository.findAllFiltered(request)
        return {
            payments: data,
            totalCount,
            totalPages
        }
    }
}