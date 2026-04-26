import { DurationDays, TargetType } from "../../../../Domain/enums/subscription";
import { AppError } from "../../../../Domain/errors/app.error";
import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { AdminEditSubscriptionPlanInputDTO, AdminEditSubscriptionPlanOutputDTO } from "../../dtos/subscriptionPlan/edit.subscriptionPlan.dto";
import { IAdminEditSubscriptionPlanUsecase } from "../../interfaces/subscriptionPlan/ISubscriptionPlan.admin.edit.usecase";

export class AdminEditSubscriptionPlanUsecase implements IAdminEditSubscriptionPlanUsecase {
    constructor(
        private _subscriptionPlanRepository: ISubscriptionPlanRepository
    ) {}

    async execute(request: AdminEditSubscriptionPlanInputDTO): Promise<AdminEditSubscriptionPlanOutputDTO> {
        const plan = await this._subscriptionPlanRepository.findById(request.id)
        if (!plan) {
            throw new AppError(subscriptionPlanMessages.error.NOT_FOUND, statusCode.NOT_FOUND)
        }

        const existing = await this._subscriptionPlanRepository.findByNameAndTarget(
            request.planName,
            request.target
        )

        if (existing && existing.id !== plan.id) {
            throw new AppError(subscriptionPlanMessages.error.ALREADY_EXISTS, statusCode.CONFLICT)
        }

        const isFreePlan = request.planName.trim().toLowerCase() === 'free'

        if (isFreePlan && request.price > 0) {
            throw new AppError(subscriptionPlanMessages.error.PRICE_MUST_BE_ZERO, statusCode.BAD_REQUEST)
        }

        // const expectedDurationDays = DurationDays[request.billingCycle]

        // if (!expectedDurationDays || request.durationDays !== expectedDurationDays) {
        //     throw new AppError(subscriptionPlanMessages.error.INVALID_DURATIONDAYS, statusCode.BAD_REQUEST)
        // }

        const durationDays = DurationDays[request.billingCycle]

        const limits = [
            request.maxTestsPerMonth,
            request.maxCandidates,
            request.maxJobRolesPerMonth,
            request.maxInterviewsPerMonth,
            request.maxPracticePerDay
        ]

        for (const value of limits) {
            if (value != null && value < 0) {
                throw new AppError(subscriptionPlanMessages.error.CANNOT_BE_NEGATIVE_VALUE, statusCode.BAD_REQUEST)
            }
        }

        if (request.target === TargetType.COMPANY) {
            if (!request.canUseAdminQuestions) {
                throw new AppError(subscriptionPlanMessages.error.CANNOT_DENY_ADMIN_QUESTIONS_ACCESS, statusCode.BAD_REQUEST)
            }
        }

        if(request.target === TargetType.CANDIDATE){
            if(!request.canAccessPremiumQuestions && request.hasDetailedFeedback){
                throw new AppError(subscriptionPlanMessages.error.REQUIRES_PREMIUM_ACCESS, statusCode.BAD_REQUEST)
            }
        }

        plan.planName = request.planName
        plan.target = request.target
        plan.price = request.price
        plan.billingCycle = request.billingCycle
        plan.durationDays = durationDays
        plan.canCreateCustomQuestions = request.canCreateCustomQuestions
        plan.canUseAdminQuestions = request.canUseAdminQuestions
        plan.canAccessPremiumQuestions = request.canAccessPremiumQuestions
        plan.maxCandidates = request.maxCandidates
        plan.maxTestsPerMonth = request.maxTestsPerMonth
        plan.maxInterviewPerMonth =request.maxInterviewsPerMonth
        plan.maxJobRolesPerMonth = request.maxJobRolesPerMonth
        plan.maxPracticePerDay = request.maxPracticePerDay
        plan.hasDetailedFeedback = request.hasDetailedFeedback
        plan.isTrialEnabled = request.isTrialEnabled
        plan.trialDays = request.trialDays

        const updatedPlan = await this._subscriptionPlanRepository.update(plan.id, plan)

        return {
           plan: updatedPlan!
        }
    }
}