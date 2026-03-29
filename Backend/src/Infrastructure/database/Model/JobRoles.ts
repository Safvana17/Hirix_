import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IJobRoles extends Document{
    id: Types.ObjectId;
    name: string;
    skills: string[];
    experienceMin: number;
    experienceMax: number;
    openings: number;
    isDeleted: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date
}

const JobRolesSchema: Schema<IJobRoles> = new Schema({
    name: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        default: []
    },
    experienceMin: {
        type: Number,
        default: 0
    },
    experienceMax: {
        type: Number,
        default: 0
    },
    openings: {
        type: Number,
        default: 1
    },
    isActive: {
        type: Boolean,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

export const JobRolesModel: Model<IJobRoles> = mongoose.model<IJobRoles>('JobRoles', JobRolesSchema)