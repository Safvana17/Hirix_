import CompanyEntity from "../../../../Domain/entities/company.entity";
import userRole from "../../../../Domain/enums/userRole.enum";
import { UserStatus } from "../../../../Domain/enums/userStatus.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { settingsMessages } from "../../../../Shared/constsnts/messages/settingsMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { logger } from "../../../../utils/logging/loger";
import { IGoogleAuthService } from "../../../interface/service/IGoogleAuthService";
import { IHashService } from "../../../interface/service/IHashService";
import { ITokenService } from "../../../interface/service/ITokenService";
import { LoginCompanyOutputDTO } from "../../dtos/auth/login.company.dto";
import { ICompanyGoogleLoginUsecase } from "../../interfaces/auth/ICompanyGoogleLoginUsecase";

export class CompanyGoogleLoginUsecase implements ICompanyGoogleLoginUsecase{
    constructor(
        private _companyRepository: ICompanyRepository,
        private _tokenService: ITokenService,
        private _hashService: IHashService,
        private _googleAuthService: IGoogleAuthService
    ) {}

    async execute(token: string, role: userRole): Promise<LoginCompanyOutputDTO> {

        logger.info(`user role: ${role}`)
        const googleCompanyInfo = await this._googleAuthService.getUserInfo(token)
        let company = await this._companyRepository.findByEmail(googleCompanyInfo.email)

        if(!company){
            const newCompany = new CompanyEntity(
                "",
                googleCompanyInfo.name,
                googleCompanyInfo.email,
                "",
                googleCompanyInfo.isVerified,
                false,
                false,
                UserStatus.PENDING,
                false,
                googleCompanyInfo.googleId
            )

            company = await this._companyRepository.create(newCompany)
        }else{
            if(!company.getGoogleId()){
                company = await this._companyRepository.updateGoogleId(googleCompanyInfo.email, googleCompanyInfo.googleId) || company
            }else if(company.getGoogleId() !== googleCompanyInfo.googleId){
                throw new AppError(authMessages.error.INVALID_GOOGLE_ID, statusCode.BAD_REQUEST)
            }
        }

        if(!company || !company.getId() || !company.getRole()){
             throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }
        if(company.isDeleted){
            if(!company.deletedAt){
                throw new AppError(settingsMessages.success.ACCOUNT_DELETED, statusCode.FORBIDDEN)
            }

            const now = new Date()
            const diffInDays = (now.getTime() - company.deletedAt?.getTime()) / (1000 * 60 * 24)

            if(diffInDays > 30){
                throw new AppError(settingsMessages.error.DELETED_PERMENANTLY, statusCode.FORBIDDEN)
            }

            throw new AppError(settingsMessages.error.ACOUNT_DEACTIVATED, statusCode.FORBIDDEN)
        }
        
        if(company.getStatus() === UserStatus.PENDING){
            throw new AppError(authMessages.success.COMPANY_REGISTER_PENDING, statusCode.FORBIDDEN)
        }

        if(company.getStatus() === UserStatus.BLOCKED){
            throw new AppError(authMessages.error.COMPANY_BLOCKED, statusCode.FORBIDDEN)
        }

        if(company.getStatus() === UserStatus.REJECTED){
            throw new AppError(authMessages.error.COMPANY_REJECTED, statusCode.FORBIDDEN)
        }
        
        const id = company.getId()
        const companyId = id!

        const refreshToken = this._tokenService.generateRefreshToken({id: companyId, role: company.getRole()})
        const accessToken = this._tokenService.generateAccessToken({id: companyId, email: company.getEmail(), role: company.getRole()})
        const csrfToken = this._tokenService.generateCsrfToken()

        const hashedRefreshToken = this._hashService.hashToken(refreshToken)
        await this._companyRepository.updateToken(companyId, hashedRefreshToken)

        return {
            refreshToken,
            accessToken,
            csrfToken,
            company: {
                id: companyId,
                email: company.getEmail(),
                name: company.getName(),
                role: company.getRole()
            }
        }
    }
}