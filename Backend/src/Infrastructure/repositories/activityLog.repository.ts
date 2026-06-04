import { QueryFilter } from "mongoose";
import { ActivityLogMapper } from "../../Application/Mappers/mapper.activityLog";
import { ActivityLogEntity } from "../../Domain/entities/ActivityLog.entity";
import { IActivityLogRepository } from "../../Domain/repositoryInterface/IActivityLog.repository";
import { ActivityLogModel, IActivityLog } from "../database/Model/ActivityLog";
import { BaseRepository } from "./base.repository";

export class ActivityRepository extends BaseRepository<ActivityLogEntity, IActivityLog> implements IActivityLogRepository {
    constructor(){
        super(ActivityLogModel)
    }

    async findAllFiltered(query: {startDate: Date; userId?: string; page: number; limit: number; }): Promise<{ logs: ActivityLogEntity[]; totalCount: number; totalPages: number; }> {
        const filter: QueryFilter<IActivityLog> = {
            createdAt: { $gt: query.startDate }
        }

        if(query.userId){
            filter.actorId = query.userId
        }

        const skip = query.limit * ( query.page - 1)
        const document = await this._model.find(filter)
              .sort({createdAt: -1})
              .skip(skip)
              .limit(query.limit)

        const totalCount = await this._model.countDocuments(filter)
        const totalPages = Math.ceil(totalCount/query.limit)
        return {
            logs: document.map(d => this.mapToEntity(d)),
            totalCount,
            totalPages
        }
    }
    protected mapToEntity(doc: IActivityLog): ActivityLogEntity {
        return ActivityLogMapper.mapToEntity(doc)
    }
    protected mapToPersistance(entity: ActivityLogEntity): Partial<IActivityLog> {
        return ActivityLogMapper.mapToPersistance(entity)
    }
}