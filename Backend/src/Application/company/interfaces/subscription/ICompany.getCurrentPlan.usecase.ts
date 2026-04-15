import { CompanyGetCurrentPlanInputDTO, CompanyGetCurrentPlanOutputDTO } from "../../dtos/subscription/company.getCurrent.plan.dto";

export interface ICompanyGetCurrentPlanUsecase {
    execute(request: CompanyGetCurrentPlanInputDTO): Promise<CompanyGetCurrentPlanOutputDTO>
}