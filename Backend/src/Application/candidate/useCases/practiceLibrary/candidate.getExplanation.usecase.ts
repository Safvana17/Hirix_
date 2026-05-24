import { AppError } from "../../../../Domain/errors/app.error";
import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { IQuestionRepository } from "../../../../Domain/repositoryInterface/iQuestion.repository";
import { ISubscriptionRepository } from "../../../../Domain/repositoryInterface/iSubscription.repository";
import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { questionMessages } from "../../../../Shared/constsnts/messages/questionMessages";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IPracticeEvaluationService } from "../../../interface/service/IPracticeEvaluationService";
import { CandidateGetExplanationInputDTO, CandidateGetExplanationOutputDTO } from "../../dtos/practiceLibrary/candidate.getExplanation.dto";
import { ICandidateGetExplanationUsecase } from "../../interfaces/practiceLibrary/ICandidate.getExplanation.usecase";

export class CandidateGetExplanationUsecase implements ICandidateGetExplanationUsecase {
    constructor (
        private _candidateRepository: ICandidateRepository,
        private _questionRepository :IQuestionRepository,
        private _subscriptionRepository: ISubscriptionRepository,
        private _subscriptionPlanRepository: ISubscriptionPlanRepository,
        private _evaluationService: IPracticeEvaluationService
    ) {}

    async execute(request: CandidateGetExplanationInputDTO): Promise<CandidateGetExplanationOutputDTO> {
        const candidate = await this._candidateRepository.findById(request.candidateId)
        if(!candidate){
            throw new AppError(authMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }
        const subscription = await this._subscriptionRepository.findCurrentByUserId(request.candidateId)
        if(!subscription){
            throw new AppError(subscriptionPlanMessages.error.CANNOT_FIND_SUBCRIPTION_DETAILS, statusCode.NOT_FOUND)
        }
        const plan = await this._subscriptionPlanRepository.findById(subscription.planId)
        if(!plan){
           throw new AppError(subscriptionPlanMessages.error.NOT_FOUND, statusCode.NOT_FOUND)
        }
        if(!plan.hasDetailedFeedback){
            throw new AppError(subscriptionPlanMessages.error.DETAILED_EXPLANATION_NOT_AVAILABLE, statusCode.NOT_FOUND)
        }
        const question = await this._questionRepository.findById(request.questionId)
        if(!question){
            throw new AppError(questionMessages.error.QUESTION_NOT_FOUND, statusCode.NOT_FOUND)
        }
        const explanation = await this._evaluationService.getExplanation({
            description: question.description,
            options: question.type === 'mcq' ?  question.options : undefined,
            answer: question.type === 'mcq' ? question.answer : undefined,
            testCases: question.type === 'coding' ? question.testCases : undefined,
            functionName: question.type === 'coding' ? question.functionName : undefined,
            starterCode: question.type === 'coding' ? question.starterCode : undefined
        })
        return {
            explanation: explanation.explanation
        }
    }
}