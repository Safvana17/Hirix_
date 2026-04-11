import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { settingsMessages } from "../../../../Shared/constsnts/messages/settingsMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { UpdateCompanyProfileInputDTO, UpdateCompanyProfileOutputDTO } from "../../dtos/settings/settings.company.dto";
import { ICompanyUpdateProfileUsecase } from "../../interfaces/settings/iCompany.updateProfile.usecase";

export class UpdateCompanyProfileUsecase implements ICompanyUpdateProfileUsecase {
    constructor(
        private _companyRepository: ICompanyRepository
    ) {}

    async execute(request: UpdateCompanyProfileInputDTO): Promise<UpdateCompanyProfileOutputDTO> {
        const company = await this._companyRepository.findById(request.id)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(request.certificateType === 'GST' && !request.certificateNumber){
            throw new AppError(settingsMessages.error.GST_NUMBER_REQUIRED, statusCode.BAD_REQUEST)
        }

        const certificateFile = request.certificateFile
        const certificateUrl = `http://localhost:4000/uploads/${certificateFile.filename}`

        company.setName(request.name!)
        company.legalName = request.legalName
        company.domain = request.domain
        company.website = request.website
        company.teamSize = request.teamSize
        company.about = request.about
        company.phoneNumber = request.phoneNumber
        company.streetName = request.streetName
        company.country = request.country
        company.state = request.state
        company.city = request.city
        company.pinCode = request.pinCode
        company.setEmail(request.primaryContactEmail!)
        company.primaryContactName = request.primaryContactName
        company.billingEmail = request.billingEmail
        company.isProfileUpdated = true
        company.certificateType = request.certificateType
        company.certificate = certificateUrl
        company.certificateNumber = request.certificateNumber

        
        const updatedCompany = await this._companyRepository.update(company.getId(), company)
        if(!updatedCompany){
            throw new AppError(settingsMessages.error.UPDATE_COMPANY_FAILED, statusCode.SERVER_ERROR)
        }

        return {
            company: updatedCompany
        }
    }
}