import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { IInterviewRepository } from "../../../../Domain/repositoryInterface/iInterview.repository";
import { ISubscriptionRepository } from "../../../../Domain/repositoryInterface/iSubscription.repository";
import { ISubscriptionPlanRepository } from "../../../../Domain/repositoryInterface/iSubscriptionPlan.repository";
import { ITestRepository } from "../../../../Domain/repositoryInterface/iTest.repository";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { subscriptionPlanMessages } from "../../../../Shared/constsnts/messages/subscriptionPlanMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CompanyGetDashboardSummeryInputDTO, CompanyGetDashboardSummeryOutputDTO } from "../../dtos/analytics/company.getDashboardSummery.dto";
import { ICompanyGetDashboardSummery } from "../../interfaces/analytics/ICompany.getDashboardSummery.usecase";

export class CompanyGetDashboardSummeryUsecase implements ICompanyGetDashboardSummery {
    constructor (
        private _companyRepository: ICompanyRepository,
        private _testRepository: ITestRepository,
        private _interviewRepository: IInterviewRepository,
        private _testCandidateRepository: ITestCandidateRepository,
        private _subscriptionRepository: ISubscriptionRepository,
        private _subscriptionPlanRepository: ISubscriptionPlanRepository,
    ){}

    async execute(request: CompanyGetDashboardSummeryInputDTO): Promise<CompanyGetDashboardSummeryOutputDTO> {
        const company = await this._companyRepository.findById(request.companyId)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }
        const totalTests = await this._testRepository.getTotalTestByCompany(company.id)
        const totalInterviews = await this._interviewRepository.getTotalInterviewsByCompany(company.id)
        const hiredCandidates = await this._testCandidateRepository.getHiredCandidatesByCompany(company.id)
        const currentSubscription = await this._subscriptionRepository.findCurrentByUserId(company.id)
        if(!currentSubscription){
            throw new AppError(subscriptionPlanMessages.error.CANNOT_FIND_SUBCRIPTION_DETAILS, statusCode.NOT_FOUND)
        }
        const plan = await this._subscriptionPlanRepository.findById(currentSubscription.planId)
        if(!plan){
            throw new AppError(subscriptionPlanMessages.error.NOT_FOUND, statusCode.NOT_FOUND)
        }
        return {
            totalTests,
            totalInterviews,
            hiredCandidates,
            currentPlan: plan.planName
        }
    }
}