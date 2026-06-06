import { UnifiedInterviewCodeRunnerOutputDTO, UnifiedRunInterviewCodeInpuDTO } from "../dtos/unified.runInterviewCode.dto";

export interface IUnifiedRunInterviewCodeUsecase {
    execute(request: UnifiedRunInterviewCodeInpuDTO): Promise<UnifiedInterviewCodeRunnerOutputDTO>
}