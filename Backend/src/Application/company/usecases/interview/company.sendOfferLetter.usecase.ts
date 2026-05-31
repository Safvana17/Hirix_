import { InterviewStatus } from "../../../../Domain/enums/interview";
import { NotificationEvents } from "../../../../Domain/enums/notification";
import { CandidatePipelineStatus } from "../../../../Domain/enums/Test";
import userRole from "../../../../Domain/enums/userRole.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { IInterviewRepository } from "../../../../Domain/repositoryInterface/iInterview.repository";
import { IJobRepository } from "../../../../Domain/repositoryInterface/iJobRoles.repository";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { InterviewMessages } from "../../../../Shared/constsnts/messages/interviewMessages";
import { JobRoleMessages } from "../../../../Shared/constsnts/messages/jobRolesMessages";
import { TestMessages } from "../../../../Shared/constsnts/messages/testMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IAdminProcessNotificationUsecase } from "../../../admin/interfaces/settings/IAdmin.processNotification.usecase";
import { CompanySendOfferLetterInputDTO, CompanySendOfferLetterOutputDTO } from "../../dtos/interview/company.sendOfferLetter.dto";
import { ICompanySendOfferLetterUsecase } from "../../interfaces/interview/ICompany.sendOfferLetter.usecase";

export class CompanySendOfferLetterUsecase implements ICompanySendOfferLetterUsecase {
    constructor (
        private _interviewRepository: IInterviewRepository,
        private _companyRepository: ICompanyRepository,
        private _jobRoleRepository: IJobRepository,
        private _processNotification: IAdminProcessNotificationUsecase,
        private _testCandidateRepository: ITestCandidateRepository,
    ) {}

    async execute(request: CompanySendOfferLetterInputDTO): Promise<CompanySendOfferLetterOutputDTO> {
        const interview = await this._interviewRepository.findById(request.interviewId)
        if(!interview){
            throw new AppError(InterviewMessages.error.INTERVIEW_NOT_FOUND, statusCode.NOT_FOUND)
        }
        const company = await this._companyRepository.findById(request.companyId)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }
        if(company.id !== interview.companyId){
            throw new AppError(InterviewMessages.error.NOT_OWN_INTERVIEW, statusCode.FORBIDDEN)
        }

        if(interview.interviewStatus !== InterviewStatus.COMPLETED){
            throw new AppError(InterviewMessages.error.CANNOT_UPDATE_RESULT, statusCode.BAD_REQUEST)
        }
        const jobRole = await this._jobRoleRepository.findById(interview.jobRoleId)
        if(!jobRole){
            throw new AppError(JobRoleMessages.error.JOBROLE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const candidate = await this._testCandidateRepository.findById(interview.testCandidateId!)
        if(!candidate){
            throw new AppError(TestMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        candidate.selectionStatus = CandidatePipelineStatus.OFFER_SENT
        await this._testCandidateRepository.update(candidate.id, candidate)
        
        await this._processNotification.execute({
            event: NotificationEvents.SEND_OFFER_LETTER,
            recipients: [{
                recipientType: userRole.Candidate,
                recipientId: interview.testCandidateId,
                email: interview.candidateEmail
            }],
            variables: {
                candidateName: interview.candidateName,
                companyName: company.getName(),
                jobRole: jobRole.name,
            }
        })
        return {
            success: true
        }
    }
}