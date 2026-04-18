import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { IQuestionRepository } from "../../../../Domain/repositoryInterface/iQuestion.repository";
import { ISubscriptionRepository } from "../../../../Domain/repositoryInterface/iSubscription.repository";
import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CompanyGetAllQuestionsInputDTO, CompanyPaginatedQuestionDTO } from "../../dtos/question/company.getAllQuestions.dto";
import { ICompanyGetAllQuestionsUsecase } from "../../interfaces/question/iCompany.getAllQuestions.usecase";

export class CompanyGetAllQuestionsUsecase implements ICompanyGetAllQuestionsUsecase {
    constructor (
        private _companyRepository: ICompanyRepository,
        private _questionRepository :IQuestionRepository,
        private _subscriptionRepository: ISubscriptionRepository,
        private _subscriptionPlanRepository: ISubscriptionPlanRepository
    ) {}

    async execute(request: CompanyGetAllQuestionsInputDTO): Promise<CompanyPaginatedQuestionDTO> {
        const company = await this._companyRepository.findById(request.userId)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }
        const currentSubscription = await this._subscriptionRepository.findCurrentByUserId(company.id)
        if(!currentSubscription){
            throw new AppError(subscriptionPlanMessages.error.CANNOT_FIND_SUBCRIPTION_DETAILS, statusCode.NOT_FOUND)
        }
        const currentPlan = await this._subscriptionPlanRepository.findById(currentSubscription.planId)
        if(!currentPlan){
            throw new AppError(subscriptionPlanMessages.error.NOT_FOUND, statusCode.NOT_FOUND)
        }
        if(!currentPlan.canCreateCustomQuestions){
            throw new AppError(subscriptionPlanMessages.error.CANNOT_CREATE_QUESTION, statusCode.FORBIDDEN, 'FEATURE_LOCKED')
        }

        const {data, totalCount, totalPages} = await this._questionRepository.findAllFiltered(request)
        return {
            questions: data,
            totalCount,
            totalPages
        }
    }
}