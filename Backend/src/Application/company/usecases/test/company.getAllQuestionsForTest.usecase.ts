import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { IQuestionRepository } from "../../../../Domain/repositoryInterface/iQuestion.repository";
import { ISubscriptionRepository } from "../../../../Domain/repositoryInterface/iSubscription.repository";
import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CompanyGetAllQuestionsForTestInputDTO, CompanyGetAllQuestionsForTestOutputDTO } from "../../dtos/test/company.getTestQuestions.dto";
import { ICompanyGetQuestionsForTest } from "../../interfaces/test/ICompany.getQuestionsForTest.usecase";

export class CompanyGetAllQuestionsForTest implements ICompanyGetQuestionsForTest {
    constructor(
        private _questionRepository: IQuestionRepository,
        private _companyRepository: ICompanyRepository,
        private _subscriptionRepository: ISubscriptionRepository,
        private _subscriptionPlanRepository: ISubscriptionPlanRepository,
    ) {}

    async execute(request: CompanyGetAllQuestionsForTestInputDTO): Promise<CompanyGetAllQuestionsForTestOutputDTO> {
        const company = await this._companyRepository.findById(request.companyId)
        if(!company) {
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const subscription = await this._subscriptionRepository.findCurrentByUserId(company.id)
        if(!subscription){
            throw new AppError(subscriptionPlanMessages.error.CANNOT_FIND_SUBCRIPTION_DETAILS, statusCode.NOT_FOUND)
        }

        const currentPlan = await this._subscriptionPlanRepository.findById(subscription.planId)
        if(!currentPlan){
            throw new AppError(subscriptionPlanMessages.error.NOT_FOUND, statusCode.NOT_FOUND)
        }

        let isIncludeCompany: boolean
        if(currentPlan.price === 0){
            isIncludeCompany = false
        }else{
            isIncludeCompany = true
        }

        const { questions } = await this._questionRepository.findAllForTest({ companyId: company.id, category: request.category, type: request.type, difficulty: request.difficulty, includeCompany: isIncludeCompany})
        return {
            questions
        }
    }
}