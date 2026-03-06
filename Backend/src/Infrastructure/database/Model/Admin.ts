import mongoose, { Types, Document, Schema, Model } from "mongoose";
import userRole from "../../../Domain/enums/userRole.enum";


export interface IAdmin extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: userRole;
    refreshTokens: string[];
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date
}

const adminSchema: Schema<IAdmin> = new Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: userRole.Admin,
        enum: Object.values(userRole)
    },
    refreshTokens: {
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

export const adminModel: Model<IAdmin> = mongoose.model<IAdmin>('Admin', adminSchema)