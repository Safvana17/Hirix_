import { userStatus } from "../../../../Domain/enums/userStatus.enum";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { GetAllCompaniesOutputDTO } from "../../dtos/userManagement/getAllCompanies.admin.dto";
import { IAdminGetAllCompaniesUsecase } from "../../interfaces/userManagement/iAdmin.getAllCompanies.usecase";

export class AdminGetAllCompaniesUsecase implements IAdminGetAllCompaniesUsecase{
    constructor(
        private _companyRepository: ICompanyRepository
    ) {}

    async exexute(): Promise<GetAllCompaniesOutputDTO[]> {
        const companies = await this._companyRepository.findAll()

        return companies.map(c => ({
            id: c.getId(),
            name: c.getName(),
            email: c.getEmail(),
            status: c.getIsBlocked() ? userStatus.Blocked : userStatus.Active,
            lastActive: new Date()
        }))
    }
}