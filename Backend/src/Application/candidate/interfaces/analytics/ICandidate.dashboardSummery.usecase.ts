import { CandidateDashboardSummeryInputDTO, CandidateDashboardSummeryOutputDTO } from "../../dtos/analytics/candidate.dashboardSummery.dto";

export interface ICandidateDashboardSummeryUsecase {
    execute(request: CandidateDashboardSummeryInputDTO): Promise<CandidateDashboardSummeryOutputDTO>
}