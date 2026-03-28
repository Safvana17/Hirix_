import mongoose, { Document, Model, Schema, Types } from "mongoose";
import userRole from "../../../Domain/enums/userRole.enum";
import { UserStatus } from "../../../Domain/enums/userStatus.enum";


export interface ICompany extends Document {
    _id: Types.ObjectId;
    name: string;
    legalName: string;
    email: string;
    password: string;
    role: userRole;
    status: UserStatus;
    isAdminVerified: boolean;
    googleId: string;
    isBlocked: boolean;
    profileLogo: string
    domain: string;
    teamSize: number;
    about: string;
    phoneNumber: string;
    streetName: string;
    country: string;
    state: string;
    city: string;
    refreshToken: string[];
    isVerified: boolean;
    pinCode: string;
    lastActive: Date;
    website: string;
    primaryContactName: string;
    billingEmail: string;
    isDeleted: boolean;
    deleteReason: string;
    deleteFeedback: string;
    deletedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const companySchema: Schema<ICompany> = new Schema({
    name: {
        type: String,
        required: true,
    },
    legalName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true,
        default: userRole.Company,
        enum: Object.values(userRole)
    },
    status: {
       type: String,
       default: UserStatus.PENDING
    },
    isAdminVerified: {
        type: Boolean,
        default: false
    },
    isBlocked: {
       type: Boolean,
       default: false
    },
    googleId: {
        type: String
    },
    profileLogo: {
       type: String
    },
    domain: {
        type: String
    },
    teamSize: {
        type: Number
    },
    about: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    streetName: {
        type: String
    },
    country: {
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    website: {
        type: String
    },
    primaryContactName: {
        type: String
    },
    billingEmail: {
        type: String
    },
    pinCode: {
        type: String
    },
    refreshToken: {
        type: [String],
        default: []
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deleteFeedback: {
        type: String
    },
    deleteReason: {
        type: String
    },
    deletedAt: {
        type: Date
    }
}, {
    timestamps: true
})

export const companyModel: Model<ICompany> = mongoose.model<ICompany>('Company', companySchema)