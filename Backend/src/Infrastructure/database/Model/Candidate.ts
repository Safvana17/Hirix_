import mongoose, { Document, Model, Schema, Types } from "mongoose";
import userRole from "../../../Domain/enums/userRole.enum";
import { UserStatus } from "../../../Domain/enums/userStatus.enum";
import { CandidateType } from "../../../Domain/enums/candidate";



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
    practiceQuestionCount: number
    correctPracticeAnswers: number
    profilePicture: string
    canidateType: CandidateType
    college: string
    degree: string
    greduationYear: number
    company: string
    designation: string
    yearsOfExperience: number
    skills: string[]
    interestedRoles: string[]
    linkedinUrl: string
    githubUrl: string
    portfolioUrl: string
    attendedQuestionIds: string[]
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
    },
    correctPracticeAnswers: {
        type: Number,
    },
    practiceQuestionCount: {
        type: Number
    },
    profilePicture: {
        type: String
    },
    portfolioUrl: {
        type: String
    },
    college:{
        type: String
    },
    degree: {
        type: String
    },
    greduationYear: {
        type: Number
    },
    company: {
        type: String
    },
    designation: {
        type: String
    },
    yearsOfExperience: {
        type: Number
    },
    skills: {
        type: [String]
    },
    interestedRoles: {
        type: [String]
    },
    linkedinUrl: {
        type: String
    },
    githubUrl: {
        type: String
    },
    attendedQuestionIds: {
        type: [String]
    }
},{
    timestamps: true
})

export const candidateModel: Model<ICandidate> = mongoose.model<ICandidate>('Candidate', candidateSchema)