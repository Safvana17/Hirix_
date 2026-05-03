import { CompanyResheduleTestInputDTO, CompanyResheduleTestOutputDTO } from "../../dtos/test/company.resheduleTest.dto";

export interface ICompanyResheduleTestUsecase {
    execute(request: CompanyResheduleTestInputDTO): Promise<CompanyResheduleTestOutputDTO>
}