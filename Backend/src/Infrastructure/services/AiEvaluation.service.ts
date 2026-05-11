import { IAiEvaluationService } from "../../Application/interface/service/IAiEvaluationService";
import Groq from "groq-sdk"
import { env } from "../config/env";
import { AppError } from "../../Domain/errors/app.error";
import { TestMessages } from "../../Shared/constsnts/messages/testMessages";
import { statusCode } from "../../Shared/Enumes/statusCode";


export class AiEvaluationService implements IAiEvaluationService {

  private _client: Groq
  constructor() {
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

  // async evaluateCoding(input: { question: string; language: CodingLanguage; code: string; output?: string; testCase: { input: string; output: string; }; maxMarks: number; }): Promise<{ isCorrect: boolean; marksObtained: number; feedback: string; }> {
    
  // }

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