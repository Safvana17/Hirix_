import { CompanyCertificate } from "../../../../Domain/entities/Company.entity";
import { NotificationEvents } from "../../../../Domain/enums/notification";
import userRole from "../../../../Domain/enums/userRole.enum";
import { UserStatus } from "../../../../Domain/enums/userStatus.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { settingsMessages } from "../../../../Shared/constsnts/messages/settingsMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IAdminProcessNotificationUsecase } from "../../../admin/interfaces/settings/IAdmin.processNotification.usecase";
import { IS3Service } from "../../../interface/service/IS3Service";
import { UpdateCompanyProfileInputDTO, UpdateCompanyProfileOutputDTO } from "../../dtos/settings/settings.company.dto";
import { ICompanyUpdateProfileUsecase } from "../../interfaces/settings/iCompany.updateProfile.usecase";

export class UpdateCompanyProfileUsecase implements ICompanyUpdateProfileUsecase {
    constructor(
        private _companyRepository: ICompanyRepository,
        private _processNotificationUsecase: IAdminProcessNotificationUsecase,
        private _s3Service: IS3Service
    ) {}

    async execute(request: UpdateCompanyProfileInputDTO): Promise<UpdateCompanyProfileOutputDTO> {

        console.log("request:", request)
        const company = await this._companyRepository.findById(request.id)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const prevCertifcates = company.certificates ?? []
        const existingCertificateMap = new Map(prevCertifcates.map(cert => [cert._id, cert]))

        const folder = 'documents'
        const certificates: CompanyCertificate[] = []
        if(request.certificates?.length){
            // for(const certificate of request.certificates ) {
            //     const existing = certificate.id ? existingCertificateMap.get(certificate.id) : undefined
            //     if(certificate.certificateType === 'GST' && !certificate.certificateNumber){
            //         throw new AppError(settingsMessages.error.GST_NUMBER_REQUIRED, statusCode.BAD_REQUEST)
            //     }
            //     let key = existing?.key ?? ""
            //     let fileName = existing?.fileName ??  ""
            //     let contentType = existing?.contentType ?? ""
            //     let url = existing?.url ?? ""

            //     if(certificate.certificateFile){
            //         if(existing?.key){
            //             await this._s3Service.deleteFile(existing.key)
            //         }
            //         key = await this._s3Service.uploadFile(folder, certificate.certificateFile.buffer!, certificate.certificateFile.originalname!, certificate.certificateFile.mimetype!)
            //         url = await this._s3Service.generateViewUrl(key)
            //         fileName = certificate.certificateFile.originalname!
            //         contentType = certificate.certificateFile.mimetype!
            //     }
            //     certificates.push({
            //         type: certificate.certificateType,
            //         number: certificate.certificateNumber ?? "",
            //         key,
            //         url,
            //         fileName: fileName,
            //         contentType: contentType
            //     })
            // }

for (const certificate of request.certificates) {
  const existing = certificate.id
    ? existingCertificateMap.get(certificate.id)
    : certificate.key
      ? prevCertifcates.find(c => c.key === certificate.key)
      : undefined

  let key = existing?.key ?? certificate.key ?? ""
  let fileName = existing?.fileName ?? certificate.fileName ?? ""
  let contentType = existing?.contentType ?? certificate.contentType ?? ""
  let url = existing?.url ?? ""

  if (certificate.certificateFile) {
    if (existing?.key) await this._s3Service.deleteFile(existing.key)
    key = await  this._s3Service.uploadFile(folder, certificate.certificateFile.buffer!, certificate.certificateFile.originalname!, certificate.certificateFile.mimetype!)
    url = await this._s3Service.generateViewUrl(key)
    fileName = certificate.certificateFile.originalname!
    contentType = certificate.certificateFile.mimetype!
  }

const cert: CompanyCertificate = {
  type: certificate.certificateType,
  number: certificate.certificateNumber ?? "",
  key,
  url,
  fileName,
  contentType,
};

if (certificate.id) {
  cert._id = certificate.id;
} else if (existing?._id) {
  cert._id = existing._id;
}

certificates.push(cert);
}
        }

        const deletedCertificates = prevCertifcates.filter((prev) => !certificates.some(cert => cert.key === prev.key))
        for (const cert of deletedCertificates) {
            if (cert.key) {
                await this._s3Service.deleteFile(cert.key)
            }
        }
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
        company.certificates = certificates
        company.isAdminVerified = false
        company.status = UserStatus.PENDING

        
        const updatedCompany = await this._companyRepository.update(company.getId(), company)
        if(!updatedCompany){
            throw new AppError(settingsMessages.error.UPDATE_COMPANY_FAILED, statusCode.SERVER_ERROR)
        }

        await this._processNotificationUsecase.execute({
            event: NotificationEvents.COMPANY_PROFILE_UPDATED,
            recipients: [{
                recipientType: userRole.Admin
            }],
            variables: {
                companyName: updatedCompany.getName()
            },
            metaData: {
                companyId: updatedCompany.id
            }
        })

        return {
            company: updatedCompany
        }
    }
}