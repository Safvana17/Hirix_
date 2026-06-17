import { UnifiedGetInterviewAccessInputDTO, UnifiedGetInterviewAccessOutputDTO } from "../dtos/unified.getInterviewAccess.dto";

export interface ICandidateLeftInterviewRoomUsecase {
    execute(request: UnifiedGetInterviewAccessInputDTO): Promise<UnifiedGetInterviewAccessOutputDTO>
}