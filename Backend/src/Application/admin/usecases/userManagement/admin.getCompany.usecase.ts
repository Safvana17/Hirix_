import { UserStatus } from "../../../../Domain/enums/userStatus.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { AdminGetCompanyInputDTO, AdminGetCompanyOutputDTO } from "../../dtos/userManagement/getCompany.admin.dto";
import { IAdminGetCompanyUsecase } from "../../interfaces/userManagement/iAdmin.getCompany.usecase";

export class AdminGetCompanyUsecase implements IAdminGetCompanyUsecase{
    constructor(
        private _companyRepository: ICompanyRepository
    ) {}

    async execute(request: AdminGetCompanyInputDTO): Promise<AdminGetCompanyOutputDTO> {
        const company = await this._companyRepository.findById(request.id)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }
        return {
            id: company.getId(),
            name: company.getName(),
            email: company.getEmail(),
            status: company.getIsBlocked() ? UserStatus.BLOCKED : UserStatus.ACTIVE
        }
    }
}