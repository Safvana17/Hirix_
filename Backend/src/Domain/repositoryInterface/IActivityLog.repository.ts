import { ActivityLogEntity } from "../entities/ActivityLog.entity";
import { IBaseRepository } from "./iBase.repository";

export interface IActivityLogRepository extends IBaseRepository<ActivityLogEntity> {
    findAllFiltered(query: {page: number, limit: number}): Promise<{logs: ActivityLogEntity[]; totalCount: number; totalPages: number}>
}