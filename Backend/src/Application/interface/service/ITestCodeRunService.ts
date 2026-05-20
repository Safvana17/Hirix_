import { CodingLanguage } from "../../../Domain/enums/Test";

export interface ITestCodeRunService{
    runTestCases(input: {functionName: string, language: CodingLanguage, sourceCode: string, testCases: {input?: unknown[], expectedOutput: string}[]}): Promise<{feedback: string}>
}