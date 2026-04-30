import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { QuestionSource, TestStatus } from "../../../Domain/enums/Test";
import { TestRules } from "../../../Domain/valueObjects/test.rules";
import QuestionType from "../../../Domain/enums/questionType";


export interface ITestQuestion{
    _id: Types.ObjectId
    source: QuestionSource
    type: QuestionType
    title: string
    order: number
    mark: number
    questionId?: Types.ObjectId
    description?: string
    testCase?: string[]
    options?: string[]
    answer?: string
}

export interface ITest extends Document {
    _id: Types.ObjectId
    name: string
    companyId: Types.ObjectId
    jobRoleId: Types.ObjectId
    description: string
    startTime: Date
    endTime: Date
    rules: TestRules
    questions: ITestQuestion[]
    testStatus: TestStatus
}

const TimingRulesSchema = new Schema({
    durationInMinutes: { 
        type: Number, 
        required: true 
    },
    autoSubmitOnTimeEnd: { 
        type: Boolean, 
        default: true 
    },
    warningBeforeEndInMinutes: { 
        type: Number, 
        default: 5 
    }
},{ 
    _id: false 
})

const NavigationRulesSchema = new Schema({
    allowTabSwitch: { 
        type: Boolean, 
        default: false 
    },
    maxTabSwitchCount: { 
        type: Number, 
        default: 2 
    },
    autoSubmitOnTabViolation: { 
        type: Boolean, 
        default: true 
    },
    shuffleQuestions: { 
        type: Boolean, 
        default: true 
    },
    shuffleOptions: { 
        type: Boolean, 
        default: true 
    },
    allowBackNavigation: { 
        type: Boolean, 
        default: true 
    }
}, { 
    _id: false 
})

const ProctoringRulesSchema = new Schema({
    enableCamera: { 
        type: Boolean, 
        default: false 
    },
    captureSnapshots: { 
        type: Boolean, 
        default: false 
    },
    snapshotIntervalSeconds: { 
        type: Number, 
        default: 30 
    },
    detectNoFace: { 
        type: Boolean, 
        default: false 
    },
    detectMultipleFaces: { 
        type: Boolean, 
        default: false 
    },
    maxWarningsAllowed: { 
        type: Number, 
        default: 3 
    },
    autoSubmitOnMaxWarnings: { 
        type: Boolean, 
        default: true 
    }
}, { 
    _id: false 
})

const BehaviorRulesSchema = new Schema({
    enforceFullScreen: { 
        type: Boolean, 
        default: true 
    },
    autoSubmitOnFullScreenExit: { 
        type: Boolean, 
        default: true 
    },
    allowCopyPaste: { 
        type: Boolean, 
        default: false 
    },
    allowRightClick: { 
        type: Boolean, 
        default: false 
    },
    allowKeyboardShortcuts: { 
        type: Boolean, 
        default: false 
    }
}, { 
    _id: false 
})

const AutoSaveRulesSchema = new Schema({
    enabled: { 
        type: Boolean, 
        default: true 
    },
    intervalInSeconds: { 
        type: Number, 
        default: 10 
    },
    saveOnEveryAnswer: { 
        type: Boolean, 
        default: true 
    }
}, { 
    _id: false 
})

const TestRulesSchema = new Schema({
    timing: { 
        type: TimingRulesSchema, 
        required: true 
    },
    navigation: { 
        type: NavigationRulesSchema, 
        required: true 
    },
    proctoring: { 
        type: ProctoringRulesSchema, 
        required: true 
    },
    behavior: { 
        type: BehaviorRulesSchema, 
        required: true 
    },
    autoSave: { 
        type: AutoSaveRulesSchema, 
        required: true 
    }
}, { 
    _id: false 
})

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
    _id: true
})

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
        type: TestRulesSchema,
        required: true
    },
    questions: {
        type: [TestQuestionSchema],
        default: []
    },
    testStatus: {
        type: String,
    }
}, {
    timestamps: true
})

export const TestModel: Model<ITest> = mongoose.model('Test', TestSchema)