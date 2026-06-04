import mongoose, { Document, Model, Schema, Types } from "mongoose";
import userRole from "../../../Domain/enums/userRole.enum";
import { ActivityAction } from "../../../Domain/enums/activityLog";

export interface IActivityLog extends Document {
    _id: Types.ObjectId
    actorId: Types.ObjectId
    actorType: userRole
    action: ActivityAction
    targetId: Types.ObjectId
    targetType: string
    title: string
    createdAt: Date
}

const activityLogSchema: Schema<IActivityLog> = new Schema({
    actorId: {
        type: Types.ObjectId,
        required: true
    },
    actorType: {
        type: String,
        enum: Object.values(userRole),
        required: true
    },
    action: {
        type: String,
        enum: Object.values(ActivityAction),
        required: true
    },
    targetId: {
        type: Types.ObjectId,
        required: true
    },
    targetType: {
       type: String,
       required: true 
    },
    title: {
        type: String,
        required: true

    },
}, {
    timestamps: true
})

export const ActivityLogModel: Model<IActivityLog> = mongoose.model<IActivityLog>('ActivityLog', activityLogSchema)