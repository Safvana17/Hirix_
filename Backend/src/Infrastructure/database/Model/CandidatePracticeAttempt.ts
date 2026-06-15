import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface ICandidatePracticeAttempt extends Document {
    _id: Types.ObjectId
    candidateId: Types.ObjectId
    questionId: Types.ObjectId
    isCorrect: boolean
}

const CandidatePracticeAttemptSchema: Schema<ICandidatePracticeAttempt> = new Schema({
    candidateId: {
        type: Types.ObjectId,
        ref: 'Candidate'
    },
    questionId: {
        type: Types.ObjectId,
        ref: 'Question'
    },
    isCorrect: {
        type: Boolean
    },
}, {
    timestamps: true
})

export const CandidatePracticeAttemptModel: Model<ICandidatePracticeAttempt> = mongoose.model('CandidatePracticeAttempt', CandidatePracticeAttemptSchema)