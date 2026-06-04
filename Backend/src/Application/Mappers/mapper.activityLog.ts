import { Types } from "mongoose";
import { ActivityLogEntity } from "../../Domain/entities/ActivityLog.entity";
import { IActivityLog } from "../../Infrastructure/database/Model/ActivityLog";

export class ActivityLogMapper {
    static mapToEntity(doc: IActivityLog): ActivityLogEntity {
        const log = new ActivityLogEntity(
            doc._id.toString(),
            doc.actorId.toString(),
            doc.actorType,
            doc.action,
            doc.targetId.toString(),
            doc.targetType,
            doc.title,
        )

        log.createdAt = doc.createdAt
        
        return log
    }

    static mapToPersistance(entity: ActivityLogEntity){
        return {
            actorId: new Types.ObjectId(entity.actorId),
            actorType: entity.actorType,
            action: entity.action,
            targetId: new Types.ObjectId(entity.targetId),
            targetType: entity.targetType ,
            title: entity.title
        }
    }
}