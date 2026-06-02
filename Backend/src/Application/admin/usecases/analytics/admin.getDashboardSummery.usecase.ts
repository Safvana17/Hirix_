import ICandidateRepository from "../../../../Domain/repositoryInterface/iCandidate.repository";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { IPaymentRepository } from "../../../../Domain/repositoryInterface/iPayment.repository";
import { IQuestionRepository } from "../../../../Domain/repositoryInterface/iQuestion.repository";
import { ITestRepository } from "../../../../Domain/repositoryInterface/iTest.repository";
import { AdminDashboardSummeryOutputDTO } from "../../dtos/analytics/admin.dashboardSumery.dto";
import { IAdminGetDashboardSummeryUsecase } from "../../interfaces/analytics/IAdmin.dashboardSummery.usecase";

export class AdminGetDashboardSummeryUsecase implements IAdminGetDashboardSummeryUsecase {
    constructor(
        private _companyRepository: ICompanyRepository,
        private _candidateRepository: ICandidateRepository,
        private _testRepository: ITestRepository,
        private _questionRepository: IQuestionRepository,
        private _paymentRepository: IPaymentRepository
    ) {}

    async execute(): Promise<AdminDashboardSummeryOutputDTO> {
        const totalCompanies = await this._companyRepository.getTotalCompany()
        const totalCandidates = await this._candidateRepository.getTotalCandidates()
        const totalRevenue = await this._paymentRepository.getTotalRevenue()
        const totalQuestions = await this._questionRepository.getTotalQuestions()
        const totalTests = await this._testRepository.getTotalTests()


        return {
            totalCandidates,
            totalCompanies,
            totalRevenue,
            totalQuestions,
            totalTests
        }
    }
}