import { userStatus } from "../../../../Domain/enums/userStatus.enum";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { AdminCompanyQueryDTO, AdminPaginatedCompanyDTO } from "../../dtos/userManagement/getAllCompanies.admin.dto";
import { IAdminGetAllCompaniesUsecase } from "../../interfaces/userManagement/iAdmin.getAllCompanies.usecase";

export class AdminGetAllCompaniesUsecase implements IAdminGetAllCompaniesUsecase{
    constructor(
        private _companyRepository: ICompanyRepository
    ) {}

    async exexute(query: AdminCompanyQueryDTO): Promise<AdminPaginatedCompanyDTO> {
        // const companies = await this._companyRepository.findAll()
        const {data, totalPages, totalCount} = await this._companyRepository.findAllFiltered(query)
        return{ 
            companies: data.map(c => ({
                id: c.getId(),
                name: c.getName(),
                email: c.getEmail(),
                status: c.getIsBlocked() ? userStatus.Blocked : userStatus.Active,
                lastActive: new Date()
            })),
            totalPages,
            totalCount
        }
    }
}