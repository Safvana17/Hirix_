import { InterviewStatus } from "../../../../Domain/enums/interview";
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
import { CompanyCancelInterviewInputDTO, CompanyCancelInterviewOutputDTO } from "../../dtos/interview/company.cancelInterview.dto";
import { ICompanyCancelInterviewUsecase } from "../../interfaces/interview/ICompany.cancelInterview.usecase";

export class CompanyCancelInterviewUsecase implements ICompanyCancelInterviewUsecase {
    constructor(
        private _interviewRepository: IInterviewRepository,
        private _companyRepository: ICompanyRepository,
        private _processNotification: IAdminProcessNotificationUsecase,
        private _jobRoleRepository: IJobRepository
    ) {}

    async execute(request: CompanyCancelInterviewInputDTO): Promise<CompanyCancelInterviewOutputDTO> {
        const company = await this._companyRepository.findById(request.companyId)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }
        const interview = await this._interviewRepository.findById(request.interviewId)
        if(!interview){
            throw new AppError(InterviewMessages.error.INTERVIEW_NOT_FOUND, statusCode.NOT_FOUND)
        }
        if(interview.companyId !== company.id){
            throw new AppError(InterviewMessages.error.NOT_OWN_INTERVIEW, statusCode.BAD_REQUEST)
        }
        if(interview.interviewStatus === InterviewStatus.COMPLETED){
            throw new AppError(InterviewMessages.error.CANNOT_CANCEL_COMPLETED_INERVIEW, statusCode.BAD_REQUEST)
        }

        const jobRole = await this._jobRoleRepository.findById(interview.jobRoleId)
        if(!jobRole){
            throw new AppError(JobRoleMessages.error.JOBROLE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const now = new Date()
        if(interview.scheduledStartTime.getTime() <= now.getTime()){
            throw new AppError(InterviewMessages.error.CANNOT_CANCEL_STARTED_INTERVIEW, statusCode.BAD_REQUEST)
        }

        interview.interviewStatus = InterviewStatus.CANCELLED
        await this._interviewRepository.update(interview.id, interview)

        await this._processNotification.execute({
            event: NotificationEvents.CANCEL_INTERVIEW_INTERVIWER,
            recipients: [{
                recipientType: userRole.Company,
                email: interview.interviewerEmail
            }],
            variables: {
                candidateName: interview.candidateName,
                jobRole: jobRole.name,
                interviewerName: interview.interviewerName,
                startTime: interview.scheduledStartTime.toLocaleDateString(),
                endTime: interview.scheduledEndTime.toLocaleDateString(),
                cancelReason: request.reason,
                companyName: company.getName()
            }
        })

        await this._processNotification.execute({
            event: NotificationEvents.CANCEL_INTERVIEW_CANDIDATE,
            recipients: [{
                recipientType: userRole.Candidate,
                email: interview.candidateEmail
            }],
            variables: {
                candidateName: interview.candidateName,
                jobRole: jobRole.name,
                companyName: company.getName(),
                startTime: interview.scheduledStartTime.toLocaleDateString(),
                endTime: interview.scheduledEndTime.toLocaleDateString(),
                cancelReason: request.reason
            }
        })
        return {
            success: true
        }
    }
}