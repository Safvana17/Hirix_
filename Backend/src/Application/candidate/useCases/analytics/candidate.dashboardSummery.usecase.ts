import { AppError } from "../../../../Domain/errors/app.error";
import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { ISubscriptionRepository } from "../../../../Domain/repositoryInterface/iSubscription.repository";
import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CandidateDashboardSummeryInputDTO, CandidateDashboardSummeryOutputDTO } from "../../dtos/analytics/candidate.dashboardSummery.dto";
import { ICandidateDashboardSummeryUsecase } from "../../interfaces/analytics/ICandidate.dashboardSummery.usecase";

export class CandidateDashboardSummeryUsecase implements ICandidateDashboardSummeryUsecase {
    constructor (
        private _candidateRepository: ICandidateRepository,
        private _subscriptionRepository: ISubscriptionRepository,
        private _subscriptionPlanRepository: ISubscriptionPlanRepository,
        private _testCandidateRepository: ITestCandidateRepository,
    ) {}

    async execute(request: CandidateDashboardSummeryInputDTO): Promise<CandidateDashboardSummeryOutputDTO> {
        const candidate = await this._candidateRepository.findById(request.candidateId)
        if(!candidate){
            throw new AppError(authMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }
        const totalQuestionsAttempted = candidate.practiceQuestionCount
        const accuracy = (candidate.correctPracticeAnswers && totalQuestionsAttempted) ? Math.ceil ( candidate.correctPracticeAnswers / totalQuestionsAttempted) *100 : 0
        const subscription = await this._subscriptionRepository.findCurrentByUserId(candidate.id)
        if(!subscription){
            throw new AppError(subscriptionPlanMessages.error.CANNOT_FIND_SUBCRIPTION_DETAILS, statusCode.NOT_FOUND)
        }
        const plan = await this._subscriptionPlanRepository.findById(subscription.planId)
        if(!plan){
            throw new AppError(subscriptionPlanMessages.error.NOT_FOUND, statusCode.NOT_FOUND)
        }

        const totalTestAttended = await this._testCandidateRepository.getTotalTestAttended(candidate.getEmail())
        return{
            summery: {
                totalQuestionsAttempted: totalQuestionsAttempted ?? 0,
                accuracy,
                currentPlan: plan.planName,
                totalTestAttended
            }
        }

    }
}