import mongoose, { Document, Model, Schema, Types } from "mongoose";
import QuestionType from "../../../Domain/enums/questionType";
import QuestionDifficulty from "../../../Domain/enums/questionDifficulty";
import userRole from "../../../Domain/enums/userRole.enum";
import QuestionVisibility from "../../../Domain/enums/questionVisibility";

export interface IQuestion extends Document {
    _id: Types.ObjectId;
    title: string;
    description: string;
    type: QuestionType;
    options: string[];
    testCases: string[];
    difficulty: QuestionDifficulty;
    categoryId: Types.ObjectId;
    createdBy: userRole;
    createdById: Types.ObjectId | null;
    visibility: QuestionVisibility;
    isPremium: boolean;
    isPractice: boolean;
    isDeleted: boolean;
    answer: string;
    createdAt: Date;
    updatedAt: Date
}

const QuestionSchema: Schema<IQuestion> = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    type: {
        type: String,
        default: QuestionType.MCQ
    },
    options: {
        type: [String],
        default: []
    },
    testCases: {
        type: [String],
        default: []
    },
    difficulty: {
        type: String,
        default: QuestionDifficulty.EASY
    },
    categoryId: {
        type: Types.ObjectId,
        ref: 'Category'
    },
    createdBy: {
        type: String,
        default: userRole.Admin
    },
    createdById: {
        type: Types.ObjectId,
        default: null
    },
    visibility: {
        type: String,
        default: QuestionVisibility.FREE
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    isPractice: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    answer: {
        type: String
    }
},{
    timestamps: true
})

export const QuestionModel: Model<IQuestion> = mongoose.model<IQuestion>('Question', QuestionSchema)