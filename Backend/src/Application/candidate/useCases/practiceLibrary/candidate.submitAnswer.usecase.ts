import CandidateEntity from "../../../../Domain/entities/Candidate.entity";
import QuestionType from "../../../../Domain/enums/questionType";
import { CodingLanguage } from "../../../../Domain/enums/Test";
import { AppError } from "../../../../Domain/errors/app.error";
import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import { IQuestionRepository } from "../../../../Domain/repositoryInterface/iQuestion.repository";
import { ISubscriptionRepository } from "../../../../Domain/repositoryInterface/iSubscription.repository";
import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { questionMessages } from "../../../../Shared/constsnts/messages/questionMessages";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { logger } from "../../../../utils/logging/loger";
import { IPracticeEvaluationService } from "../../../interface/service/IPracticeEvaluationService";
import { CandidateSubmitAnswerInputDTO, CandidateSubmitAnswerOutputDTO } from "../../dtos/practiceLibrary/candidate.submitAnswer.dto";
import { ICandidateSubmitAnswerUsecase } from "../../interfaces/practiceLibrary/ICandidate.submitAnswer.usecase";

export class CandidateSubmitAnswerUsecase implements ICandidateSubmitAnswerUsecase {
    constructor(
        private _candidateRepository: ICandidateRepository,
        private _questionRepository :IQuestionRepository,
        private _subscriptionRepository: ISubscriptionRepository,
        private _subscriptionPlanRepository: ISubscriptionPlanRepository,
        private _evaluationService: IPracticeEvaluationService
    ) {}
    async execute(request: CandidateSubmitAnswerInputDTO): Promise<CandidateSubmitAnswerOutputDTO> {
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

        const canViewFeedback = plan.hasDetailedFeedback
        candidate.attendedQuestionIds?.push(question.id)
        if(request.questionType === QuestionType.MCQ){
            const isCorrect = await this._evaluationService.evaluateMcq({questionAnswer: question.answer ?? [], candidateAnswer:request.selectedOption ?? []})
            await this.updatePracticeState(candidate, isCorrect)
            return {
                isCorrect,
                correctAnswer: question.answer ?? [],
                feedback: canViewFeedback 
                   ? isCorrect 
                      ? "Correct Answer, Good job"
                      : "Incorrect Answer. Review the correct option and try again"
                   : null,
                hasDetailedExplanation: plan.hasDetailedFeedback ?? false
            }
        }
        if(request.questionType === QuestionType.DESCRIPTIVE){
            const result = await this._evaluationService.evaluateDescriptive({question: question.description, candidateAnswer: request.descriptiveAnswer ?? ''})
            logger.info(result, 'from usecase')
            await this.updatePracticeState(candidate, result.isCorrect)
            return {
                isCorrect: result.isCorrect,
                feedback: canViewFeedback ? result.feedback : null,
                hasDetailedExplanation: plan.hasDetailedFeedback ?? false
            }
        }
        if(request.questionType === QuestionType.CODING){
            const result = await this._evaluationService.evaluateCoding({language: request.codingAnswer?.language ?? CodingLanguage.JAVASCRIPT, code: request.codingAnswer?.sourceCode ?? '', functionName: question.functionName ?? '', testCase: (question.testCases ?? []).map((tc) => ({
                input: tc.input ?? [],
                expectedOutput: tc.expectedOutput ?? ""
            })),})
            logger.info(result, 'from usecase')
            await this.updatePracticeState(candidate, result.isCorrect)
            return {
                isCorrect: result.isCorrect,
                feedback: canViewFeedback ? result.feedback : null,
                hasDetailedExplanation: plan.hasDetailedFeedback ?? false
            }
        }
        throw new AppError(questionMessages.error.QUESTION_NOT_FOUND, statusCode.BAD_REQUEST)
    }

    private async updatePracticeState(candidate: CandidateEntity, isCorrect: boolean): Promise<void> {
        candidate.practiceQuestionCount = ( candidate.practiceQuestionCount?? 0 )+ 1
        if(isCorrect){
            candidate.correctPracticeAnswers = (candidate.correctPracticeAnswers ?? 0 ) + 1
        }
        await this._candidateRepository.update(candidate.id, candidate)
    }
}