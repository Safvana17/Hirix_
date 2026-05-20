import { CodingLanguage } from "../../../Domain/enums/Test";

export interface IPracticeEvaluationService{
    evaluateMcq(input: {questionAnswer: string[]; candidateAnswer: string[]}): Promise<boolean>
    evaluateDescriptive(input: {question: string, candidateAnswer: string}): Promise<{isCorrect: boolean; feedback: string}>
    evaluateCoding(input: {
        language: CodingLanguage;
        code: string
        functionName: string
        testCase: {
            input: string[]
            expectedOutput: string
        }[]
    }): Promise<{isCorrect: boolean; feedback: string}>
}