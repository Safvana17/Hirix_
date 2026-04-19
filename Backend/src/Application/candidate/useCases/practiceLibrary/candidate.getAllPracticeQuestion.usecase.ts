import { AppError } from "../../../../Domain/errors/app.error";
import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { IQuestionRepository } from "../../../../Domain/repositoryInterface/iQuestion.repository";
import { ISubscriptionRepository } from "../../../../Domain/repositoryInterface/iSubscription.repository";
import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CandidateGetAllPracticeQuestionsInputDTO, CandidatePaginatedPracticeQuestionDTO } from "../../dtos/practiceLibrary/candidate.getAllPracticeQuestion.dto";
import { ICandidateGetAllPracticeQuestionUsecase } from "../../interfaces/practiceLibrary/iCandidate.getAllPracticeQuestions.usecase";

export class CandidateGetAllPracticeQuestionsUsecase implements ICandidateGetAllPracticeQuestionUsecase{
    constructor(
        private _candidateRepository: ICandidateRepository,
        private _subscriptionrepository :ISubscriptionRepository,
        private _subscriptionPlanRepository: ISubscriptionPlanRepository,
        private _questionRepository: IQuestionRepository
    ) {}

    async execute(request: CandidateGetAllPracticeQuestionsInputDTO): Promise<CandidatePaginatedPracticeQuestionDTO> {

        const candidate = await this._candidateRepository.findById(request.candidateId)
        if(!candidate){
            throw new AppError(authMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const subscription = await this._subscriptionrepository.findCurrentByUserId(candidate.id)
        if(!subscription){
            throw new AppError(subscriptionPlanMessages.error.CANNOT_FIND_SUBCRIPTION_DETAILS, statusCode.NOT_FOUND)
        }

        const currentPlan = await this._subscriptionPlanRepository.findById(subscription.planId)
        if(!currentPlan){
            throw new AppError(subscriptionPlanMessages.error.NOT_FOUND, statusCode.NOT_FOUND)
        }

        const {data, totalCount, totalPages } = await this._questionRepository.findAllPracticeQuestions(request)
        let questions = data
        if(!currentPlan.canAccessPremiumQuestions){
            questions = questions.filter(q => !q.isPremium)
        }
        return {
            practiceQuestions: questions,
            totalCount,
            totalPages
        }
    }
}