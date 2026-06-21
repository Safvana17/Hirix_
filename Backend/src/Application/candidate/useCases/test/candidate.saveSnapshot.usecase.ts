import { AppError } from "../../../../Domain/errors/app.error";
import { ITestRepository } from "../../../../Domain/repositoryInterface/iTest.repository";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { TestMessages } from "../../../../Shared/constsnts/messages/testMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { CandidateSaveSnapshotInputDTO, CandidateSaveSnapshotOutputDTO } from "../../dtos/test/candidate.saveSnapshot.dto";
import { ICandidateSaveSnapshotUsecase } from "../../interfaces/test/ICandidate.saveSnapshot.usecase";

export class CandidateSaveSnapshotUsecase implements ICandidateSaveSnapshotUsecase {
    constructor (
        private _testCandidateRepository: ITestCandidateRepository,
        private _testRepository: ITestRepository,
    ) {}

    async execute(request: CandidateSaveSnapshotInputDTO): Promise<CandidateSaveSnapshotOutputDTO> {
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
        const test = await this._testRepository.findById(candidate.testId)
        if(!test){
            throw new AppError(TestMessages.error.TEST_NOT_FOUND, statusCode.NOT_FOUND)
        }

        if((candidate.snapshots?.length ?? 0) >= test.rules.proctoring.targetSnapshotCount) {
            throw new AppError(TestMessages.error.SNAPSHOT_COUNT_EXCEEDED, statusCode.BAD_REQUEST)
        }

        candidate.snapshots?.push({
            key: request.key,
            capturedAt: new Date()
        })

        await this._testCandidateRepository.update(candidate.id, candidate)

        return {
            success: true
        }
    }
}