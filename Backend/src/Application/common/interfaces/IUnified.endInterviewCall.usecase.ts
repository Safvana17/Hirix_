import { UnifiedEndInterviewInputDTO, UnifiedEndInterviewOutputDTO } from "../dtos/unified.endInterviewCall.dto";

export interface IUnifiedEndInterviewCallUsecase {
    execute(request: UnifiedEndInterviewInputDTO): Promise<UnifiedEndInterviewOutputDTO>
}