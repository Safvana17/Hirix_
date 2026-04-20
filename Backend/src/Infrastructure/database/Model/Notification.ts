import mongoose, { Document, Model, Schema, Types } from "mongoose";
import userRole from "../../../Domain/enums/userRole.enum";

export interface INotification extends Document {
    _id: Types.ObjectId;
    recipientId: Types.ObjectId;
    recipientType: userRole;
    event: string;
    title: string;
    message: string;
    isRead: boolean;
    metaData: Record<string, string>;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema: Schema<INotification> = new Schema({
    recipientId: {
        type: Types.ObjectId,
        required: true,
    },
    recipientType: {
        type: String,
        enum: ['Admin', 'Company', 'Candidate'],
        required: true
    },
    event: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    metaData: {
        type: Map,
        of: String,
        default: {}
    }
}, {
    timestamps: true
})

export const NotificationModel: Model<INotification> = mongoose.model('Notification', NotificationSchema)