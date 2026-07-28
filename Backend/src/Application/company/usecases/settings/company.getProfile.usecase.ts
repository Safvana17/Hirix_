import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { logger } from "../../../../utils/logging/loger";
import { IS3Service } from "../../../interface/service/IS3Service";
import { getCompanyProfileInputDTO, getCompanyProfileOutputDTO } from "../../dtos/settings/settings.company.dto";
import { IGetCompanyProfileUsecase } from "../../interfaces/settings/iCompany.getCompany.usecase";

export class GetCompanyProfileUsecase implements IGetCompanyProfileUsecase{
    constructor(
        private _companyRepository: ICompanyRepository,
        private _s3Service: IS3Service
    ) {}

    async execute(request: getCompanyProfileInputDTO): Promise<getCompanyProfileOutputDTO> {
        const company = await this._companyRepository.findById(request.id)
        logger.info({DATA: company}, 'from usecase')
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        let imageurl 
        if(company.profileLogo){
            imageurl = await this._s3Service.generateViewUrl(company.profileLogo)
        }
        // let documentUrl = []
        // for(const cetificate of company.certificates){
        //     if(cetificate.key){
        //         let url = await this._s3Service.generateViewUrl(cetificate.key)
        //         documentUrl.push(url)
        //     }
        // }

        const certificates = await Promise.all(
            company.certificates.map( async (certificate) => ({
                id: certificate._id,
                certificateType: certificate.type,
                certificateNumber: certificate.number,
                certificateUrl: certificate.url
            }))
        )

        return {
            id: company.id,
            name: company.getName(),
            primaryContactEmail: company.getEmail(),
            profileLogo: imageurl,
            legalName: company.legalName,
            website: company.website,
            domain: company.domain,
            teamSize: company.teamSize,
            about: company.about,
            phoneNumber: company.phoneNumber,
            streetName: company.streetName,
            city: company.city,
            country: company.country,
            state: company.country,
            pinCode: company.pinCode,
            primaryContactName: company.primaryContactName,
            billingEmail: company.billingEmail,
            certificates: certificates   
        }
    }
}