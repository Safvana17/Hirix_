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
import { UnifiedGetInterviewAccessInputDTO, UnifiedGetInterviewAccessOutputDTO } from "../dtos/unified.getInterviewAccess.dto";
import { ICandidateLeftInterviewRoomUsecase } from "../interfaces/ICandidate.leftInterview.usecase";

export class CandidateLeftInterviewRoomUsecase implements ICandidateLeftInterviewRoomUsecase {
    constructor(
        private _interviewRepository: IInterviewRepository,
        private _companyRepository: ICompanyRepository,
        private _jobRoleRepository: IJobRepository
    ) {}

    async execute(request: UnifiedGetInterviewAccessInputDTO): Promise<UnifiedGetInterviewAccessOutputDTO> {
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
        if(request.token === interview.interviewerToken){
            throw new AppError(InterviewMessages.error.INTERVIEWER_CANNOT_LEAVE, statusCode.BAD_REQUEST)
        }

        interview.isCandidateInRoom = false
        await this._interviewRepository.update(interview.id, interview)
        return {
            id: interview.id,
            name: interview.name,
            description: interview.description,
            candidateName: interview.candidateName,
            interviewerName: interview.interviewerName,
            status: InterviewJoinStatus.READY,
            role: userRole.Candidate,
            round: interview.round,
            jobRole: jobRole.name,
            startTime: interview.scheduledStartTime.toLocaleString(),
            endTime: interview.scheduledEndTime.toLocaleString(),
            companyName: company.getName()
        }
    }
}