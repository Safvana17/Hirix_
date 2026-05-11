import { CompanyEvaluateTestInputDTO, CompanyEvaluateTestOutputDTO } from "../../dtos/test/company.evaluate.Test.dto";

export interface ICompanyEvaluateTestUsecase {
    execute(request: CompanyEvaluateTestInputDTO): Promise<CompanyEvaluateTestOutputDTO>
}