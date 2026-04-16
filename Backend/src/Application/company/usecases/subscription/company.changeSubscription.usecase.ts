import { subscriptionStatus, TargetType } from "../../../../Domain/enums/subscription";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { ISubscriptionRepository } from "../../../../Domain/repositoryInterface/iSubscription.repository";
import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CompanyChangeSubscriptionInputDTO, CompanyChangeSubscriptionOutputDTO } from "../../dtos/subscription/company.changeSubscription.dto";
import { ICompanyChangeSubscriptionUsecase } from "../../interfaces/subscription/ICompany.changeSubscription.usecase";

export class CompanyChangeSubscriptionUsecase implements ICompanyChangeSubscriptionUsecase {
    constructor (
        private _companyRepository: ICompanyRepository,
        private _subscriptionPlanRepository: ISubscriptionPlanRepository,
        private _subscriptionRepository: ISubscriptionRepository
    ) {}

    async execute(request: CompanyChangeSubscriptionInputDTO): Promise<CompanyChangeSubscriptionOutputDTO> {
        const company = await this._companyRepository.findById(request.companyId)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        let currentSubscription = await this._subscriptionRepository.findCurrentByUserId(company.id)
        if(!currentSubscription){
            throw new AppError(subscriptionPlanMessages.error.CANNOT_FIND_SUBCRIPTION_DETAILS, statusCode.NOT_FOUND)
        }

        const newPlan = await this._subscriptionPlanRepository.findById(request.planId)
        if(!newPlan){
            throw new AppError(subscriptionPlanMessages.error.NOT_FOUND, statusCode.NOT_FOUND)
        }
        if(!newPlan.isActive) {
            throw new AppError(subscriptionPlanMessages.error.INACTIVE_PLAN, statusCode.BAD_REQUEST)
        }
        if(newPlan.isDeleted){
            throw new AppError(subscriptionPlanMessages.error.DELETED_PLAN, statusCode.BAD_REQUEST)
        }

        if(currentSubscription.planId === newPlan.id){
            throw new AppError(subscriptionPlanMessages.error.ALREADY_SUBSCRIBED, statusCode.BAD_REQUEST)
        }

        const freePlan = await this._subscriptionPlanRepository.findFreePlan(TargetType.COMPANY)
        if(!freePlan){
            throw new AppError(subscriptionPlanMessages.error.MISSING_FREE_PLAN, statusCode.NOT_FOUND)
        }

        if(newPlan.id === freePlan.id){
           currentSubscription.status = subscriptionStatus.CANCELLED
           currentSubscription.isCurrent = false
           await this._subscriptionRepository.update(currentSubscription.id, currentSubscription)

           currentSubscription = await this._subscriptionRepository.create({
              id: '',
              ownerType: TargetType.COMPANY,
              ownerId: company.id,
              planId: freePlan.id,
              startDate: new Date(),
              endDate: null,
              status: subscriptionStatus.ACTIVE,
              isCurrent: true
           })
        }
        return{
            newPlan: newPlan,
            isPaymentRequired: newPlan.price !== 0
        }
    }
}