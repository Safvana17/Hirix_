import { NotificationEvents } from "../../../../Domain/enums/notification";
import { CandidateSelectionStatus, ValuationStatus } from "../../../../Domain/enums/Test";
import userRole from "../../../../Domain/enums/userRole.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { IJobRepository } from "../../../../Domain/repositoryInterface/iJobRoles.repository";
import { ITestRepository } from "../../../../Domain/repositoryInterface/iTest.repository";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { TestMessages } from "../../../../Shared/constsnts/messages/testMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IAdminProcessNotificationUsecase } from "../../../admin/interfaces/settings/IAdmin.processNotification.usecase";
import { CompanyRejectCandidateInputDTO, CompanyRejectCandidateOutputDTO } from "../../dtos/test/company.rejectCandidate.dto";
import { ICompanyRejectCandidateUsecase } from "../../interfaces/test/ICompany.rejectCandidate.usecase";

export class CompanyRejectCandidateUsecase implements ICompanyRejectCandidateUsecase {
    constructor(
        private _testCandidateRepository: ITestCandidateRepository,
        private _processNotification: IAdminProcessNotificationUsecase,
        private _testRepository: ITestRepository,
        private _companyRepository: ICompanyRepository,
        private _jobRoleRepository: IJobRepository
    ) {}

    async execute(request: CompanyRejectCandidateInputDTO): Promise<CompanyRejectCandidateOutputDTO> {
        const candidate = await this._testCandidateRepository.findById(request.candidateId)
        if(!candidate){
            throw new AppError(TestMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }
        if(candidate.testId !== request.testId){
            throw new AppError(TestMessages.error.TEST_ID_MISMATCH, statusCode.BAD_REQUEST)
        }
        const company = await this._companyRepository.findById(request.companyId)
        if(!company){
            throw new AppError(TestMessages.error.COMPANY_NOT_FOUND, statusCode.BAD_REQUEST)
        }
        const test = await this._testRepository.findById(request.testId)
        if(!test){
            throw new AppError(TestMessages.error.TEST_NOT_FOUND, statusCode.BAD_REQUEST)
        }
        const jobRole = await this._jobRoleRepository.findById(test.jobRoleId)
        if(!jobRole){
            throw new AppError(TestMessages.error.JOB_ROLE_NOT_FOUND, statusCode.NOT_FOUND)
        }
        if(test.companyId !== company.id){
            throw new AppError(TestMessages.error.NOT_ALLOWED, statusCode.FORBIDDEN)
        }
        if(candidate.evaluationStatus !== ValuationStatus.EVALUATED){
            throw new AppError(TestMessages.error.NOT_EVALUATED_CANDIDATE, statusCode.BAD_REQUEST)
        }
        if(candidate.selectionStatus === CandidateSelectionStatus.SHORTLISTED){
            throw new AppError(TestMessages.error.ALREADY_SHORTLISTED, statusCode.BAD_REQUEST)
        }
        candidate.selectionStatus = CandidateSelectionStatus.REJECTED
        await this._testCandidateRepository.update(candidate.id, candidate)

        await this._processNotification.execute({
            event: NotificationEvents.CANDIDATE_REJECTED,
            recipients: [{
                recipientType: userRole.Candidate,
                recipientId: candidate.id,
                email: candidate.email
            }],
            variables: {
                candidateName: candidate.name!,
                companyName: company.getName(),
                jobRole: jobRole.name
            }
        })

        return {
            success: true
        }
    }
}