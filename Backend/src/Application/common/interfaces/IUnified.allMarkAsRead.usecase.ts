import { UnifiedMarkAllAsReadInoutDTO } from "../dtos/unified.markAllAsRead.dto";

export interface IUnifiedMarkAllAsReadUsecase {
    execute(request: UnifiedMarkAllAsReadInoutDTO): Promise<void>
}