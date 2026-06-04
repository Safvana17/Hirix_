import { SubscriptionEntity } from "../../../../Domain/entities/Subscription.entity";
import { ActivityAction } from "../../../../Domain/enums/activityLog";
import { subscriptionStatus, TargetType } from "../../../../Domain/enums/subscription";
import userRole from "../../../../Domain/enums/userRole.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import { IActivityLogRepository } from "../../../../Domain/repositoryInterface/IActivityLog.repository";
import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { ISubscriptionRepository } from "../../../../Domain/repositoryInterface/iSubscription.repository";
import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CandidateStartFreeTrialInputDTO, CandidateStartFreeTrialOutputDTO } from "../../dtos/subscription/candidate.startFreeTrial.dto";
import { ICandidateStartFreeTrialUsecase } from "../../interfaces/subscription/ICandidate.startFreeTrial.usecase";

export class CandidateStartFreeTrialUsecase implements ICandidateStartFreeTrialUsecase{
    constructor(
        private _candidateRepository: ICandidateRepository,
        private _subscriptionPlanRepository: ISubscriptionPlanRepository,
        private _subscriptionRepository: ISubscriptionRepository,
        private _activityLogRepository: IActivityLogRepository
    ) {}

    async execute(request: CandidateStartFreeTrialInputDTO): Promise<CandidateStartFreeTrialOutputDTO> {
        const candidate = await this._candidateRepository.findById(request.candidateId)
        if(!candidate){
            throw new AppError(authMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const plan = await this._subscriptionPlanRepository.findById(request.planId)
        if(!plan){
            throw new AppError(subscriptionPlanMessages.error.NOT_FOUND, statusCode.NOT_FOUND)
        }
        if(!plan.isTrialEnabled){
            throw new AppError(subscriptionPlanMessages.error.PLAN_DOES_NOT_SUPPORT_FREE_TRIAL, statusCode.BAD_REQUEST)
        }
        if(!plan.isActive){
            throw new AppError(subscriptionPlanMessages.error.INACTIVE_PLAN, statusCode.BAD_REQUEST)
        }

        const isTiralUsed = await this._subscriptionRepository.findTrialByUserAndPlan(candidate.id, plan.id)
        if(isTiralUsed){
            throw new AppError(subscriptionPlanMessages.error.FREE_TRIAL_ALREADY_USED, statusCode.BAD_REQUEST)
        }

        const startDate = new Date()
        const endDate = new Date(startDate.getTime() + plan?.trialDays * 24 * 60 * 60 * 1000)
        const currentSubscription = await this._subscriptionRepository.findCurrentByUserId(candidate.id)
        if(!currentSubscription){
            throw new AppError(subscriptionPlanMessages.error.CANNOT_FIND_SUBCRIPTION_DETAILS, statusCode.NOT_FOUND)
        }

        currentSubscription.status = subscriptionStatus.CANCELLED
        currentSubscription.isCurrent = false
        await this._subscriptionRepository.update(currentSubscription.id, currentSubscription)

        const subscription = new SubscriptionEntity(
            '',
            TargetType.CANDIDATE,
            candidate.id,
            plan.id,
            startDate,
            endDate,
            subscriptionStatus.TRIAL,
            true,
            true
        )

        const newSubscription = await this._subscriptionRepository.create(subscription)
        await this._activityLogRepository.create({
            id: '',
            actorId: candidate.id,
            actorType: userRole.Candidate,
            action: ActivityAction.START_TRIAL,
            targetId: newSubscription.id,
            targetType: 'Subscription',
            title: `${candidate.getName()} started a free trial for ${plan.planName}`
        })
        return {
            success: true
        }
    }
}