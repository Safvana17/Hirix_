import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { AdminTestLogInputDTO, AdminTestLogOutputDTO } from "../../dtos/analytics/admin.testLog.dto";
import { IAdminTestLogUsecase } from "../../interfaces/analytics/IAdmin.testLog.usecase";

export class AdminTestLogUsecase implements IAdminTestLogUsecase {
    constructor (
        private _testCandidateRepository: ITestCandidateRepository
    ) {}

    async execute(request: AdminTestLogInputDTO): Promise<AdminTestLogOutputDTO> {
        const { test, totalCount, totalPages } = await this._testCandidateRepository.getTestLog(request)
        return {
            test,
            totalCount,
            totalPages
        }
    }
}