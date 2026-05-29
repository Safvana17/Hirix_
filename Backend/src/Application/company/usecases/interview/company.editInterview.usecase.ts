import { InterviewStatus } from "../../../../Domain/enums/interview";
import { NotificationEvents } from "../../../../Domain/enums/notification";
import userRole from "../../../../Domain/enums/userRole.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { IInterviewRepository } from "../../../../Domain/repositoryInterface/iInterview.repository";
import { IJobRepository } from "../../../../Domain/repositoryInterface/iJobRoles.repository";
import { env } from "../../../../Infrastructure/config/env";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { InterviewMessages } from "../../../../Shared/constsnts/messages/interviewMessages";
import { JobRoleMessages } from "../../../../Shared/constsnts/messages/jobRolesMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IAdminProcessNotificationUsecase } from "../../../admin/interfaces/settings/IAdmin.processNotification.usecase";
import { CompanyEditInterviewInputDTO, CompanyEditInterviewOutputDTO } from "../../dtos/interview/company.editInterview.dto";
import { ICompanyEditInterviewUsecase } from "../../interfaces/interview/ICompany.editInterview.usecase";

export class CompanyEditInterviewUsecase implements ICompanyEditInterviewUsecase {
    constructor (
        private _companyRepository: ICompanyRepository,
        private _interviewRepository: IInterviewRepository,
        private _processNotification: IAdminProcessNotificationUsecase,
        private _jobRoleRepository: IJobRepository,
    ) {}

    async execute(request: CompanyEditInterviewInputDTO): Promise<CompanyEditInterviewOutputDTO> {
        const company = await this._companyRepository.findById(request.companyId)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }
        const interview = await this._interviewRepository.findById(request.interviewId)
        if(!interview){
            throw new AppError(InterviewMessages.error.INTERVIEW_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const jobRole = await this._jobRoleRepository.findById(interview.jobRoleId)
        if(!jobRole){
            throw new AppError(JobRoleMessages.error.JOBROLE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(interview.companyId !== company.id){
            throw new AppError(InterviewMessages.error.NOT_OWN_INTERVIEW, statusCode.BAD_REQUEST)
        }
        if(interview.interviewStatus === InterviewStatus.CANCELLED || interview.interviewStatus === InterviewStatus.COMPLETED){
            throw new AppError(InterviewMessages.error.CANNOT_EDIT_INTERVIEW, statusCode.BAD_REQUEST)
        }

        const candidateDetailsChanged = interview.candidateEmail !== request.candidateEmail || interview.candidateName !== request.candidateName
        const interviewerDetailsChanged = interview.interviewerEmail !== request.interviewerEmail || interview.interviewerName !== request.interviewerName

        interview.name = request.name
        interview.description = request.description
        interview.candidateEmail = request.candidateEmail
        interview.candidateName = request.candidateName
        interview.interviewerEmail = request.interviewerEmail
        interview.interviewerName = request.interviewerName

        await this._interviewRepository.update(interview.id, interview)
        
        if(candidateDetailsChanged){
            await this._processNotification.execute({
                event: NotificationEvents.INVITE_CANDIDATE_INTERVIEW,
                recipients: [{
                    recipientType: userRole.Candidate,
                    recipientId: interview.testCandidateId,
                    email: interview.candidateEmail
                }],
                variables: {
                    companyName: company.getName(),
                    jobRole: jobRole.name,
                    candidateName: interview.candidateName,
                    startTime: interview.scheduledStartTime.toLocaleDateString(),
                    endTime: interview.scheduledEndTime.toLocaleDateString(),
                    interviewerName: interview.interviewerName,
                    joinLink: `${env.FRONTEND_URL}/interview/${interview.roomId}/${interview.candidateToken}`
                }
            })
        }

        if(interviewerDetailsChanged){
            await this._processNotification.execute({
                event: NotificationEvents.INVITE_INTERVIWER,
                recipients: [{
                    recipientType: userRole.Candidate,
                    recipientId: interview.testCandidateId,
                    email: interview.candidateEmail
                }],
                variables: {
                    companyName: company.getName(),
                    jobRole: jobRole.name,
                    candidateName: interview.candidateName,
                    startTime: interview.scheduledStartTime.toLocaleDateString(),
                    endTime: interview.scheduledEndTime.toLocaleDateString(),
                    interviewerName: interview.interviewerName,
                    joinLink: `${env.FRONTEND_URL}/interview/${interview.roomId}/${interview.interviewerToken}`
                }
            })
        }
        return {
            success: true
        }
    }
}
