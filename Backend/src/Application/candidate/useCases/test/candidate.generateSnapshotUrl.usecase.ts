import { AppError } from "../../../../Domain/errors/app.error";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { TestMessages } from "../../../../Shared/constsnts/messages/testMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IS3Service } from "../../../interface/service/IS3Service";
import { CandidateGenerateSnapshotUrlInputDTO, CandidateGenerateSnapshotUrlOutputDTO } from "../../dtos/test/candidate.generateSnapshotUploadUrl.dto";
import { ICandidateGenereateSnapshotUrlUsecase } from "../../interfaces/test/ICandidate.generateSnapshotUrl.usecase";

export class CandidateGenerateSnapshotUrlUsecase implements ICandidateGenereateSnapshotUrlUsecase {
    constructor(
        private _testCandidateRepository: ITestCandidateRepository,
        private _s3Service: IS3Service
    ) {}

    async execute(request: CandidateGenerateSnapshotUrlInputDTO): Promise<CandidateGenerateSnapshotUrlOutputDTO> {
        const candidate = await this._testCandidateRepository.findByToken(request.token)
        if(!candidate){
            throw new AppError(TestMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }
        const { uploadUrl, key } = await this._s3Service.generateUploadUrl({
            folder: "candidate-snapshots",
            fileName: request.fileName,
            contentType: request.contentType
        })

        return {
            uploadUrl,
            key
        }
    }
}