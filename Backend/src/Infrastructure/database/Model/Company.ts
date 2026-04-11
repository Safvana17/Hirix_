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
    certificateType: 'GST' | 'COI';
    certificate: string;
    certificateNumber: string;
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
    isProfileUpdated: boolean;
    isDeleted: boolean;
    deleteReason: string;
    deleteFeedback: string;
    deletedAt: Date | null;
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
    certificateType: {
        type: String,
        default: 'GST'
    },
    certificate: {
        type: String
    },
    certificateNumber: {
        type: String
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
    isProfileUpdated: {
        type: Boolean,
        default: false
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
        type: Date,
        default: null
    }
}, {
    timestamps: true
})

export const companyModel: Model<ICompany> = mongoose.model<ICompany>('Company', companySchema)