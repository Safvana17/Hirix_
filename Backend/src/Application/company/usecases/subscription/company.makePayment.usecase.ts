import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { ComapnyMakePaymentInputDTO, ComapnyMakePaymentOutputDTO } from "../../dtos/subscription/company.makePayment.dto";
import { ICompanyMakePaymentUsecase } from "../../interfaces/subscription/ICompany.makePayment.usecase";

export class CompanyMakePaymentUsecase implements ICompanyMakePaymentUsecase {
    constructor(
        private _companyRepository: ICompanyRepository,
        private _subscriptionPlanRepository: ISubscriptionPlanRepository
    ) {}

    async execute(request: ComapnyMakePaymentInputDTO): Promise<ComapnyMakePaymentOutputDTO> {
        const company = await this._companyRepository.findById(request.companyId)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const newPlan = await this._subscriptionPlanRepository.findById(request.planId)
        if(!newPlan){
            throw new AppError(subscriptionPlanMessages.error.NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(newPlan.price === 0){
            throw new AppError(subscriptionPlanMessages.error.DOESNOT_REQUIRE_PAYMENT, statusCode.BAD_REQUEST)
        }
        
    }
}