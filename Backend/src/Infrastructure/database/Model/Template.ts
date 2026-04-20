import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { NotificationChannel } from "../../../Domain/enums/notification";


export interface ITemplate extends Document{
    _id: Types.ObjectId;
    key: string;
    name: string;
    channel: NotificationChannel;
    subject: string | null;
    title: string | null;
    body: string;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const TemplateSchema: Schema<ITemplate> = new Schema ({
    key: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    channel: {
        type: String,
        enum: ['EMAIL', 'IN_APP'],
        required: true
    },
    subject: {
        type:String,
        default: null
    },
    title: {
        type: String,
        default: null
    },
    body: {
        type: String,
        required: true
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

export const TemplateModel: Model<ITemplate> = mongoose.model<ITemplate>('Template', TemplateSchema)