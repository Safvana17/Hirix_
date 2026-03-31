import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { UploadProfileImageInputDTO, UpdateCompanyProfileOutputDTO } from "../../dtos/settings/settings.company.dto";
import { IUploadCompanyProfileImage } from "../../interfaces/settings/iCompany.uploadProfileImage.usecase";
import { settingsMessages } from "../../../../Shared/constsnts/messages/settingsMessages";


export class UploadCompanyProfileImageUsecase implements IUploadCompanyProfileImage {
    constructor (
        private _companyRepository: ICompanyRepository
    ) {}

    async execute(request: UploadProfileImageInputDTO): Promise<UpdateCompanyProfileOutputDTO> {
        const company = await this._companyRepository.findById(request.id)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const file = request.file
        const imageUrl = `http://localhost:4000/uploads/${file.filename}`
        
        company.profileLogo = imageUrl
        const updated = await this._companyRepository.update(company.getId(), company)

        if(!updated){
            throw new AppError(settingsMessages.error.FAILED_TO_UPDATE_IMAGE, statusCode.SERVER_ERROR)
        }
        return {
            company: updated
        }

    }
}