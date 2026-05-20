import { CodingLanguage } from "../../../../Domain/enums/Test"
// import { TestCase } from "../../../../Domain/valueObjects/question.testCase"

export interface CandidateRunCodeInputDTO {
    token: string
    questionId: string
    language: CodingLanguage
    sourceCode: string
}

export interface CanadidateRunCodeOutputDTO {
    // stdout: string
    // stderr: string
    // error: string | null
    // exitCode: number | null
    feedback: string
}