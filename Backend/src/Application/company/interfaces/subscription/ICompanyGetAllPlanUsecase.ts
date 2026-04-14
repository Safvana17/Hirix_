import { CompanyGetAllPlanInputDTO, CompanyGetAllPlanOutputDTO } from "../../dtos/subscription/company.getAll.plan.dto";

export interface ICompanyGetAllPlanUsecase {
    execute(request: CompanyGetAllPlanInputDTO): Promise<CompanyGetAllPlanOutputDTO>
}