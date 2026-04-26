import { CompanyStartTrialInputDTO, CompanyStartTrialOutputDTO } from "../../dtos/subscription/company.startTrial.dto";

export interface ICompanyStartTrialUsecase {
    execute(request: CompanyStartTrialInputDTO): Promise<CompanyStartTrialOutputDTO>
}