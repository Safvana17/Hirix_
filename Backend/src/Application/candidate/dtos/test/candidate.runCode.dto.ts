import { CodingLanguage } from "../../../../Domain/enums/Test"

export interface CandidateRunCodeInputDTO {
    token: string
    language: CodingLanguage
    sourceCode: string
    input?: string
}

export interface CanadidateRunCodeOutputDTO {
    stdout: string
    stderr: string
    error: string | null
    exitCode: number | null
}