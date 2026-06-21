import { CandidateTestStatus } from "../../../../Domain/enums/Test";
import { AppError } from "../../../../Domain/errors/app.error";
import { ITestRepository } from "../../../../Domain/repositoryInterface/iTest.repository";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { TestMessages } from "../../../../Shared/constsnts/messages/testMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { ITestCodeRunService } from "../../../interface/service/ITestCodeRunService";
import { CandidateRunCodeInputDTO, CanadidateRunCodeOutputDTO } from "../../dtos/test/candidate.runCode.dto";
import { ICandidateRunCodeUsecase } from "../../interfaces/test/ICandidate.runCode.usecase";

export class CandidateRunCodeUsecase implements ICandidateRunCodeUsecase {
    constructor(
        private _testCandidateRepository: ITestCandidateRepository,
        private _codeRunnerService: ITestCodeRunService,
        private _testRepository: ITestRepository
    ) {}
    
    async execute(request: CandidateRunCodeInputDTO): Promise<CanadidateRunCodeOutputDTO> {
        const candidate = await this._testCandidateRepository.findByToken(request.token)
        if(!candidate){
            throw new AppError(TestMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }
        if(!request.clientSessionToken){
            throw new AppError(TestMessages.error.UNAUTHORIZED, statusCode.UNAUTHORIZED)
        }
        if(candidate.sessionToken !== request.clientSessionToken){
            throw new AppError(TestMessages.error.SESSION_TOKEN_MISMATCHING, statusCode.FORBIDDEN)
        }

        if(candidate.candidateTestStatus !== CandidateTestStatus.IN_PROGRESS){
            throw new AppError(TestMessages.error.CANNOT_RUN_CODE, statusCode.BAD_REQUEST)
        }
        const test = await this._testRepository.findById(candidate.testId)
        if(!test){
            throw new AppError(TestMessages.error.TEST_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const question = test.questions.find((q) => q.id === request.questionId)
        if(!question || !question.testCase){
            throw new AppError(TestMessages.error.QUESTION_NOT_FOUND, statusCode.NOT_FOUND)
        }
        return this._codeRunnerService.runTestCases({
            functionName: question.functionName!,
            language: request.language,
            sourceCode: request.sourceCode,
            testCases: question.testCase
        })
    }
}