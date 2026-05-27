import { CompanyRescheduleInterviewInputDTO, CompanyRescheduleInterviewOutputDTO } from "../../dtos/interview/company.rescheduleInterview.dto";

export interface ICompanyRescheduleInterviewUsecase {
    execute(request: CompanyRescheduleInterviewInputDTO): Promise<CompanyRescheduleInterviewOutputDTO>
}