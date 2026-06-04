import { ActivityAction } from "../enums/activityLog"
import userRole from "../enums/userRole.enum"

export class ActivityLogEntity {
    id: string
    actorId: string
    actorType: userRole
    action: ActivityAction
    targetId: string
    targetType: string
    title: string
    
    constructor (
        id: string,
        actorId: string,
        actorType: userRole,
        action: ActivityAction,
        targetId: string,
        targetType: string,
        title: string
    ) {
        this.id = id;
        this.actorId = actorId;
        this.actorType = actorType;
        this.action = action;
        this.targetId = targetId;
        this.targetType = targetType;
        this.title = title
    }
}