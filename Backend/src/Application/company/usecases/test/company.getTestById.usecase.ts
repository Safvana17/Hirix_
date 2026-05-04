import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { IJobRepository } from "../../../../Domain/repositoryInterface/iJobRoles.repository";
import { ITestRepository } from "../../../../Domain/repositoryInterface/iTest.repository";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { JobRoleMessages } from "../../../../Shared/constsnts/messages/jobRolesMessages";
import { TestMessages } from "../../../../Shared/constsnts/messages/testMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CompanyGetTestByIDInputDTO, CompanyGetTestByIDOutputDTO } from "../../dtos/test/company.getTestById.dto";
import { ICompanyGetTestByIDUsecase } from "../../interfaces/test/ICompany.getTestById.usecase";

export class CompanyGetTestByIdUsecase implements ICompanyGetTestByIDUsecase {
    constructor (
        private _companyRepository: ICompanyRepository,
        private _testRepository: ITestRepository,
        private _testCandidateRepository: ITestCandidateRepository,
        private _jobRoleRepository: IJobRepository
    ) {}

    async execute(request: CompanyGetTestByIDInputDTO): Promise<CompanyGetTestByIDOutputDTO> {
        const company = await this._companyRepository.findById(request.companyId)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }
        const test = await this._testRepository.findById(request.testId)
        if(!test){
            throw new AppError(TestMessages.error.TEST_NOT_FOUND, statusCode.NOT_FOUND)
        }
        const jobRole = await this._jobRoleRepository.findById(test.jobRoleId)
        if(!jobRole){
            throw new AppError(JobRoleMessages.error.JOBROLE_NOT_FOUND, statusCode.NOT_FOUND)
        }
        const candidates = await this._testCandidateRepository.findByTestId(test.id)
        if(!candidates || candidates.length === 0){
            throw new AppError(TestMessages.error.CANDIDATES_REQUIRED, statusCode.NOT_FOUND)
        }

        return {
            Test: {
                id: test.id,
                name: test.name,
                description: test.description,
                companyName: company.getName(),
                jobrole: jobRole.name,
                startTime: test.startTime,
                endiTime: test.endTime,
                testStatus: test.testStatus,
                questions: test.questions,
                candidates: candidates,
                rules: test.rules
            }
        }
    }
}