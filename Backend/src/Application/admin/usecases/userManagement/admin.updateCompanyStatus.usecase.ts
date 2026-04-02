import { UserStatus } from "../../../../Domain/enums/userStatus.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { UpdataStatusInputDTO, UpdateStatusOutputDTO } from "../../dtos/userManagement/updateStatus.admin.dto";
import { IAdminUpdateCompanyStatusUsecase } from "../../interfaces/userManagement/iAdmin.updateCompanyStatus.usecase";

export class AdminUpdateCompanyStatus implements IAdminUpdateCompanyStatusUsecase {
    constructor (
        private _companyRepository: ICompanyRepository
    ) {}

    /**
     * 
     * @param request - company id and status
     * @returns - return company id, role and status
     */
    async execute(request: UpdataStatusInputDTO): Promise<UpdateStatusOutputDTO> {
        const company = await this._companyRepository.findById(request.id)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const isBlocked = request.status === 'blocked'
        company.setBlocked(isBlocked)
        company.setStatus(isBlocked ? UserStatus.BLOCKED : UserStatus.ACTIVE)
        await this._companyRepository.update(request.id, company)

        return {
                id: company.getId(),
                status: isBlocked ? UserStatus.BLOCKED : UserStatus.ACTIVE,
                role: company.getRole()
        }
    }
}