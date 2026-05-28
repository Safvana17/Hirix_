import { CompanyGetInterviewByIdInputDTO, CompanyGetInterviewByIdOutputDTO } from "../../dtos/interview/company.getInterviewById.dto";

export interface ICompanyGetInterviewByIdUsecase {
    execute(request: CompanyGetInterviewByIdInputDTO): Promise<CompanyGetInterviewByIdOutputDTO>
}