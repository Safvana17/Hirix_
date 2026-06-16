import { AppError } from "../../../../Domain/errors/app.error";
import { ITestRepository } from "../../../../Domain/repositoryInterface/iTest.repository";
import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { TestMessages } from "../../../../Shared/constsnts/messages/testMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IS3Service } from "../../../interface/service/IS3Service";
import { CompanyViewSnapshotInputDTO, CompanyViewSnapshotOutputDTO } from "../../dtos/test/company.viewSnapshots.dto";
import { ICompanyViewSnapshotsUsecase } from "../../interfaces/test/ICompany.viewSnapshots.usecase";

export class CompanyViewSnapshotsUsecase implements ICompanyViewSnapshotsUsecase {
    constructor (
        private _testRepository: ITestRepository,
        private _testCandidateRepository: ITestCandidateRepository,
        private _s3Service: IS3Service
    ) {}

    async execute(request: CompanyViewSnapshotInputDTO): Promise<CompanyViewSnapshotOutputDTO> {
        const test = await this._testRepository.findById(request.testId)
        if(!test){
            throw new AppError(TestMessages.error.TEST_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const candidate = await this._testCandidateRepository.findById(request.candidateId)
        if(!candidate){
            throw new AppError(TestMessages.error.CANDIDATE_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const snapshots = await Promise.all(
            (candidate.snapshots ?? []).map( async (snapshot) => ({
                capturedAt: snapshot.capturedAt,
                url: await this._s3Service.generateViewUrl(snapshot.key)
            }))
        )
        return {
            snapshots
        }
    }
}