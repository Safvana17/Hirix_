import { InterviewStatus } from "../../../Domain/enums/interview";
import { AppError } from "../../../Domain/errors/app.error";
import { IInterviewRepository } from "../../../Domain/repositoryInterface/iInterview.repository";
import { InterviewMessages } from "../../../Shared/constsnts/messages/interviewMessages";
import { statusCode } from "../../../Shared/Enumes/statusCode";
import { UnifiedEndInterviewInputDTO, UnifiedEndInterviewOutputDTO } from "../dtos/unified.endInterviewCall.dto";
import { IUnifiedEndInterviewCallUsecase } from "../interfaces/IUnified.endInterviewCall.usecase";

export class UnifiedEndInterviewCallUsecase implements IUnifiedEndInterviewCallUsecase {
    constructor (
        private _interviewRepository: IInterviewRepository,
    ) {}

    async execute(request: UnifiedEndInterviewInputDTO): Promise<UnifiedEndInterviewOutputDTO> {
        const interview = await this._interviewRepository.findByRoomId(request.roomId)
        if(!interview){
            throw new AppError(InterviewMessages.error.INTERVIEW_NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(interview.interviewStatus === InterviewStatus.COMPLETED) {
            throw new AppError(InterviewMessages.error.ALREADY_ENDED_INTERVIEW, statusCode.BAD_REQUEST)
        }
        if(interview.interviewerToken !== request.token){
            throw new AppError(InterviewMessages.error.CANNOT_END_CALL, statusCode.BAD_REQUEST)
        }

        interview.endedAt = new Date()
        interview.interviewStatus = InterviewStatus.COMPLETED

        await this._interviewRepository.update(interview.id, interview)

        return {
            id: interview.id,
            name: interview.name,
            description: interview.description,
            candidateEmail: interview.candidateEmail,
            candidateName: interview.candidateName,
            interviewerEmail: interview.interviewerEmail,
            interviewerName:interview.interviewerName,
            candidateToken: interview.candidateToken,
            interviewerToken: interview.interviewerToken,
            scheduledStartTime: interview.scheduledStartTime.toISOString(),
            scheduledEndTime: interview.scheduledEndTime.toISOString(),
            interviewStatus: interview.interviewStatus,
            feedback: interview.feedback,
            result: interview.result,
            roomId: interview.roomId,
            round: interview.round,
            testCandidateId: interview.testCandidateId,
            testId: interview.testId,
            companyId: interview.companyId,
            jobRoleId: interview.jobRoleId
        }
    }
}