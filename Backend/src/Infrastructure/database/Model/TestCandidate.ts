import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { CandidateSelectionStatus, CandidateTestStatus, CodingLanguage, ValuationStatus } from "../../../Domain/enums/Test";
import QuestionType from "../../../Domain/enums/questionType";


export interface ICodingAnswer {
    language: CodingLanguage
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
    totalMarks?: number
    evaluationStatus?: ValuationStatus
    aiFeedback?: string
}

export interface ITestCandidate extends Document {
    _id: Types.ObjectId
    testId: Types.ObjectId
    testToken: string
    name: string
    email: string
    candidateTestStatus: CandidateTestStatus
    selectionStatus: CandidateSelectionStatus
    evaluationStatus: ValuationStatus
    warningCount: number
    candidateAnswers: ICandidateAnswer[]
    aiRank: number
    totalMarks: number
    marksObtained: number
    correctAnswerCount: number
    totalQuestionsCount: number
    totalTimeTakenInSeconds: number
    startedAt: Date
    submittedAt: Date
    evaluatedAt: Date
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
    },
    totalMarks: {
        type: Number,
        default: 0
    },
    evaluationStatus: {
        type: String,
        enum: Object.values(ValuationStatus)
    },
    aiFeedback: {
        type: String
    }
}, {
    timestamps: true
})

const TestCandidateSchema: Schema<ITestCandidate> = new Schema({
    testId: {
        type: Types.ObjectId,
        ref: "Test"
    },
    testToken: {
        type: String
    },
    name: {
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
    },
    selectionStatus: {
        type: String,
        enum: Object.values(CandidateSelectionStatus),
        default: CandidateSelectionStatus.PENDING
    },
    evaluationStatus: {
        type: String,
        enum: Object.values(ValuationStatus),
        default: ValuationStatus.NOT_EVALUATED
    },
    totalMarks:{
        type: Number,
        default: 0
    },
    marksObtained: {
        type: Number,
        default: 0
    },
    correctAnswerCount: {
        type: Number,
        default: 0
    },
    totalQuestionsCount: {
        type:Number,
        default: 0
    },
    evaluatedAt: {
        type: Date
    },
    totalTimeTakenInSeconds: {
        type: Number
    }
}, {
    timestamps: true
})

export const TestCandidateModel: Model<ITestCandidate> = mongoose.model('TestCandidate', TestCandidateSchema)