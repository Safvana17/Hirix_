import mongoose, { Document, Model, Schema, Types } from "mongoose";
import jobRoleStatus from "../../../Domain/enums/jobRoleStatus";

export interface IJobRoles extends Document{
    _id: Types.ObjectId;
    name: string;
    skills: string[];
    experienceMin: number;
    experienceMax: number;
    openings: number;
    isDeleted: boolean;
    isActive: boolean;
    createdById: Types.ObjectId;
    status: jobRoleStatus;
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
    },
    status: {
        type: String,
        default: jobRoleStatus.Active
    },
    createdById: {
        type: Types.ObjectId,
        ref: 'Company'
    }
}, {
    timestamps: true
})

export const JobRolesModel: Model<IJobRoles> = mongoose.model<IJobRoles>('JobRoles', JobRolesSchema)