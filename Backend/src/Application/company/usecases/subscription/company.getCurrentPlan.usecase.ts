import { subscriptionStatus, TargetType } from "../../../../Domain/enums/subscription";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { ISubscriptionRepository } from "../../../../Domain/repositoryInterface/iSubscription.repository";
import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { logger } from "../../../../utils/logging/loger";
import { CompanyGetCurrentPlanInputDTO, CompanyGetCurrentPlanOutputDTO } from "../../dtos/subscription/company.getCurrent.plan.dto";
import { ICompanyGetCurrentPlanUsecase } from "../../interfaces/subscription/ICompany.getCurrentPlan.usecase";

export class CompanyGetCurrentPlanUsecase implements ICompanyGetCurrentPlanUsecase {
    constructor(
        private _companyRepository: ICompanyRepository,
        private _subscriptionRepository: ISubscriptionRepository,
        private _subscriptionPlanRepository: ISubscriptionPlanRepository
    ) {}

    async execute(request: CompanyGetCurrentPlanInputDTO): Promise<CompanyGetCurrentPlanOutputDTO> {
        const company = await this._companyRepository.findById(request.id)
        logger.info(company, 'from usecase')
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }
        let subscription = await this._subscriptionRepository.findCurrentByUserId(company.id)
        logger.info(subscription, 'subscription')
        if(!subscription){
            throw new AppError(subscriptionPlanMessages.error.CANNOT_FIND_SUBCRIPTION_DETAILS, statusCode.NOT_FOUND)
        }

        const isExpired = subscription.endDate && subscription.endDate < new Date()
        if(isExpired){
            subscription.status = subscriptionStatus.EXPIRED
            subscription.isCurrent = false
            await this._subscriptionRepository.update(subscription.id, subscription)

            const freePlan = await this._subscriptionPlanRepository.findFreePlan(TargetType.COMPANY)
            if(!freePlan){
                throw new AppError(subscriptionPlanMessages.error.MISSING_FREE_PLAN, statusCode.NOT_FOUND)
            }
            subscription = await this._subscriptionRepository.create({
                id: '',
                ownerType: TargetType.COMPANY,
                ownerId: company.id,
                planId: freePlan.id,
                startDate: new Date(),
                endDate: null,
                status: subscriptionStatus.ACTIVE,
                isTrial: false,
                isCurrent: true,
            })
        }
        const currentPlan = await this._subscriptionPlanRepository.findById(subscription.planId)
        if(!currentPlan){
            throw new AppError(subscriptionPlanMessages.error.NOT_FOUND, statusCode.NOT_FOUND)
        }

        return {
            id: currentPlan.id,
            subscriptionId: subscription.id,
            planName: currentPlan.planName,
            price: currentPlan.price,
            billingCycle: currentPlan.billingCycle,
            startDate: subscription.startDate,
            endDate: subscription.endDate,
            status: subscription.status,
            maxTestsPerMonth: currentPlan.maxTestsPerMonth ?? null,
            maxCandidates: currentPlan.maxCandidates ?? null,
            maxInterviewPerMonth: currentPlan.maxInterviewPerMonth ?? null,
            maxJobRolesPerMonth: currentPlan.maxJobRolesPerMonth ?? null,
            maxPracticePerDay: currentPlan.maxPracticePerDay ?? null

        }
    }
}