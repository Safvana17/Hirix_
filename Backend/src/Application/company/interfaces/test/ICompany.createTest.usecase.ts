import { CompanyCreateTestInputDTO, CompanyCreateTestOutputDTO } from "../../dtos/test/company.createTest.dto";

export interface ICompanyCreateTestUsecase {
    execute(request: CompanyCreateTestInputDTO): Promise<CompanyCreateTestOutputDTO>
}