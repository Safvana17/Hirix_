import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { UploadProfileImageInputDTO, UpdateCompanyProfileOutputDTO } from "../../dtos/settings/settings.company.dto";
import { IUploadCompanyProfileImage } from "../../interfaces/settings/iCompany.uploadProfileImage.usecase";
import { settingsMessages } from "../../../../Shared/constsnts/messages/settingsMessages";
import { IS3Service } from "../../../interface/service/IS3Service";


export class UploadCompanyProfileImageUsecase implements IUploadCompanyProfileImage {
    constructor (
        private _companyRepository: ICompanyRepository,
        private _s3Service: IS3Service
    ) {}

    async execute(request: UploadProfileImageInputDTO): Promise<UpdateCompanyProfileOutputDTO> {
        const company = await this._companyRepository.findById(request.id)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const file = request.file
        const folder = 'profileLogo'
        const key = await this._s3Service.uploadFile(folder, file.buffer!, file.originalName!, file.mimetype!)
        
        
        // company.profileLogoKey = key
        // company.profileLogoFileName = file.originalName
        // company.profileLogoContentType = file.mimetype
        //const imageUrl = `http://${env.AWS_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`
        company.profileLogo = key
    
        const updated = await this._companyRepository.update(company.getId(), company)

        if(!updated){
            throw new AppError(settingsMessages.error.FAILED_TO_UPDATE_IMAGE, statusCode.SERVER_ERROR)
        }
        return {
            company: updated
        }

    }
}