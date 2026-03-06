import { UnifiedGetMeInputDTO, UnifiedGetMeOutputDTO } from "../dtos/unified.getme.dto";

export interface IUnifiedGetMeUsecase{
    execute(request: UnifiedGetMeInputDTO): Promise<UnifiedGetMeOutputDTO>
}