import { InterviewEntity } from "../../../../Domain/entities/Interview";
import { ActivityAction } from "../../../../Domain/enums/activityLog";
import { InterviewStatus } from "../../../../Domain/enums/interview";
import { NotificationEvents } from "../../../../Domain/enums/notification";
import { CandidatePipelineStatus } from "../../../../Domain/enums/Test";
import userRole from "../../../../Domain/enums/userRole.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import { IActivityLogRepository } from "../../../../Domain/repositoryInterface/IActivityLog.repository";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { IInterviewRepository } from "../../../../Domain/repositoryInterface/iInterview.repository";
import { IJobRepository } from "../../../../Domain/repositoryInterface/iJobRoles.repository";
import { ITestRepository } from "../../../../Domain/repositoryInterface/iTest.repository";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { env } from "../../../../Infrastructure/config/env";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { InterviewMessages } from "../../../../Shared/constsnts/messages/interviewMessages";
import { JobRoleMessages } from "../../../../Shared/constsnts/messages/jobRolesMessages";
import { TestMessages } from "../../../../Shared/constsnts/messages/testMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IAdminProcessNotificationUsecase } from "../../../admin/interfaces/settings/IAdmin.processNotification.usecase";
import { ITokenService } from "../../../interface/service/ITokenService";
import { CompanyScheduleInterviewInputDTO, CompanyScheduleInterviewOutputDTO } from "../../dtos/interview/company.scheduleInterview.dto";
import { ICompanyScheduleInterviewUsecase } from "../../interfaces/interview/ICompany.scheduleInterview.usecase";

export class CompanyScheduleInterviewUsecase implements ICompanyScheduleInterviewUsecase {
    constructor(
        private _companyRepository: ICompanyRepository,
        private _testRepository: ITestRepository,
        private _testCandidateRepository: ITestCandidateRepository,
        private _jobRoleRepository: IJobRepository,
        private _interviewRepository: IInterviewRepository,
        private _tokenService: ITokenService,
        private _processNotificationUsecase: IAdminProcessNotificationUsecase,
        private _activityLogRepository: IActivityLogRepository,
    ) {}

    async execute(request: CompanyScheduleInterviewInputDTO): Promise<CompanyScheduleInterviewOutputDTO> {
        const company = await this._companyRepository.findById(request.companyId)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }
        const test = await this._testRepository.findById(request.testId)
        if(!test){
            throw new AppError(TestMessages.error.TEST_NOT_FOUND, statusCode.NOT_FOUND)
        }
        const jobRole = await this._jobRoleRepository.findById(request.jobRoleId)
        if(!jobRole){
            throw new AppError(JobRoleMessages.error.JOBROLE_NOT_FOUND, statusCode.NOT_FOUND)
        }
        const candidate = await this._testCandidateRepository.findById(request.testCandidateId)
        if(!candidate){
            throw new AppError(TestMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }
        
        const allowdStatusRules = [CandidatePipelineStatus.SHORTLISTED, CandidatePipelineStatus.INTERVIEW_SELECTED]
        if(!allowdStatusRules.includes(candidate.selectionStatus!)){
            throw new AppError(InterviewMessages.error.CANNOT_SCHEDULE_INTERVIEW_FOR_NOT_SHORTLISTED_CANDIDATE, statusCode.BAD_REQUEST)
        }

        const now = new Date()
        if(request.startTime.getTime() <= now.getTime()){
            throw new AppError(InterviewMessages.error.INVALID_SATRT_TIME, statusCode.BAD_REQUEST)
        }
        if(request.startTime.getTime() >= request.endTime.getTime()){
            throw new AppError(InterviewMessages.error.INVALID_END_TIME, statusCode.BAD_REQUEST)
        }

        const existing = await this._interviewRepository.findScheduledInterview(request.testCandidateId, request.round)
        if(existing){
            throw new AppError(InterviewMessages.error.ALREADY_SCHEDULED, statusCode.BAD_REQUEST)
        }

        const interviewerToken = this._tokenService.generateInterviewToken()
        const candidateToken = this._tokenService.generateInterviewToken()
        const roomId = this._tokenService.generateRoomId()

        const interview = new InterviewEntity(
            '',
            request.name,
            request.description,
            request.interviewerEmail,
            request.interviewerName,
            request.candidateEmail,
            request.candidateName,
            request.testId,
            request.jobRoleId,
            request.companyId,
            request.round,
            request.startTime,
            request.endTime,
            InterviewStatus.SCHEDULED,
            interviewerToken,
            candidateToken,
            roomId,
            candidate.id
        )
        
        const savedInterview = await this._interviewRepository.create(interview)
        await this._activityLogRepository.create({
            id: '',
            actorId: company.id,
            actorType: userRole.Company,
            action: ActivityAction.INTERVIEW_SCHEDULED,
            targetId: savedInterview.id,
            targetType: 'Interview',
            title: `${savedInterview.name} was scheduled by ${company.getName()} `
        })

        candidate.selectionStatus = CandidatePipelineStatus.INTERVIEW_SCHEDULED
        candidate.currentInterviewRound = savedInterview.round
        candidate.lastInterviewId = savedInterview.id
        await this._testCandidateRepository.update(candidate.id, candidate)

        await this._processNotificationUsecase.execute({
            event: NotificationEvents.INVITE_CANDIDATE_INTERVIEW,
            recipients: [{
                recipientType: userRole.Candidate,
                recipientId: savedInterview.testCandidateId,
                email: savedInterview.candidateEmail
            }],
            variables: {
                candidateName: candidate.name!,
                jobRole: jobRole.name,
                startTime: savedInterview.scheduledStartTime.toLocaleString(),
                endTime: savedInterview.scheduledEndTime.toLocaleString(),
                companyName: company.getName(),
                interviewerName: savedInterview.interviewerName,
                joinLink: `${env.FRONTEND_URL}/interview/${savedInterview.roomId}/${savedInterview.candidateToken}`
            }
        })
        await this._processNotificationUsecase.execute({
            event: NotificationEvents.INVITE_INTERVIWER,
            recipients: [{
                recipientType: userRole.Company,
                email: savedInterview.interviewerEmail
            }],
            variables: {
                interviewerName: savedInterview.interviewerName!,
                candidateName: savedInterview.candidateName,
                jobRole: jobRole.name,
                startTime: savedInterview.scheduledStartTime.toLocaleString(),
                endTime: savedInterview.scheduledEndTime.toLocaleString(),
                companyName: company.getName(),
                joinLink: `${env.FRONTEND_URL}/interview/${savedInterview.roomId}/${savedInterview.interviewerToken}`
            }
        })
        return {
            interview: savedInterview
        }
    }
}