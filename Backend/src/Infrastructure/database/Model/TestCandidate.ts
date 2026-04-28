import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { CandidateTestStatus } from "../../../Domain/enums/Test";
import QuestionType from "../../../Domain/enums/questionType";


export interface ICodingAnswer {
    language: string
    code: string
    output?: string
}

export interface ICandidateAnswer {
    _id: Types.ObjectId
    testQuestionId: Types.ObjectId
    questionType: QuestionType
    timeTakenInSeconds: number
    selectedOptionIds?: string[]
    descriptiveAnswer?: string
    codingAnswer?: ICodingAnswer
    isCorrect?: boolean
    marksObtained?: number
}

export interface ITestCandidate extends Document {
    _id: Types.ObjectId
    testId: Types.ObjectId
    testLink: string
    email: string
    candidateTestStatus: CandidateTestStatus
    warningCount: number
    candidateAnswers: ICandidateAnswer[]
    aiRank: number
    startedAt: Date
    submittedAt: Date
}

const CodingAnswerSchema: Schema<ICodingAnswer> = new Schema({
    language: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    output: {
        type: String
    }
}, {
    _id: false
})

const CandidateAnswerSchema: Schema<ICandidateAnswer> = new Schema({
    testQuestionId: {
        type: Types.ObjectId,
        ref: 'Question',
        required: true
    },
    questionType: {
        type: String,
        enum: Object.values(QuestionType),
        required: true
    },
    timeTakenInSeconds: {
        type: Number,
        required: true,
        default: 0
    },
    selectedOptionIds: {
        type: [String]
    },
    descriptiveAnswer: {
        type: String
    },
    codingAnswer: {
        type: CodingAnswerSchema
    },
    isCorrect: {
        type: Boolean,
    },
    marksObtained: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

const TestCandidateSchema: Schema<ITestCandidate> = new Schema({
    testId: {
        type: Types.ObjectId,
        ref: "Test"
    },
    testLink: {
        type: String
    },
    email: {
        type: String
    },
    candidateTestStatus: {
        type: String,
        enum: Object.values(CandidateTestStatus),
        default: CandidateTestStatus.INVITED,
        required: true
    },
    warningCount: {
        type: Number,
        default: 0
    },
    candidateAnswers: {
        type: [CandidateAnswerSchema],
        default: []
    },
    aiRank: {
        type: Number
    },
    startedAt: {
        type: Date
    },
    submittedAt: {
        type: Date
    }
}, {
    timestamps: true
})

export const TestCandidateModel: Model<ITestCandidate> = mongoose.model('TestCandidate', TestCandidateSchema)