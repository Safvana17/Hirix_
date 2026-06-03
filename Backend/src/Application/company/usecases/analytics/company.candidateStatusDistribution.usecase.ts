import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CompanyCandidateStatusDistributionInputDTO, CompanyCandidateStatusDistributionOutputDTO } from "../../dtos/analytics/company.candidateStatusDistribution.dto";
import { ICompanyCandidateStatusDistributionUsecase } from "../../interfaces/analytics/ICompany.candidateStatusDistribution.usecase";

export class CompanyCandidateStatusDistributionUsecase implements ICompanyCandidateStatusDistributionUsecase {
    constructor (
        private _testCandidateRepository: ITestCandidateRepository,
        private _companyRepository: ICompanyRepository
    ) {}

    async execute(request: CompanyCandidateStatusDistributionInputDTO): Promise<CompanyCandidateStatusDistributionOutputDTO> {
        const company = await this._companyRepository.findById(request.companyId)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const startDate = new Date()
        startDate.setMonth(startDate.getMonth() - (request.month - 1))
        startDate.setDate(1)
        startDate.setHours(0, 0, 0, 0)

        const statusDistribution = await this._testCandidateRepository.getCandidateStatusDistribution(company.id, startDate)
        return {
            distribution: statusDistribution
        }
    }
}