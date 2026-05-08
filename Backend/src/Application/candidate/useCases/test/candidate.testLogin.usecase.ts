import { CandidateTestStatus } from "../../../../Domain/enums/Test";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { IJobRepository } from "../../../../Domain/repositoryInterface/iJobRoles.repository";
import { ITestRepository } from "../../../../Domain/repositoryInterface/iTest.repository";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { JobRoleMessages } from "../../../../Shared/constsnts/messages/jobRolesMessages";
import { TestMessages } from "../../../../Shared/constsnts/messages/testMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CandidateTestLoginInputDTO, CandidateTestLoginOutputDTO } from "../../dtos/test/candidate.testLogin.dto";
import { ICandidateTestLoginUsecase } from "../../interfaces/test/ICandidate.testLogin.usecase";

export class CandidateTestLoginUsecase implements ICandidateTestLoginUsecase {
    constructor (
        private _testCandidateRepository: ITestCandidateRepository,
        private _testRepository: ITestRepository,
        private _companyRepository: ICompanyRepository,
        private _jobRoleRepository: IJobRepository
    ) {}

    async execute(request: CandidateTestLoginInputDTO): Promise<CandidateTestLoginOutputDTO> {
        const candidate = await this._testCandidateRepository.findByToken(request.token)
        if(!candidate){
            throw new AppError(TestMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }
        if(candidate.email !== request.email){
            throw new AppError(TestMessages.error.WRONG_EMAIL, statusCode.BAD_REQUEST)
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
            throw new AppError(JobRoleMessages.error.JOBROLE_NOT_FOUND, statusCode.NOT_FOUND)
        }
        candidate.name = request.name
        candidate.candidateTestStatus = CandidateTestStatus.VERIFIED
        await this._testCandidateRepository.update(candidate.id, candidate)

        return {
            test: {
              id: test.id,
              name: test.name,
              description: test.description,
              startTime: test.startTime,
              endTime: test.endTime,
              testStatus: test.testStatus,
              questions: test.questions,
              rules: test.rules,
              companyName: company.getName(),
              jobrole: jobRole.name
            },
            candidate
        }
    }
}