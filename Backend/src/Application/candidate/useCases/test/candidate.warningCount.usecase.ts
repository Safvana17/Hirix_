import { TestStatus } from "../../../../Domain/enums/Test";
import { AppError } from "../../../../Domain/errors/app.error";
import { ITestRepository } from "../../../../Domain/repositoryInterface/iTest.repository";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { TestMessages } from "../../../../Shared/constsnts/messages/testMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CandidateWarningCountInputDTO, CandidateWarningCountOutputDTO } from "../../dtos/test/candidate.warningCount.dto";
import { ICandidateWarningCountUsecase } from "../../interfaces/test/ICandiate.warningCount.usecase";

export class CandidateWarningCountUsecase implements ICandidateWarningCountUsecase {
    constructor (
        private _testCandidateRepository: ITestCandidateRepository,
        private _testRepository :ITestRepository,
    ) {}

    async execute(request: CandidateWarningCountInputDTO): Promise<CandidateWarningCountOutputDTO> {
        const candidate = await this._testCandidateRepository.findByToken(request.token)
        if(!candidate){
            throw new AppError(TestMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const test = await this._testRepository.findById(candidate.testId)
        if(!test){
            throw new AppError(TestMessages.error.TEST_NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(test.testStatus !== TestStatus.PUBLISHED){
            throw new AppError(TestMessages.error.NOT_PUBLISHED_TEST, statusCode.BAD_REQUEST)
        }

        candidate.warningCount = candidate.warningCount + 1
        await this._testCandidateRepository.update(candidate.id, candidate)

        return {
            success: true,
            warningCount: candidate.warningCount
        }
    }
}