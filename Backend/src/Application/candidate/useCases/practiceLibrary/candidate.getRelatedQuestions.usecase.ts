import { AppError } from "../../../../Domain/errors/app.error";
import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { IQuestionRepository } from "../../../../Domain/repositoryInterface/iQuestion.repository";
import { ISubscriptionRepository } from "../../../../Domain/repositoryInterface/iSubscription.repository";
import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { questionMessages } from "../../../../Shared/constsnts/messages/questionMessages";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CandidateGetRelatedQuestionsInputDTO, CandidateGetRelatedQuestionsOutputDTO } from "../../dtos/practiceLibrary/candidate.getRelatedQuestions.dto";
import { ICandidateGetRelatedQuestionsUsecase } from "../../interfaces/practiceLibrary/ICandidate.getRelatedQuestions.usecase";

export class CandidateGetRelatedQuestionsUsecase implements ICandidateGetRelatedQuestionsUsecase {
    constructor(
        private _candidateRepository: ICandidateRepository,
        private _questionRepository: IQuestionRepository,
        private _subscriptionRepository: ISubscriptionRepository,
        private _subscriptionPlanRepository: ISubscriptionPlanRepository
    ) {}
    async execute(request: CandidateGetRelatedQuestionsInputDTO): Promise<CandidateGetRelatedQuestionsOutputDTO> {
        const candidate = await this._candidateRepository.findById(request.candidateId)
        if(!candidate){
            throw new AppError(authMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }
        const subscription = await this._subscriptionRepository.findCurrentByUserId(candidate.id)
        if(!subscription){
            throw new AppError(subscriptionPlanMessages.error.CANNOT_FIND_SUBCRIPTION_DETAILS, statusCode.NOT_FOUND)
        }
        const plan = await this._subscriptionPlanRepository.findById(subscription.planId)
        if(!plan){
            throw new AppError(subscriptionPlanMessages.error.NOT_FOUND, statusCode.NOT_FOUND)
        }
        const question = await this._questionRepository.findById(request.questionId)
        if(!question){
            throw new AppError(questionMessages.error.QUESTION_NOT_FOUND, statusCode.NOT_FOUND)
        }
        const questions = await this._questionRepository.findRelated({currentQuestionId: question.id, category: question.categoryId, isIncludePremium: plan.canAccessPremiumQuestions!})
        return {
            questions
        }
    }
}