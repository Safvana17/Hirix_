import { UserStatus } from "../../../../Domain/enums/userStatus.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { env } from "../../../../Infrastructure/config/env";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IHashService } from "../../../interface/service/IHashService";
import { IMailService } from "../../../interface/service/IMailService";
import { ITokenService } from "../../../interface/service/ITokenService";
import { LoginCompanyInputDTO, LoginCompanyOutputDTO } from "../../dtos/auth/login.company.dto";
import { ILoginCompanyUsecase } from "../../interfaces/auth/ILoginCompanyUsecase";

export class LoginCompanyUsecase implements ILoginCompanyUsecase{
    constructor(
        private _companyRepository: ICompanyRepository,
        private _tokenService: ITokenService,
        private _hashService: IHashService,
        private _mailService: IMailService
    ) {}

    async execute(request: LoginCompanyInputDTO): Promise<LoginCompanyOutputDTO> {
        const company = await this._companyRepository.findByEmail(request.email)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const isValidPassword = await this._hashService.compare(request.password, company.getPassword())
        if(!isValidPassword){
            throw new AppError(authMessages.error.INVALID_PASSWORD, statusCode.BAD_REQUEST)
        }

        if(company.getIsBlocked()){
            throw new AppError(authMessages.error.COMPANY_BLOCKED, statusCode.FORBIDDEN)
        }

        if(company.status === UserStatus.PENDING) {
            throw new AppError(authMessages.success.COMPANY_REGISTER_PENDING, statusCode.FORBIDDEN)
        }

        if(company.status === UserStatus.REJECTED) {
            throw new AppError(authMessages.error.COMPANY_REJECTED, statusCode.FORBIDDEN)
        }

        const id = company.id
        if(!id){
            throw new AppError(authMessages.error.COMPANY_ID_NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(!company.isUserVerified()) {
            const verificationToken = this._tokenService.generateAccessToken({id, email: company.getEmail(), role: company.getRole()})

            const verificationLink = `${env.FRONTEND_URL}/company/verifyemail?token=${verificationToken}`
            await this._mailService.sendCompanyVerificationEmail(company.getEmail(), company.getName(), verificationLink)
            throw new AppError(authMessages.error.EMAIL_VERIFICATION_REQUIRED, statusCode.FORBIDDEN)
        }

        const refreshToken =  this._tokenService.generateRefreshToken({id: id, role: company.getRole()})
        const accessToken = this._tokenService.generateAccessToken({id: id, email: company.getEmail(), role: company.getRole()})
        const csrfToken = this._tokenService.generateCsrfToken()

        const hashedRefreshToken = this._hashService.hashToken(refreshToken)
        await this._companyRepository.updateToken(id, hashedRefreshToken)

        return {
            accessToken,
            refreshToken,
            csrfToken,
            company: {
                id: id,
                name: company.getName(),
                email: company.getEmail(),
                role: company.getRole()
            }
        }
    }
}