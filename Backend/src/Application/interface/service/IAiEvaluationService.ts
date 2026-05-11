import { CodingLanguage } from "../../../Domain/enums/Test";

export interface IAiEvaluationService{
    evaluateMcq(input: {questionAnswer: string[]; candidateAnswer: string[]}): Promise<boolean>
    evaluateDescriptive(input: {question: string, candidateAnswer: string, maxMarks: number}): Promise<{marksObtained: number; isCorrect: boolean; feedback: string}>
    // evaluateCoding(input: {
    //     question: string;
    //     language: CodingLanguage;
    //     code: string
    //     output?: string
    //     testCase: {
    //         input: string
    //         output: string
    //     }
    //     maxMarks: number
    // }): Promise<{isCorrect: boolean; marksObtained: number; feedback: string}>
}