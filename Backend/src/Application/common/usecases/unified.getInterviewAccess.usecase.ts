import { InterviewJoinStatus, InterviewStatus } from "../../../Domain/enums/interview";
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
import { IUnifiedGetInterviewAccessUsecase } from "../interfaces/IUnified.GetInterviewAccess.usecase";

export class UnifiedGetInterviewAccessUsecase implements IUnifiedGetInterviewAccessUsecase {
    constructor (
        private _interviewRepository: IInterviewRepository,
        private _jobRoleRepository: IJobRepository,
        private _companyrepository: ICompanyRepository,
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

        const company = await this._companyrepository.findById(interview.companyId)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        let role
        if(request.token === interview.interviewerToken){
            role = userRole.Company
        }else if(request.token === interview.candidateToken){
            role = userRole.Candidate
        }else {
            throw new AppError(InterviewMessages.error.INVALID_TOKEN, statusCode.BAD_REQUEST)
        }

        let status
        if(interview.interviewStatus === InterviewStatus.CANCELLED){
            status = InterviewJoinStatus.CANCELLED
        }
        if(interview.interviewStatus === InterviewStatus.COMPLETED){
            status = InterviewJoinStatus.COMPLETED
        }else{
            const now = new Date()
            if(interview.scheduledStartTime.getTime() > now.getTime()){
                status = InterviewJoinStatus.WAITING
            }else if(interview.scheduledEndTime.getTime() < now.getTime()){
                status = InterviewJoinStatus.EXPIRED
            }else{
                status = InterviewJoinStatus.LIVE
            }
        }

        return {
            id: interview.id,
            name: interview.name,
            description: interview.description,
            candidateName: interview.candidateName,
            interviewerName: interview.interviewerName,
            status,
            role,
            round: interview.round,
            jobRole: jobRole.name,
            startTime: interview.scheduledStartTime.toLocaleString(),
            endTime: interview.scheduledEndTime.toLocaleString(),
            companyName: company.getName()
        }

    }
}