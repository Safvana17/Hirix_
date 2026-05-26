import { CompanyGetAllInterviewsInputDTO, CompanyGetAllInterviewsOutputDTO } from "../../dtos/interview/company.getAllInterviews.dto";

export interface ICompanyGetAllInterviewsUsecase{
    execute(request: CompanyGetAllInterviewsInputDTO): Promise<CompanyGetAllInterviewsOutputDTO>
}