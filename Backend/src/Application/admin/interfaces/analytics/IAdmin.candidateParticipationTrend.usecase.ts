import { AdminCandidateParticipationCountInputDTO, AdminCandidateParticipationCountOutputDTO } from "../../dtos/analytics/admin.candidateParticipationCount.dto";

export interface IAdminCandidateParticipationTrendUsecase {
    execute(request: AdminCandidateParticipationCountInputDTO): Promise<AdminCandidateParticipationCountOutputDTO>
}