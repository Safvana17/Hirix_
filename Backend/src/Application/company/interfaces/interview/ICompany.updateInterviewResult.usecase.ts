import { CompanyUpdateInterviewResultInputDTO, CompanyUpdateInterviewResultOutputDTO } from "../../dtos/interview/company.updateInterviewResult.dto";

export interface ICompanyUpdateInterviewResultUsecase {
    execute(request: CompanyUpdateInterviewResultInputDTO): Promise<CompanyUpdateInterviewResultOutputDTO>
}