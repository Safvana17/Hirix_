import { CodingLanguage } from "../../../Domain/enums/Test";

export interface CodeRunnerRequest {
    language: CodingLanguage
    sourceCode: string
    input?: string[]
}

export interface CodeRunnerResult {
    stdout: string
    stderr: string
    error: string | null
    exitCode: number | null
}

export interface ICodeRunnerService {
    runCode(request: CodeRunnerRequest): Promise<CodeRunnerResult>
}