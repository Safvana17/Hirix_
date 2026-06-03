import { ITestCandidateRepository } from "../../../../Domain/repositoryInterface/iTestCandidate.repository";
import { AdminCandidateParticipationCountInputDTO, AdminCandidateParticipationCountOutputDTO } from "../../dtos/analytics/admin.candidateParticipationCount.dto";
import { IAdminCandidateParticipationTrendUsecase } from "../../interfaces/analytics/IAdmin.candidateParticipationTrend.usecase";

export class AdminCandidateParticipationTrendUsecase implements IAdminCandidateParticipationTrendUsecase {
    constructor (
        private _testCandidateRepository: ITestCandidateRepository
    ) {}

    async execute(request: AdminCandidateParticipationCountInputDTO): Promise<AdminCandidateParticipationCountOutputDTO> {
        const startDate = new Date()
        startDate.setMonth(startDate.getMonth() - (request.month - 1))
        startDate.setDate(1)
        startDate.setHours(0, 0, 0, 0)
        const trend = await this._testCandidateRepository.getCandidateParticipationTrend(startDate)
        return {
            trend
        }
    }
}