import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { ITestRepository } from "../../../../Domain/repositoryInterface/iTest.repository";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CompanyGetAllTestInputDTO, CompanyGetAllTestOututDTO } from "../../dtos/test/company.getAllTest.dto";
import { ICompanyGetAllTestUsecase } from "../../interfaces/test/ICompany.getAllTest.usecase";

export class CompanyGetAllTestUsecase implements ICompanyGetAllTestUsecase {
    constructor(
        private _testRepository: ITestRepository,
        private _companyRepository: ICompanyRepository,
        private _testCandidateRepository: ITestCandidateRepository,
    ) {}

    async execute(request: CompanyGetAllTestInputDTO): Promise<CompanyGetAllTestOututDTO> {
        const company = await this._companyRepository.findById(request.companyId)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }
        const { data, totalPages, totalCount } = await this._testRepository.findAllFiltered(request)
        const tests = await Promise.all(
            data.map(async (d) => ({
                id: d.id,
                name: d.name,
                jobRole: d.jobRole.name,
                startTime: d.startTime,
                endTime: d.endTime,
                durationInMinutes: Math.round((d.endTime.getTime() - d.startTime.getTime()) / 60000 ),
                testStatus: d.testStatus,
                candidatesCount: await this._testCandidateRepository.countByTestIds(d.id),
            }))
        )
        return{
            tests,
            totalCount,
            totalPages
        }
    }
}