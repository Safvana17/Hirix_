import { CompanyCreateTestInputDTO, CompanyCreateTestOutputDTO } from "../../dtos/test/company.createTest.dto";

export interface ICompanyCreateTestDraftUsecase {
    execute(request: CompanyCreateTestInputDTO): Promise<CompanyCreateTestOutputDTO>
}