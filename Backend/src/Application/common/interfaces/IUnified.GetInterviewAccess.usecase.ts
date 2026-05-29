import { UnifiedGetInterviewAccessInputDTO, UnifiedGetInterviewAccessOutputDTO } from "../dtos/unified.getInterviewAccess.dto";

export interface IUnifiedGetInterviewAccessUsecase {
    execute(request: UnifiedGetInterviewAccessInputDTO): Promise<UnifiedGetInterviewAccessOutputDTO>
}