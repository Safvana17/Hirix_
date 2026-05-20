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

  async evaluateCoding(input: { functionName: string; language: CodingLanguage; code: string; testCase: { input: unknown[]; expectedOutput: string; }[]; maxMarks: number; }): Promise<{ isCorrect: boolean; marksObtained: number; feedback: string; }> {
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
      const args = testCase.input ?? []
      const serializeArgs = args.map((arg) => JSON.stringify(arg)).join(",")
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
            You are a fair technical exam evaluator.
            Evaluate the candidate answer based on the question, candidateAnswer, and maxMarks.
Very important scoring rule:
- Do NOT give 0 marks if the candidate answer contains any relevant technical idea.
- Give 0 only if the answer is empty, completely unrelated, random, or meaningless.
- If the answer has at least one correct relevant point, give at least 1 mark.
- If the answer is partially correct but incomplete, give partial marks.
- Spelling mistakes, grammar mistakes, or simple wording issues should NOT make the mark 0.
- For beginner-level answers, reward correct core understanding even if the explanation is incomplete.
- Full marks only if the answer is complete, accurate, and well explained.

Scoring guide:
- 0 marks: empty, irrelevant, or completely wrong.
- 1 mark: at least one correct relevant point.
- 25% of maxMarks: basic understanding.
- 50% of maxMarks: partially correct with important missing details.
- 75% of maxMarks: mostly correct with small gaps.
- 100% of maxMarks: complete and accurate.

isCorrect rule:
- isCorrect should be true only when the answer is mostly correct.
- Partial answers can receive marks even if isCorrect is false.

Return ONLY valid JSON:
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
const parsedMarks = Number(parsed.marksObtained) || 0;

let marksObtained = Math.min(
  Math.max(parsedMarks, 0),
  input.maxMarks
);

const answerText = input.candidateAnswer.trim();
const feedback = parsed.feedback || "No feedback provided";

const positiveFeedback =
  feedback.toLowerCase().includes("good") ||
  feedback.toLowerCase().includes("correct") ||
  feedback.toLowerCase().includes("basic") ||
  feedback.toLowerCase().includes("partial") ||
  feedback.toLowerCase().includes("relevant") ||
  feedback.toLowerCase().includes("understanding");

const negativeFeedback =
  feedback.toLowerCase().includes("irrelevant") ||
  feedback.toLowerCase().includes("completely wrong") ||
  feedback.toLowerCase().includes("empty") ||
  feedback.toLowerCase().includes("meaningless");

if (
  marksObtained === 0 &&
  answerText.length > 10 &&
  positiveFeedback &&
  !negativeFeedback
) {
  marksObtained = 1;
}

return {
  marksObtained,
  isCorrect: marksObtained >= Math.ceil(input.maxMarks * 0.6),
  feedback,
};
    }
}