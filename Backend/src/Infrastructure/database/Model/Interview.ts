import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { InterviewResult, InterviewStatus } from "../../../Domain/enums/interview";

export interface IInterview extends Document {
    _id: Types.ObjectId
    name: string
    description: string
    companyId: Types.ObjectId
    testId: Types.ObjectId
    jobRoleId: Types.ObjectId
    testCandidateId: Types.ObjectId
    candidateEmail: string
    candidateName: string
    interviewerName: string
    interviewerEmail: string
    roomId: string
    round: number
    scheduledStartTime: Date
    scheduledEndTime: Date
    interviewStatus: InterviewStatus
    result: InterviewResult
    interviewerToken: string
    candidateToken: string
    feedback: string
}

const interviewSchema: Schema<IInterview> = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    companyId: {
        type: Types.ObjectId,
        ref: 'Company'
    },
    testId: {
        type: Types.ObjectId,
        ref: 'Test'
    },
    jobRoleId: {
        type: Types.ObjectId,
        ref: 'JobRole'
    },
    round: {
        type: Number,
        required: true,
        default: 1
    },
    testCandidateId: {
        type: Types.ObjectId,
        ref: 'TestCandidate'
    },
    candidateEmail: {
        type: String,
        required: true
    },
    candidateName: {
        type: String
    },
    interviewerEmail: {
        type: String,
        required: true
    },
    interviewerName: {
        type: String
    },
    roomId: {
        type: String,
        required: true
    },
    interviewStatus: {
        type: String,
        enum: Object.values(InterviewStatus),
        default: InterviewStatus.SCHEDULED,
        required: true
    },
    result: {
        type: String,
        enum: Object.values(InterviewResult),
        default: InterviewResult.PENDING
    },
    scheduledStartTime: {
        type: Date
    },
    scheduledEndTime: {
        type: Date
    },
    interviewerToken: {
        type: String,
        required: true
    },
    candidateToken: {
        type: String,
        required: true
    },
    feedback: {
        type: String
    }
}, {
    timestamps: true
})

export const InterviewModel: Model<IInterview> = mongoose.model('Interview', interviewSchema)