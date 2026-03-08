import mongoose, { Document, Model, Schema, Types } from "mongoose";
import userRole from "../../../Domain/enums/userRole.enum";

export interface ICompany extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: userRole;
    googleId: string;
    isBlocked: boolean;
    domain: string;
    teamSize: number;
    about: string;
    phone: string;
    streetName: string;
    country: string;
    state: string;
    city: string;
    refreshToken: string[];
    isVerified: boolean;
    pinCode: string;
    createdAt: Date;
    updatedAt: Date;
}

const companySchema: Schema<ICompany> = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: userRole.Company,
        enum: Object.values(userRole)
    },
    isBlocked: {
       type: Boolean,
       default: false
    },
    googleId: {
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
    phone: {
        type: String
    },
    streetName: {
        type: String
    },
    state: {
        type: String
    },
    city: {
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
    }
}, {
    timestamps: true
})

export const companyModel: Model<ICompany> = mongoose.model<ICompany>('Company', companySchema)