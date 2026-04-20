import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { NotificationChannel } from "../../../Domain/enums/notification";

export interface INotificationRule extends Document {
    _id: Types.ObjectId;
    event: string;
    channel: NotificationChannel;
    templateKey: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationRuleSchema: Schema<INotificationRule> = new Schema({
    event: {
        type: String,
        required: true,
        trim: true
    },
    channel: {
        type: String,
        enum: ['EMAIL', 'IN_APP'],
        required: true
    },
    templateKey: {
        type: String,
        required: true,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})


export const NotificationRuleModel: Model<INotificationRule> = mongoose.model<INotificationRule>('NotificationRule', NotificationRuleSchema)