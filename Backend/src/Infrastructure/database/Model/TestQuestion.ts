import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { QuestionSource } from "../../../Domain/enums/Test";
import QuestionType from "../../../Domain/enums/questionType";

export interface ITestQuestion extends Document{
    _id: Types.ObjectId
    source: QuestionSource
    type: QuestionType
    title: string
    order: number
    mark: number
    questionId: Types.ObjectId
    description: string
    testCase: string[]
    options: string[]
    answer: string
}

const TestQuestionSchema: Schema<ITestQuestion> = new Schema({
    source: {
        type: String,
        enum: Object.values(QuestionSource)
    },
    type: {
        type:String,
        enum: Object.values(QuestionType)
    },
    title: {
        type: String
    },
    order: {
        type: Number
    },
    mark: {
        type: Number,
        default: 1
    },
    questionId: {
        type: Types.ObjectId,
        ref: "Question"
    },
    description: {
        type: String
    },
    testCase: {
        type: [String]
    },
    options: {
        type: [String]
    },
    answer: {
        type: String
    }
}, {
    timestamps: true
})

export const TestQuestionModel: Model<ITestQuestion> = mongoose.model('TestQuestion', TestQuestionSchema)