import { CompanyTestParticipationTrendInputDTO, CompanyTestParticipationTrendOutputDTO } from "../../dtos/analytics/company.testParticipationTRend";

export interface ICompanyTestParticipationTrendUsecase {
    execute(request: CompanyTestParticipationTrendInputDTO): Promise<CompanyTestParticipationTrendOutputDTO>
}