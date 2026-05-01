import { CompanyGetAllTestInputDTO, CompanyGetAllTestOututDTO } from "../../dtos/test/company.getAllTest.dto";

export interface ICompanyGetAllTestUsecase {
    execute(request: CompanyGetAllTestInputDTO): Promise<CompanyGetAllTestOututDTO>
}