import { CompanyCandidateStatusDistributionInputDTO, CompanyCandidateStatusDistributionOutputDTO } from "../../dtos/analytics/company.candidateStatusDistribution.dto";

export interface ICompanyCandidateStatusDistributionUsecase {
    execute(request: CompanyCandidateStatusDistributionInputDTO): Promise<CompanyCandidateStatusDistributionOutputDTO>
}