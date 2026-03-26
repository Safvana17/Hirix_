import { AppError } from "../../../../Domain/errors/app.error";
import { CompanyRepository } from "../../../../Infrastructure/repositories/companyRepository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IMailService } from "../../../interface/service/IMailService";
import { IOtpService } from "../../../interface/service/IOtpService";
import { IOtpStore } from "../../../interface/service/IOtpStore";
import { ResendOtpCompanyInputDTO, ResendOtpCompanyOutputDTO } from "../../dtos/auth/resendOtp.company.dto";
import { IResendOtpCompanyUsecase } from "../../interfaces/auth/IResendOtpUsecase";

export class ResendOtpCompanyUsecase implements IResendOtpCompanyUsecase{
    constructor(
        private companyRepository: CompanyRepository,
        private mailService: IMailService,
        private otpStore: IOtpStore,
        private otpService: IOtpService
    ) {}

    async execute(request: ResendOtpCompanyInputDTO): Promise<ResendOtpCompanyOutputDTO> {
        const company = await this.companyRepository.findByEmail(request.email)
        if(!company){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const id = company.id
        const companyId = id!
        const otp = this.otpService.generate()
        const hashedOtp = await this.otpService.hash(otp)

        await this.otpStore.saveOtp(companyId, hashedOtp, 120)
        await this.mailService.sentOtp(company.getEmail(), hashedOtp)

        return {
            success: true
        }
    }
}