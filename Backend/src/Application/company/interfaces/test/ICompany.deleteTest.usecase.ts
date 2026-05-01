import { CompanyDeleteTestInputDTO, CompanyDeleteTestOutputDTO } from "../../dtos/test/company.deleteTest.dto";

export interface ICompanyDeleteTestUsecase {
    execute(request: CompanyDeleteTestInputDTO): Promise<CompanyDeleteTestOutputDTO>
}