import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { logger } from "../../../../utils/logging/loger";
import { CompanyTestParticipationTrendInputDTO, CompanyTestParticipationTrendOutputDTO } from "../../dtos/analytics/company.testParticipationTRend";
import { ICompanyTestParticipationTrendUsecase } from "../../interfaces/analytics/ICompany.testParticipationTrend.usecase";

export class CompanyTestParticipationTRendUsecase implements ICompanyTestParticipationTrendUsecase {
    constructor (
        private _companyRepository: ICompanyRepository,
        private _testCandidateRepository: ITestCandidateRepository
    ) {}

    async execute(request: CompanyTestParticipationTrendInputDTO): Promise<CompanyTestParticipationTrendOutputDTO> {
        const company = await this._companyRepository.findById(request.companyId)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }
        const startDate = new Date()
        startDate.setMonth(startDate.getMonth() - (request.month - 1))
        startDate.setDate(1)
        startDate.setHours(0, 0, 0, 0)
        const trend = await this._testCandidateRepository.getTestTrendByCompany(company.id, startDate)

        logger.info(trend, 'from usecase')
        return {
            trend
        }
    }
}