import { CodingLanguage } from "../../../Domain/enums/Test";

export interface ExplanationInput {
    description: string
    options?: string[]
    answer?: string[]
    functionName?: string
    starterCode?: string
    testCases?: {
        input?: unknown[]
        expectedOutput: string
    }[]
}

export interface IPracticeEvaluationService{
    evaluateMcq(input: {questionAnswer: string[]; candidateAnswer: string[]}): Promise<boolean>
    evaluateDescriptive(input: {question: string, candidateAnswer: string}): Promise<{isCorrect: boolean; feedback: string}>
    evaluateCoding(input: {
        language: CodingLanguage;
        code: string
        functionName: string
        testCase: {
            input: unknown[]
            expectedOutput: string
        }[]
    }): Promise<{isCorrect: boolean; feedback: string}>
    getExplanation(input: ExplanationInput): Promise<{explanation: string}>
}