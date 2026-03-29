import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { settingsMessages } from "../../../../Shared/constsnts/messages/settingsMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IHashService } from "../../../interface/service/IHashService";
import { ITokenService } from "../../../interface/service/ITokenService";
import { ConfirmRestoreAccountInputDto, ConfirmRestoreAccountOutputDto } from "../../dtos/settings/deleteAccount.company.dto";
import { IConfirmRestoreAccountUsecase } from "../../interfaces/settings/iCompany.confirmRestoreAccount.usecase";

export class ConfirmRestoreAccountUsecase implements IConfirmRestoreAccountUsecase {
    constructor (
        private _companyRepository: ICompanyRepository,
        private _tokenService: ITokenService,
        private _hashService: IHashService
    ) {}

    async execute(request: ConfirmRestoreAccountInputDto): Promise<ConfirmRestoreAccountOutputDto> {
        const payload = await this._tokenService.verifyRestoreAccountToken(request.token)
        const company = await this._companyRepository.findByEmail(payload.email)
        if(!company || !company.getId()){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        if(company.getIsBlocked()){
            throw new AppError(authMessages.error.COMPANY_BLOCKED, statusCode.FORBIDDEN)
        }


        if(!company.deletedAt){
            throw new AppError(settingsMessages.success.ACCOUNT_DELETED, statusCode.FORBIDDEN)
        }

        const now = new Date()
        const diffInDays = (now.getTime() - company.deletedAt?.getTime()) / (1000 * 60 * 60 * 24)
        if(diffInDays > 30){
            throw new AppError(settingsMessages.error.DELETED_PERMENANTLY, statusCode.FORBIDDEN)
        }

        company.isDeleted = false
        company.deletedAt = null
        company.deleteReason = ''
        company.deleteFeedback = ''
        await this._companyRepository.update(company.id, company)

        const refreshToken =  this._tokenService.generateRefreshToken({id: company.id, role: company.getRole()})
        const accessToken = this._tokenService.generateAccessToken({id: company.id, email: company.getEmail(), role: company.getRole()})
        const csrfToken = this._tokenService.generateCsrfToken()

        const hashedRefreshToken = this._hashService.hashToken(refreshToken)
        await this._companyRepository.updateToken(company.id, hashedRefreshToken)

        return {
            accessToken,
            refreshToken,
            csrfToken,
            company: {
                id: company.id,
                name: company.getName(),
                email: company.getEmail(),
                role: company.getRole()
            }
        }
    }
}