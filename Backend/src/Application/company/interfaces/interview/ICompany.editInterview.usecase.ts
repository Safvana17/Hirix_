import { CompanyEditInterviewInputDTO, CompanyEditInterviewOutputDTO } from "../../dtos/interview/company.editInterview.dto";

export interface ICompanyEditInterviewUsecase {
    execute(request: CompanyEditInterviewInputDTO): Promise<CompanyEditInterviewOutputDTO>
}