import { UnifiedJoinInterviewInputDTO, UnifiedJoinInterviewOutputDTO } from "../dtos/unified.joinInterview.dto";

export interface IUnifiedJoinInterviewUsecase {
    execute(request: UnifiedJoinInterviewInputDTO): Promise<UnifiedJoinInterviewOutputDTO>
}