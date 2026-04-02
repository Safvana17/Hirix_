import { UserStatus } from "../../../../Domain/enums/userStatus.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IMailService } from "../../../interface/service/IMailService";
import { AdminApproveCompanyInputDTO, UpdateStatusOutputDTO } from '../../dtos/userManagement/updateStatus.admin.dto'
import { IAdminApproveCompanyUsecase } from "../../interfaces/userManagement/iAdmin.approveCompany.usecase";


export class AdminApproveCompanyUsecase implements IAdminApproveCompanyUsecase {
    constructor(
         private _companyRepository: ICompanyRepository,
         private _mailService: IMailService
    ) {}

    /**
     * 
     * @param request - company id and approve flag for approving company register
     * @returns - company id, role and status
     */
    async execute(request: AdminApproveCompanyInputDTO): Promise<UpdateStatusOutputDTO> {
        const company = await this._companyRepository.findById(request.id)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }
        company.setStatus(UserStatus.ACTIVE)
        company.setIsAdminVerified(true)
        await this._companyRepository.update(request.id, company)

        await this._mailService.sendApprovalEmail(company.getEmail(), company.getName())
        return {
            id: company.getId(),
            role: company.getRole(),
            status: company.getStatus()
        }
    }
}