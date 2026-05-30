import { InterviewJoinStatus } from "../../../Domain/enums/interview";
import userRole from "../../../Domain/enums/userRole.enum";
import { AppError } from "../../../Domain/errors/app.error";
import ICompanyRepository from "../../../Domain/repositoryInterface/iCompany.repository";
import { IInterviewRepository } from "../../../Domain/repositoryInterface/iInterview.repository";
import { IJobRepository } from "../../../Domain/repositoryInterface/iJobRoles.repository";
import { authMessages } from "../../../Shared/constsnts/messages/authMessages";
import { InterviewMessages } from "../../../Shared/constsnts/messages/interviewMessages";
import { JobRoleMessages } from "../../../Shared/constsnts/messages/jobRolesMessages";
import { statusCode } from "../../../Shared/Enumes/statusCode";
import { UnifiedJoinInterviewInputDTO, UnifiedJoinInterviewOutputDTO } from "../dtos/unified.joinInterview.dto";
import { IUnifiedJoinInterviewUsecase } from "../interfaces/IUnified.joinUnterview.usecase";

export class UnifiedJoinInterviewUsecase implements IUnifiedJoinInterviewUsecase {
    constructor (
        private _interviewRepository: IInterviewRepository,
        private _companyRepository: ICompanyRepository,
        private _jobRoleRepository: IJobRepository
    ) {}

    async execute(request: UnifiedJoinInterviewInputDTO): Promise<UnifiedJoinInterviewOutputDTO> {
        const interview = await this._interviewRepository.findByRoomId(request.roomId)
        if(!interview){
            throw new AppError(InterviewMessages.error.INTERVIEW_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const jobRole = await this._jobRoleRepository.findById(interview.jobRoleId)
        if(!jobRole){
            throw new AppError(JobRoleMessages.error.JOBROLE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const company = await this._companyRepository.findById(interview.companyId)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }
        const now = new Date()
        if(interview.scheduledStartTime.getTime() > now.getTime() || interview.scheduledEndTime.getTime() < now.getTime() ){
            throw new AppError(InterviewMessages.error.CANNOT_JOIN_INTERVIEW, statusCode.BAD_REQUEST)
        }

        if(request.token === interview.interviewerToken){
            interview.interviewerJoinedAt = new Date()
            interview.isInterviewerInRoom = true
        }
        if(request.token === interview.candidateToken){
            interview.candidateJoinedAt = new Date()
            interview.isCandidateInRoom = true
        }
        if(interview.isCandidateInRoom && interview.isInterviewerInRoom && !interview.startedAt){
            interview.startedAt = new Date()
        }

        await this._interviewRepository.update(interview.id, interview)
        
        return{
            // id: interview.id,
            // name: interview.name,
            // description: interview.description,
            // interviewerName: interview.interviewerName,
            // candidateName: interview.candidateName,
            // jobRole: jobRole.name,
            // companyName: company.getName(),
            // startTime: interview.scheduledStartTime.toLocaleString(),
            // endTime: interview.scheduledEndTime.toLocaleString(),
            // status: InterviewJoinStatus.LIVE,
            // round: interview.round,
            // role: request.token === interview.interviewerToken ? userRole.Company : userRole.Candidate
            canJoin: true
        }
        
    }
}