import QuestionType from "../../../../Domain/enums/questionType";
import { CandidatePipelineStatus, CandidateTestStatus, CodingLanguage, TestStatus, ValuationStatus } from "../../../../Domain/enums/Test";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { ITestRepository } from "../../../../Domain/repositoryInterface/iTest.repository";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { TestMessages } from "../../../../Shared/constsnts/messages/testMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { ITestEvaluationService } from "../../../interface/service/ITestEvaluationService";
import { ICandidateRankingService } from "../../../interface/service/ICandidateRankingService";
import { CompanyEvaluateTestInputDTO, CompanyEvaluateTestOutputDTO } from "../../dtos/test/company.evaluate.Test.dto";
import { ICompanyEvaluateTestUsecase } from "../../interfaces/test/ICompany.evaluateTest.usecase";

export class CompanyEvaluateTestUsecase implements ICompanyEvaluateTestUsecase {
    constructor (
        private _companyRepository: ICompanyRepository,
        private _testRepository: ITestRepository,
        private _testCandidateRepository: ITestCandidateRepository,
        private _aiEvaluationService: ITestEvaluationService,
        private _candidateRankingService: ICandidateRankingService
    ) {}

    async execute(request: CompanyEvaluateTestInputDTO): Promise<CompanyEvaluateTestOutputDTO> {
        const company = await this._companyRepository.findById(request.companyId)
        if(!company){
            throw new AppError(TestMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }
        const test = await this._testRepository.findById(request.testId)
        if(!test){
            throw new AppError(TestMessages.error.TEST_NOT_FOUND, statusCode.NOT_FOUND)
        }
        if(test.testStatus !== TestStatus.PUBLISHED){
            throw new AppError(TestMessages.error.NOT_PUBLISHED_TEST, statusCode.BAD_REQUEST)
        }

        const candidates = await this._testCandidateRepository.findByTestId(test.id)
        if(!candidates || candidates.length === 0){
            throw new AppError(TestMessages.error.CANDIDATES_NOT_FOUND, statusCode.BAD_REQUEST)
        }

        for(const candidate of candidates){
            if(candidate.candidateTestStatus !== CandidateTestStatus.SUBMITTED) continue
            let totalMarks = 0
            let marksObtained = 0
            let correctAnswerCount = 0

            for(const question of test.questions){
                totalMarks += question.mark
                const candidateAnswer = candidate.candidateAnswers.find((answer) =>
                    answer.testQuestionId === question.id
                )
                if(!candidateAnswer) continue
                if(question.type === QuestionType.MCQ){
                    const isCorrect = await this._aiEvaluationService.evaluateMcq({questionAnswer: question.answer??[], candidateAnswer: candidateAnswer.selectedOptionIds ?? []})
                    candidateAnswer.isCorrect = isCorrect
                    candidateAnswer.marksObtained = isCorrect ? question.mark : 0
                    if(isCorrect) correctAnswerCount++
                    marksObtained += candidateAnswer.marksObtained
                }
                if(question.type === QuestionType.DESCRIPTIVE){
                   const result = await this._aiEvaluationService.evaluateDescriptive({
                    question: question.description ?? question.title,
                    candidateAnswer: candidateAnswer.descriptiveAnswer ?? "",
                    maxMarks: question.mark
                   })

                   candidateAnswer.isCorrect = result.isCorrect
                   candidateAnswer.marksObtained = result.marksObtained
                   candidateAnswer.aiFeedback = result.feedback

                   marksObtained += candidateAnswer.marksObtained
                   if(result.isCorrect) correctAnswerCount++
                }
                if(question.type === QuestionType.CODING){
                   const result = await this._aiEvaluationService.evaluateCoding({
                    functionName: question.functionName!,
                    language: candidateAnswer.codingAnswer?.language ?? CodingLanguage.JAVASCRIPT,
                    code: candidateAnswer.codingAnswer?.code ?? "",
                    testCase: (question.testCase ?? []).map((tc) => ({
                        input: tc.input ?? [],
                        expectedOutput: tc.expectedOutput ?? ""
                    })),
                    maxMarks: question.mark
                   })

                   candidateAnswer.isCorrect = result.isCorrect
                   candidateAnswer.marksObtained = result.marksObtained
                   candidateAnswer.aiFeedback = result.feedback
                   if(result.isCorrect) correctAnswerCount++
                   marksObtained += candidateAnswer.marksObtained
                }
            }
            candidate.totalMarks = totalMarks
            candidate.marksObtained = marksObtained
            candidate.evaluatedAt = new Date()
            candidate.correctAnswerCount = correctAnswerCount
            candidate.selectionStatus = CandidatePipelineStatus.PENDING
            candidate.evaluationStatus = ValuationStatus.EVALUATED

            await this._testCandidateRepository.update(candidate.id, candidate)
        }

       await this._candidateRankingService.rankCandidate(test.id)

        return{
            success: true
        }

    }
}