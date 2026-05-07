import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { IJobRepository } from "../../../../Domain/repositoryInterface/iJobRoles.repository";
import { ITestRepository } from "../../../../Domain/repositoryInterface/iTest.repository";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { TestMessages } from "../../../../Shared/constsnts/messages/testMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CandidateGetTestByTokenInputDTO, CandidateGetTestByTokenOutputDTO } from "../../dtos/test/candidate.getTestByToken.dto";
import { ICandidateGetTestByTokenUsecase } from "../../interfaces/test/ICandidate.getTestByToken.usecase";

export class CandidateGetTestByTokenUsecase implements ICandidateGetTestByTokenUsecase {
    constructor(
        private _testCandidateRepository: ITestCandidateRepository,
        private _testRepository: ITestRepository,
        private _companyRepository: ICompanyRepository,
        private _jobRoleRepository: IJobRepository
    ) {}

    async execute(request: CandidateGetTestByTokenInputDTO): Promise<CandidateGetTestByTokenOutputDTO> {
        const candidate = await this._testCandidateRepository.findByToken(request.token)
        if(!candidate){
            throw new AppError(TestMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const test = await this._testRepository.findById(candidate.testId)
        if(!test){
            throw new AppError(TestMessages.error.TEST_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const company = await this._companyRepository.findById(test.companyId)
        if(!company){
            throw new AppError(TestMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }
        const jobRole = await this._jobRoleRepository.findById(test.jobRoleId)
        if(!jobRole){
            throw new AppError(TestMessages.error.JOB_ROLE_NOT_FOUND, statusCode.NOT_FOUND)
        }
        return {
            id: test.id,
            name: test.name,
            description: test.description,
            startTime: test.startTime,
            endTime: test.endTime,
            companyName: company.getName(),
            jobrole: jobRole.name,
            rules: test.rules,
            questions: test.questions,
            testStatus: test.testStatus,
        }
    }
}