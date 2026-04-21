import { AppError } from "../../../../Domain/errors/app.error";
import ICompanyRepository from "../../../../Domain/repositoryInterface/iCompany.repository";
import { authMessages } from "../../../../Shared/constsnts/messages/authMessages";
import { statusCode } from "../../../../Shared/Enumes/statusCode";
import { IMailService } from "../../../interface/service/IMailService";
import { IOtpService } from "../../../interface/service/IOtpService";
import { IOtpStore } from "../../../interface/service/IOtpStore";
import { CompanyForgotPasswordInputDTO, CompanyForgotPasswordOutputDTO } from "../../dtos/auth/forgotPassword.company.dto";
import { ICompanyForgotPasswordUsecase } from "../../interfaces/auth/ICompanyForgotPasswordUsecase";

export class CompanyForgotPasswordUsecase implements ICompanyForgotPasswordUsecase{
    constructor(
        private companyRepository: ICompanyRepository,
        private mailService: IMailService,
        private otpService: IOtpService,
        private otpStore: IOtpStore 
    ) {}

    async execute(request: CompanyForgotPasswordInputDTO): Promise<CompanyForgotPasswordOutputDTO> {
        const company = await this.companyRepository.findByEmail(request.email)

        if(!company || !company.id){
            throw new AppError(authMessages.error.COMPANY_NOT_FOUND, statusCode.NOT_FOUND)
        }

        const id = company.id
        // const candidateId = id!;

        const otp = this.otpService.generate()
        const hashedOtp = await this.otpService.hash(otp)

        await this.otpStore.saveOtp(id, hashedOtp, 120)
        // await this.mailService.sentOtp(company.getEmail(), otp)

        return {success: true}
    }
}