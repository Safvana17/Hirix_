import { CodingLanguage } from "../../../Domain/enums/Test";

export interface UnifiedRunInterviewCodeInpuDTO {
    language: CodingLanguage
    sourceCode: string
    input?: string[]
}

export interface UnifiedInterviewCodeRunnerOutputDTO {
    stdout: string
    stderr: string
    error: string | null
    exitCode: number | null
}