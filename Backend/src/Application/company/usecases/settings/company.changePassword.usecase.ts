import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { settingsMessages } from "../../../../Shared/constsnts/messages/settingsMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IHashService } from "../../../interface/service/IHashService";
import { CompanyChangePasswordOutputDTO } from "../../dtos/settings/changePassword.company.dto";
import { CompanyChangePasswordInputDTO } from "../../dtos/settings/settings.company.dto";
import { ICompanyChangePasswordUsecase } from "../../interfaces/settings/iCompany.changePassword.usecase";

export class CompanyChangePasswordUsecase implements ICompanyChangePasswordUsecase{
     constructor(
        private _companyRepository: ICompanyRepository,
        private _hashSetvice: IHashService
     ) {}

     async execute(request: CompanyChangePasswordInputDTO): Promise<CompanyChangePasswordOutputDTO> {
        const company = await this._companyRepository.findById(request.id)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const isMatch = await this._hashSetvice.compare(request.oldPassword, company.getPassword())
        if(!isMatch){
            throw new AppError(settingsMessages.error.INCORRECT_PASSWORD, statusCode.BAD_REQUEST)
        }

        const hashedPassword = await this._hashSetvice.hash(request.newPassword)
        await this._companyRepository.updatePassword(company.id, hashedPassword)

        return {success: true}
     }
}