import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { TestStatus } from "../../../Domain/enums/Test";

export interface ITest extends Document {
    _id: Types.ObjectId
    name: string
    companyId: Types.ObjectId
    jobRoleId: Types.ObjectId
    description: string
    startTime: Date
    endTime: Date
    rules: string[]
    testStatus: TestStatus
}

const TestSchema: Schema<ITest> = new Schema({
    name: {
        type: String
    },
    companyId: {
        type: Types.ObjectId,
        ref: 'Company'
    },
    jobRoleId: {
        type: Types.ObjectId,
        ref: 'JobRole'
    },
    description:{
        type: String
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    rules: {
        type: [String]
    },
    testStatus: {
        type: String,
    }
}, {
    timestamps: true
})

export const TestModel: Model<ITest> = mongoose.model('Test', TestSchema)