import { CompanyCancelInterviewInputDTO, CompanyCancelInterviewOutputDTO } from "../../dtos/interview/company.cancelInterview.dto";

export interface ICompanyCancelInterviewUsecase {
    execute(request: CompanyCancelInterviewInputDTO): Promise<CompanyCancelInterviewOutputDTO>
}