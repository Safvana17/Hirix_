import userRole from "../../../../Domain/enums/userRole.enum";
import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { env } from "../../../../Infrastructure/config/env";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { settingsMessages } from "../../../../Shared/constsnts/messages/settingsMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { logger } from "../../../../utils/logging/loger";
import { IMailService } from "../../../interface/service/IMailService";
import { ITokenService } from "../../../interface/service/ITokenService";
import { SendRestoreAccountEmailInputDTO, SendRestoreAccountEmailOutputDTO } from "../../dtos/settings/deleteAccount.company.dto";
import { ISendRestoreAccountEmailUsecase } from "../../interfaces/settings/iCompany.sendRestoreAccountEmail.usecase";

export class SendRestoreAccountEmailUsecase implements ISendRestoreAccountEmailUsecase {
    constructor(
        private _companyRepository: ICompanyRepository,
        private _mailService: IMailService,
        private _tokenService: ITokenService
    ) {}

    async execute(request: SendRestoreAccountEmailInputDTO): Promise<SendRestoreAccountEmailOutputDTO> {
        if(request.role !== userRole.Company){
            throw new AppError(settingsMessages.error.NOT_COMPANY, statusCode.BAD_REQUEST)
        }

        const company = await this._companyRepository.findByEmail(request.email)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const restoreToken = await this._tokenService.generateRestoreAccountToken(company.getEmail())
        const restoreAccountLink = `${env.FRONTEND_URL}/company/restore-account?token=${restoreToken}`
        logger.info({link: restoreAccountLink}, 'Restore account link')

        // await this._mailService.sendAccountRestoreEmail(company.getEmail(), company.getName(), restoreAccountLink)

        return { success: true}
    }
}