import { SubscriptionEntity } from "../../../../Domain/entities/Subscription.entity";
import { subscriptionStatus, TargetType } from "../../../../Domain/enums/subscription";
import { AppError } from "../../../../Domain/errors/app.error";
import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { ISubscriptionRepository } from "../../../../Domain/repositoryInterface/iSubscription.repository";
import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CandidateCancelSubscriptionInputDTO, CandidateCancelSubscriptionOutputDTO } from "../../dtos/subscription/candidate.cancelSubscription.dto";
import { ICandidateCancelSubscriptionUsecase } from "../../interfaces/subscription/ICandidate.cancelSubscription.usecase";

export class CandidateCancelSubscriptionUsecase implements ICandidateCancelSubscriptionUsecase {
    constructor(
        private _candidateRepository: ICandidateRepository,
        private _subscriptionRepository: ISubscriptionRepository,
        private _subscriptionPlanRepository: ISubscriptionPlanRepository
    ){}

    async execute(request: CandidateCancelSubscriptionInputDTO): Promise<CandidateCancelSubscriptionOutputDTO> {
       const candidate = await this._candidateRepository.findById(request.candidateId)
        if(!candidate){
            throw new AppError(authMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }
        const subscription = await this._subscriptionRepository.findCurrentByUserId(candidate.id)
        if(!subscription){
            throw new AppError(subscriptionPlanMessages.error.NOT_FOUND, statusCode.NOT_FOUND)
        }
        if(subscription.id !== request.subscriptionId){
            throw new AppError(subscriptionPlanMessages.error.INCORRECT_SUBSCRIPTION_ID, statusCode.BAD_REQUEST)
        }
        if(!subscription.isCurrent){
            throw new AppError(subscriptionPlanMessages.error.NOT_CURRENT_SUBSCRIPTION, statusCode.BAD_REQUEST)
        }
        const plan = await this._subscriptionPlanRepository.findById(subscription.planId)
        if(!plan){
            throw new AppError(subscriptionPlanMessages.error.NOT_FOUND, statusCode.NOT_FOUND)
        }
        if(plan.price === 0){
            throw new AppError(subscriptionPlanMessages.error.CANNOT_CANCEL_FREE_PLAN, statusCode.BAD_REQUEST)
        }

        const freePlan = await this._subscriptionPlanRepository.findFreePlan(TargetType.CANDIDATE)
        if(!freePlan){
            throw new AppError(subscriptionPlanMessages.error.MISSING_FREE_PLAN, statusCode.NOT_FOUND)
        }

        subscription.status = subscriptionStatus.CANCELLED
        subscription.isCurrent = false
        await this._subscriptionRepository.update(subscription.id, subscription)

        const newSubscription = new SubscriptionEntity(
            '',
            TargetType.CANDIDATE,
            candidate.id,
            freePlan.id,
            new Date(),
            null,
            subscriptionStatus.ACTIVE,
            true
        )
        const currentSubscription = await this._subscriptionRepository.create(newSubscription)
        return {
            id: freePlan.id,
            subscriptionId: currentSubscription.id,
            planName: freePlan.planName,
            price: freePlan.price,
            startDate: currentSubscription.startDate,
            endDate: currentSubscription.endDate,
            status: currentSubscription.status,
            billingCycle: freePlan.billingCycle,
            maxTestsPerMonth: freePlan.maxTestsPerMonth ?? null,
            maxCandidates: freePlan.maxCandidates ?? null,
            maxInterviewPerMonth: freePlan.maxInterviewPerMonth ?? null,
            maxJobRolesPerMonth: freePlan.maxJobRolesPerMonth ?? null,
            maxPracticePerDay: freePlan.maxPracticePerDay ?? null
        }        
    }
}