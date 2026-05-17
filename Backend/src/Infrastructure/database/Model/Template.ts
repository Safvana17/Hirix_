import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { NotificationChannel, TemplateFieldPurpose, TemplateFieldType } from "../../../Domain/enums/notification";


export interface ITemplate extends Document{
    _id: Types.ObjectId;
    key: string;
    name: string;
    channel: NotificationChannel;
    fields: {
        id: string
        name: string
        label: string
        type: TemplateFieldType
        required: boolean
        purpose?: TemplateFieldPurpose
        placeholder?: string
        order: number
        options?: {
            label: string
            value: string
        }[]
    }[]
    values: Record<string, unknown>
    isActive: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const TemplateFieldOptionSchema = new Schema({
    label: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    }
}, {
    _id: false
})

const TemplateFieldSchema =new Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required:  true
    },
    label: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        enum: [ "SUBJECT", "TITLE", "BODY", "FOOTER", "CTA_BUTTON", "OTP_LABEL", "EXPIRY_TEXT", "SUPPORT_TEXT", "CUSTOM" ]
    },
    type: {
        type: String,
        enum: ["text", "textarea", "button", "number", "dropdown", "checkbox"],
        required: true
    },
    required: {
        type: Boolean,
        required: true
    },
    order: {
        type: Number,
        required: true
    },
    options: {
        type: [TemplateFieldOptionSchema],
        default: undefined
    }
}, {
    _id: false
})
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
    fields: {
       type: [TemplateFieldSchema],
       default: []
    },
    values: {
        type: Schema.Types.Mixed,
        default: {}
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
})

export const TemplateModel: Model<ITemplate> = mongoose.model<ITemplate>('Template', TemplateSchema)