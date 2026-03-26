import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IOtpService } from "../../../interface/service/IOtpService";
import { IOtpStore } from "../../../interface/service/IOtpStore";
import { ITokenService } from "../../../interface/service/ITokenService";
import { VerifyCompanyOtpForForgotPasswordInputDTO, VerifyCompanyOtpForForgotPasswordOutputDTO } from "../../dtos/auth/verifyOtpForForgotpassword.company.dto";
import { ICompanyVerifyOtpForForgotPasswordUsease } from "../../interfaces/auth/ICompany.verifyOtpForForgotpassword.usecase";

export class VerifyCompanyOtpForForgotPasswordUsecase implements ICompanyVerifyOtpForForgotPasswordUsease {
    constructor(
        private _companyRepository: ICompanyRepository,
        private _otpService: IOtpService,
        private _otpStore: IOtpStore,
        private _tokenService: ITokenService
    ) {}

    async execute(request: VerifyCompanyOtpForForgotPasswordInputDTO): Promise<VerifyCompanyOtpForForgotPasswordOutputDTO> {
        const company = await this._companyRepository.findByEmail(request.email)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const companyId = company.getId()
        const storedOtp = await this._otpStore.getOtp(companyId)
        if(!storedOtp){
            throw new AppError(authMessages.error.OTP_EXPIRED, statusCode.BAD_REQUEST)
        }

        const valid = await this._otpService.compare(request.otp, storedOtp)
        if(!valid){
            throw new AppError(authMessages.error.INVALID_OTP, statusCode.BAD_REQUEST)
        }

        const resetToken = this._tokenService.generateResetTokenForForgotPassword(company.getEmail())
        await this._otpStore.deleteOtp(companyId)

        return {
            email: company.getEmail(),
            resetToken
        }
    }
}