import { CompanyScheduleInterviewInputDTO, CompanyScheduleInterviewOutputDTO } from "../../dtos/interview/company.scheduleInterview.dto";

export interface ICompanyScheduleInterviewUsecase {
    execute(request: CompanyScheduleInterviewInputDTO): Promise<CompanyScheduleInterviewOutputDTO>
}