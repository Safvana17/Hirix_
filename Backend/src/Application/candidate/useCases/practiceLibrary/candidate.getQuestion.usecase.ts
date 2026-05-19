import { AppError } from "../../../../Domain/errors/app.error";
import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { IQuestionRepository } from "../../../../Domain/repositoryInterface/iQuestion.repository";
import { ISubscriptionRepository } from "../../../../Domain/repositoryInterface/iSubscription.repository";
import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { questionMessages } from "../../../../Shared/constsnts/messages/questionMessages";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CandidateGetQuestionInputDTO, CandidateGetQuestionOutputDTO } from "../../dtos/practiceLibrary/candidate.getQuestionById.dto";
import { ICandidateGetQuestionByIdUsecase } from "../../interfaces/practiceLibrary/ICandidate.getQuestionById.usecase";

export class CandidateGetQuestionByIdUsecase implements ICandidateGetQuestionByIdUsecase {
    constructor(
        private _candidateRepository: ICandidateRepository,
        private _questionRepository: IQuestionRepository,
        private _subscriptionRepository: ISubscriptionRepository,
        private _subscriptionPlanRepository: ISubscriptionPlanRepository
    ) {}
    async execute(request: CandidateGetQuestionInputDTO): Promise<CandidateGetQuestionOutputDTO> {
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
        if(!question.isPractice) {
            throw new AppError(questionMessages.error.NOT_PRACTICE_QUESTION, statusCode.BAD_REQUEST)
        }
        if(plan.price === 0 && question.isPremium){
            throw new AppError(questionMessages.error.CANNOT_ACCESS_PREMIUM_QUESTIONS, statusCode.FORBIDDEN)
        }
        return {
            id: question.id,
            title: question.title,
            description: question.description,
            type: question.type,
            difficulty: question.difficulty,
            category: question.categoryId,
            options: question.options,
            testCases: question.testCases,
            isPremium: question.isPremium
        }
    }
}