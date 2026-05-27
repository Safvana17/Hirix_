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
import { CompanyRescheduleInterviewInputDTO, CompanyRescheduleInterviewOutputDTO } from "../../dtos/interview/company.rescheduleInterview.dto";
import { ICompanyRescheduleInterviewUsecase } from "../../interfaces/interview/ICompany.rescheduleInterview.usecase";

export class CompanyRescheduleInterviewUsecase implements ICompanyRescheduleInterviewUsecase {
    constructor(
        private _companyRepository: ICompanyRepository,
        private _interviewRepository: IInterviewRepository,
        private _jobRoleRepository: IJobRepository,
        private _processNotification: IAdminProcessNotificationUsecase
    ) {}

    async execute(request: CompanyRescheduleInterviewInputDTO): Promise<CompanyRescheduleInterviewOutputDTO> {
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

        if(interview.companyId !== company.id) {
            throw new AppError(InterviewMessages.error.NOT_OWN_INTERVIEW, statusCode.FORBIDDEN)
        }

        if(interview.interviewStatus === InterviewStatus.COMPLETED){
            throw new AppError(InterviewMessages.error.CANNOT_RESCHEDULE_INTERVIEW_FOR_COMPLETED, statusCode.BAD_REQUEST)
        }

        if(request.startTime >= request.endTime) {
            throw new AppError(InterviewMessages.error.INVALID_END_TIME, statusCode.BAD_REQUEST)
        }

        if(request.startTime.getTime() <= Date.now()){
            throw new AppError(InterviewMessages.error.INVALID_SATRT_TIME, statusCode.BAD_REQUEST)
        }

        interview.scheduledStartTime = request.startTime
        interview.scheduledEndTime = request.endTime
        await this._interviewRepository.update(interview.id, interview)

        await this._processNotification.execute({
            event: NotificationEvents.RESCHEDULE_INTERVIEW,
            recipients: [{
                recipientType: userRole.Candidate,
                recipientId: interview.testCandidateId,
                email: interview.candidateEmail
            }],
            variables: {
                recipientName: interview.candidateName,
                companyName: company.getName(),
                jobRole: jobRole.name,
                startTime: request.startTime.toLocaleString(),
                endTime: request.endTime.toLocaleString()
            }
        })
        await this._processNotification.execute({
            event: NotificationEvents.RESCHEDULE_INTERVIEW,
            recipients: [{
                recipientType: userRole.Company,
                email: interview.interviewerEmail
            }],
            variables: {
                recipientName: interview.candidateName,
                companyName: company.getName(),
                jobRole: jobRole.name,
                startTime: request.startTime.toLocaleString(),
                endTime: request.endTime.toLocaleString()
            }
        })
    return {
           success: true
        }
    }
}