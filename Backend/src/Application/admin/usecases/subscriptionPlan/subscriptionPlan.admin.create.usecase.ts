import { SubscriptionPlanEntity } from "../../../../Domain/entities/SubscriptionPlan.entity";
import { BillingCycle, DurationDays, TargetType } from "../../../../Domain/enums/subscription";
import { AppError } from "../../../../Domain/errors/app.error";
import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { AdminCreateSubscriptionPlanInputDTO, AdminCreateSubscriptionPlanOutputDTO } from "../../dtos/subscriptionPlan/create.subscriptionPlan.dto";
import { ICreateSubscriptionPlanUsecase } from "../../interfaces/subscriptionPlan/ISubscriptionPlan.admin.create.usecase";

export class AdminCreateSubscriptionPlnUsecase implements ICreateSubscriptionPlanUsecase {
    constructor (
        private _subscriptionPlanRepository: ISubscriptionPlanRepository
    ) {}

    async execute(request: AdminCreateSubscriptionPlanInputDTO): Promise<AdminCreateSubscriptionPlanOutputDTO> {
        const isExisting = await this._subscriptionPlanRepository.findByNameAndTarget(request.planName, request.target)
        if(isExisting){
            throw new AppError(subscriptionPlanMessages.error.ALREADY_EXISTS, statusCode.CONFLICT)
        }

        if(request.planName.trim().toLowerCase() === 'free' && request.price > 0){
            throw new AppError(subscriptionPlanMessages.error.PRICE_MUST_BE_ZERO, statusCode.BAD_REQUEST)
        }

        if(request.price === 0 && request.billingCycle !== BillingCycle.FOREVER){
           throw new AppError(subscriptionPlanMessages.error.INVALID_BILLING_CYCLE, statusCode.BAD_REQUEST)
        }
        // const expectedDurationDays = DurationDays[request.billingCycle]
        // if(request.durationDays !== expectedDurationDays){
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
        for(let value of limits){
            if(value !== null && value !== undefined && value < 0){
                throw new AppError(subscriptionPlanMessages.error.CANNOT_BE_NEGATIVE_VALUE, statusCode.BAD_REQUEST)
            }
        }

        if(request.target === TargetType.COMPANY){
            if(!request.canUseAdminQuestions){
                throw new AppError(subscriptionPlanMessages.error.CANNOT_DENY_ADMIN_QUESTIONS_ACCESS, statusCode.BAD_REQUEST)
            }
        }

        if(request.target === TargetType.CANDIDATE){
            if(!request.canAccessPremiumQuestions && request.hasDetailedFeedback){
                throw new AppError(subscriptionPlanMessages.error.REQUIRES_PREMIUM_ACCESS, statusCode.BAD_REQUEST)
            }
        }

        const newPlan = new SubscriptionPlanEntity(
            '',
            request.planName,
            request.target,
            request.price,
            request.billingCycle,
            durationDays,
            true,
            false,
            request.canCreateCustomQuestions ?? false,
            request.canUseAdminQuestions ?? true,
            request.maxTestsPerMonth,
            request.maxCandidates,
            request.maxJobRolesPerMonth,
            request.maxInterviewsPerMonth,
            request.canAccessPremiumQuestions,
            request.maxPracticePerDay,
            request.hasDetailedFeedback
        )

        await this._subscriptionPlanRepository.create(newPlan)

        return {
           plan: newPlan
        }
    }
}