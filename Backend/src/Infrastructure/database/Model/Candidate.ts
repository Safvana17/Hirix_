import mongoose, { Document, Model, Schema, Types } from "mongoose";
import userRole from "../../../Domain/enums/userRole.enum";
import { UserStatus } from "../../../Domain/enums/userStatus.enum";



export interface ICandidate extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: userRole;
    status: UserStatus;
    googleId: string;
    refreshToken: string[];
    isBlocked: boolean;
    isVerified: boolean;
}

const candidateSchema: Schema<ICandidate> = new Schema ({
    name: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        required: true,
        default: userRole.Candidate,
        enum: Object.values(userRole)
    },
    googleId: {
        type: String
    },
    status: {
       type: String,
       default: UserStatus.PENDING
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: [String],
        default: []
    },
    isVerified: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

export const candidateModel: Model<ICandidate> = mongoose.model<ICandidate>('Candidate', candidateSchema)