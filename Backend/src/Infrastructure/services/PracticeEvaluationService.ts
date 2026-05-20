import { IPracticeEvaluationService } from "../../Application/interface/service/IPracticeEvaluationService";
import Groq from "groq-sdk"
import { env } from "../config/env";
import { AppError } from "../../Domain/errors/app.error";
import { TestMessages } from "../../Shared/constsnts/messages/testMessages";
import { statusCode } from "../../Shared/Enumes/statusCode";
import { ICodeRunnerService } from "../../Application/interface/service/IcodeRunnerService";
import { CodingLanguage } from "../../Domain/enums/Test";


export class PracticeEvaluationService implements IPracticeEvaluationService {

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

  async evaluateCoding(input: {language: CodingLanguage; code: string; functionName: string; testCase: { input: string[]; expectedOutput: string; }[]}): Promise<{ isCorrect: boolean; feedback: string; }> {
    const totalTestCases = input.testCase.length
    if(!input.functionName.trim()) {
      return {
        isCorrect: false,
        feedback: "Function name is missing"
      }
    }
    if(totalTestCases === 0){
      return {
        isCorrect: false,
        feedback: "No test cases available for evaluation"
      }
    }
    let passedCount = 0
    for(const testCase of input.testCase){
      const serializeArgs = testCase.input.map((arg) => JSON.stringify(arg)).join(",")
      let executableCode = input.code
      if(input.language === CodingLanguage.JAVASCRIPT){
        executableCode = `
        ${input.code}

        const result = ${input.functionName}(${serializeArgs});
        console.log(typeof result === "object" ? JSON.stringify(result) : result)
        `
      }
      const result = await this._codeRunner.runCode({
        language: input.language,
        sourceCode: executableCode,

      })
      const actualOutput = result.stdout.trim()
      const expectedOutput = testCase.expectedOutput.trim()
      if(actualOutput === expectedOutput){
        passedCount++
      }
    }
    return {
      isCorrect: passedCount === totalTestCases,
      feedback: `${passedCount}/${totalTestCases} test cases passed`
    }
  }

  async evaluateDescriptive(input: { question: string; candidateAnswer: string;}): Promise<{ isCorrect: boolean; feedback: string; }> {
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
            Evaluate whether the candidate answer is meaningfully correct for the given question.
            Rules:
              -Do not use marks.
              -Do not mention marks.
              -Estimate how much of the expected answer is covered as a percentage from 0 to 100.
              -If the answer covers 35% or more of the expected answer, isCorrect should be true.
              -If the answer covers less than 35%, isCorrect should be false
              -If the answer is empty, unrelated, or too vague, isCorrect should be false.
              -Feedback should explain what is correct and what is missing.
              -Feedback should be helpful for learning.
              -Return only valid JSON.
              -No markdown.
              -No explanation outside JSON.

              JSON format: 
                {
                  "isCorrect": boolean,
                  "feedback": string,
                  "missingPoints": string[],
                  coveragePercentage": number
                 }
          `,
        }, {
           role: "user",
           content: JSON.stringify({
              question: input.question,
              candidateAnswer: input.candidateAnswer,
              evaluationCriteria: [
                "relevance to the question",
                "conceptual correctness",
                "clarity of explanation",
                "coverage of important points"
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
        isCorrect: boolean
        feedback: string
        coveragePercentage: number
        missingPoints: string[]
      }
      const coveragePercentage = Math.min(Math.max(Number(parsed.coveragePercentage) || 0, 0), 100)
      const isCorrect = coveragePercentage >= 35
      const missingText = parsed.missingPoints && parsed.missingPoints.length > 0 
           ? `You are missing: ${parsed.missingPoints.join(", ")}`
           : ""

      return {
        isCorrect,
        feedback: parsed.feedback || `Your answer covers about ${coveragePercentage}% of the expected answer. ${missingText}`
      }
    }
}