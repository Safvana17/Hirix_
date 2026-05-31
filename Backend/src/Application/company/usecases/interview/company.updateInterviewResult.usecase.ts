import { InterviewResult, InterviewStatus } from "../../../../Domain/enums/interview";
import { NotificationEvents } from "../../../../Domain/enums/notification";
import userRole from "../../../../Domain/enums/userRole.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { IInterviewRepository } from "../../../../Domain/repositoryInterface/iInterview.repository";
import { IJobRepository } from "../../../../Domain/repositoryInterface/iJobRoles.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { InterviewMessages } from "../../../../Shared/constsnts/messages/interviewMessages";
import { JobRoleMessages } from "../../../../Shared/constsnts/messages/jobRolesMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IAdminProcessNotificationUsecase } from "../../../admin/interfaces/settings/IAdmin.processNotification.usecase";
import { CompanyUpdateInterviewResultInputDTO, CompanyUpdateInterviewResultOutputDTO } from "../../dtos/interview/company.updateInterviewResult.dto";
import { ICompanyUpdateInterviewResultUsecase } from "../../interfaces/interview/ICompany.updateInterviewResult.usecase";

export class CompanyUpdateInterviewResultUsecase implements ICompanyUpdateInterviewResultUsecase {
    constructor(
        private _interviewRepository: IInterviewRepository,
        private _companyRepository: ICompanyRepository,
        private _processNotification: IAdminProcessNotificationUsecase,
        private _jobRoleRepository: IJobRepository
    ) {}

    async execute(request: CompanyUpdateInterviewResultInputDTO): Promise<CompanyUpdateInterviewResultOutputDTO> {
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

        interview.result = request.result
        interview.feedback = request.feedback

        await this._interviewRepository.update(interview.id, interview)

        if(request.result === InterviewResult.REJECTED){
            await this._processNotification.execute({
                event: NotificationEvents.INTERVIEW_CANDIDATE_REJECTED,
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
        }
        return {
            success: true
        }
    }
}