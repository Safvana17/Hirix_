import { ITestEvaluationService } from "../../Application/interface/service/ITestEvaluationService";
import Groq from "groq-sdk"
import { env } from "../config/env";
import { AppError } from "../../Domain/errors/app.error";
import { TestMessages } from "../../Shared/constsnts/messages/testMessages";
import { statusCode } from "../../Shared/Enumes/statusCode";
import { ICodeRunnerService } from "../../Application/interface/service/IcodeRunnerService";
import { CodingLanguage } from "../../Domain/enums/Test";


export class TestEvaluationService implements ITestEvaluationService {

  private _client: Groq
  constructor(
    private _codeRunner: ICodeRunnerService
  ) {
    this._client = new Groq({
      apiKey: env.GROQ_API_KEY
    })
  }

  async evaluateMcq(input: { questionAnswer: string[]; candidateAnswer: string[]; }): Promise<boolean> {
    if(input.questionAnswer.length !== input.candidateAnswer.length) return false
    const sortedCandidateAnswer = [...input.candidateAnswer].sort()
    const sortedQuestionAnswer = [...input.questionAnswer].sort()
    return sortedQuestionAnswer.every((value, index) => value === sortedCandidateAnswer[index])
  }

  async evaluateCoding(input: {language: CodingLanguage; code: string; testCase: { input: string[]; expectedOutput: string; }[]; maxMarks: number; }): Promise<{ isCorrect: boolean; marksObtained: number; feedback: string; }> {
    const totalTestCases = input.testCase.length
    if(totalTestCases === 0){
      return {
        isCorrect: false,
        marksObtained: 0,
        feedback: "No test cases available for evaluation"
      }
    }

    let passedCount = 0
    for(const testCase of input.testCase){
      const result = await this._codeRunner.runCode({
        language: input.language,
        sourceCode: input.code,
        // input: testCase.input
      })
      const actualOutput = result.stdout.trim()
      const expectedOutput = testCase.expectedOutput.trim()
          console.log("TEST CASE:", testCase)
console.log("STDOUT RAW:", JSON.stringify(result.stdout))
console.log("STDERR RAW:", JSON.stringify(result.stderr))
console.log("ERROR RAW:", result.error)
console.log("EXPECTED RAW:", JSON.stringify(testCase.expectedOutput))
console.log("STDOUT TRIM:", result.stdout.trim())
console.log("EXPECTED TRIM:", testCase.expectedOutput.trim())
      if(actualOutput === expectedOutput){
        passedCount++
      }
    }
    const marksObtained = Math.round((passedCount/totalTestCases) * input.maxMarks)
    return {
      isCorrect: passedCount === totalTestCases,
      marksObtained,
      feedback: `${passedCount}/${totalTestCases} test cases passed`
    }
  }

  async evaluateDescriptive(input: { question: string; candidateAnswer: string; maxMarks: number; }): Promise<{ marksObtained: number; isCorrect: boolean; feedback: string; }> {
    const completion = await this._client.chat.completions.create({
      model: env.GROQ_MODEL || "llama-3.3-70b-versatile",
      temperature: 0.2,
      response_format: {
        type: "json_object"
      },
      messages: [
        {
          role: "system",
          content: `
            You are an exam validator.
            Evaluate the candidate answer fairly.
            Rules:
              -Give marks between 0 and maxMarks only.
              -Do not give extra marks.
              -If answer is empty or irrelevant, marks should be 0.
              -Return only valid JSON.
              -No markdown.
              -No explanation outside JSON.

              JSON format: 
                {
                  "marksObtained": number,
                  "isCorrect": boolean,
                  "feedback": string
                 }
          `,
        }, {
           role: "user",
           content: JSON.stringify({
              question: input.question,
              candidateAnswer: input.candidateAnswer,
              maxMarks: input.maxMarks,
              evaluationCriteria: [
                "relevance",
                "correctness",
                "clarity",
                "completeness"
              ]
           })
        }
      ]
    })

      const content = completion.choices[0]?.message.content
      if(!content){
        throw new AppError(TestMessages.error.AI_EVALUATION_FAILED, statusCode.SERVER_ERROR)
      } 
      const parsed = JSON.parse(content) as {
        marksObtained: number;
        isCorrect: boolean;
        feedback: string
      }
      return {
        marksObtained: Math.min(Math.max(Number(parsed.marksObtained) || 0, 0), input.maxMarks),
        isCorrect: Boolean(parsed.isCorrect),
        feedback: parsed.feedback || "No feedback provided"
      }
    }
}