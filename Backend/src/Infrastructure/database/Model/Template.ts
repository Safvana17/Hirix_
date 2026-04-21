import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { EmailLayoutType, NotificationChannel } from "../../../Domain/enums/notification";


export interface ITemplate extends Document{
    _id: Types.ObjectId;
    key: string;
    name: string;
    channel: NotificationChannel;
    subject: string | null;
    title: string | null;
    body: string;
    footerText?: string;
    ctaText?: string;
    ctaUrl?: string;
    showOtpBox?: boolean;
    otpLabel?: string;
    expiryText?: string;
    supportText?: string;
    layOutType?: EmailLayoutType;
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
    },
    footerText: {
        type: String
    },
    ctaText: {
        type: String
    },
    ctaUrl: {
        type: String
    },
    showOtpBox: {
        type: Boolean,
        default: false
    },
    otpLabel: {
        type: String
    },
    expiryText: {
        type: String
    },
    supportText:{
        type: String
    },
    layOutType:{
        type: String,
        enum: ['COMMON']
    }
}, {
    timestamps: true
})

export const TemplateModel: Model<ITemplate> = mongoose.model<ITemplate>('Template', TemplateSchema)