import { CompanyCreateTestOutputDTO, CompanyPublishTestInputDTO } from "../../dtos/test/company.createTest.dto";

export interface ICompanyPublishTestUsecase {
    execute(request: CompanyPublishTestInputDTO): Promise<CompanyCreateTestOutputDTO>
}